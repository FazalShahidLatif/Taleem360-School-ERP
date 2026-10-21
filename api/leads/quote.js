/**
 * POST /api/leads/quote — quote and enquiry capture for Taleem360.
 *
 * Accepts a JSON body (the in-app React form) or a form-encoded body (the
 * static prerendered form, which must work with JavaScript disabled), and
 * forwards the lead to LEAD_WEBHOOK_URL — a Google Apps Script web app that
 * appends a row to the leads spreadsheet.
 *
 * DESIGN RULE: never report success unless the lead was actually delivered.
 *
 * The previous contact form in this codebase faked its submission with a
 * setTimeout and discarded every enquiry silently. A form that lies about
 * success is worse than a form that is visibly broken, because the school
 * believes it has been heard and never follows up. If delivery fails, this
 * endpoint says so and gives the visitor a working email address instead.
 *
 * Required environment variable:
 *   LEAD_WEBHOOK_URL — Apps Script web app URL ending in /exec
 *
 * Optional:
 *   LEAD_SHARED_SECRET — echoed to the web app so the script can reject
 *                        anything that did not come through this endpoint
 */

/** Field length caps, to keep a malformed or hostile body from bloating the sheet. */
const MAX_LEN = {
  institutionName: 200,
  contactName: 120,
  email: 200,
  phone: 40,
  country: 80,
  city: 80,
  institutionType: 60,
  studentCount: 20,
  campusCount: 20,
  currentSystem: 200,
  message: 2000,
};

/** Values accepted for institutionType. Anything else is coerced to 'Other'. */
const INSTITUTION_TYPES = [
  'K-12 school',
  'School group / multi-campus',
  'Madrasa',
  'Daycare / early years',
  'Academy / vocational training',
  'Private tutor',
  'Other',
];

/**
 * Best-effort in-memory throttle. Serverless instances are ephemeral and there
 * may be several, so this is a speed bump rather than a guarantee — it stops a
 * naive script from hammering one warm instance. Real abuse protection belongs
 * at the edge.
 */
const recent = new Map();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;

function isThrottled(ip) {
  const now = Date.now();
  const hits = (recent.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  hits.push(now);
  recent.set(ip, hits);
  if (recent.size > 500) {
    for (const [key, times] of recent) {
      if (!times.some((t) => now - t < WINDOW_MS)) recent.delete(key);
    }
  }
  return hits.length > MAX_PER_WINDOW;
}

/** Parses a form-encoded body into a flat object. */
function parseFormEncoded(raw) {
  const out = {};
  for (const pair of String(raw).split('&')) {
    if (!pair) continue;
    const idx = pair.indexOf('=');
    const key = idx === -1 ? pair : pair.slice(0, idx);
    const value = idx === -1 ? '' : pair.slice(idx + 1);
    try {
      out[decodeURIComponent(key.replace(/\+/g, ' '))] = decodeURIComponent(value.replace(/\+/g, ' '));
    } catch {
      /* skip malformed pair */
    }
  }
  return out;
}

/** Normalises the request body regardless of content type. */
function readBody(req) {
  const body = req.body;
  if (!body) return {};
  if (typeof body === 'object') return body;
  const raw = String(body);
  if (raw.trim().startsWith('{')) {
    try {
      return JSON.parse(raw);
    } catch {
      return {};
    }
  }
  return parseFormEncoded(raw);
}

function clean(value, cap) {
  if (value === undefined || value === null) return '';
  return String(value).trim().slice(0, cap);
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default async function handler(req, res) {
  const wantsHtml = !String(req.headers['content-type'] || '').includes('application/json');

  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, X-Requested-With');

  if (req.method === 'OPTIONS') return res.status(200).end();

  /** Responds in whichever shape the caller can consume. */
  const fail = (status, message) => {
    if (wantsHtml) {
      res.writeHead(303, { Location: `/pricing?quote=error#quote` });
      return res.end();
    }
    return res.status(status).json({ ok: false, detail: message });
  };
  const succeed = () => {
    if (wantsHtml) {
      res.writeHead(303, { Location: '/thank-you' });
      return res.end();
    }
    return res.status(200).json({ ok: true });
  };

  if (req.method !== 'POST') return fail(405, 'Method Not Allowed');

  const ip =
    (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
    req.socket?.remoteAddress ||
    'unknown';
  if (isThrottled(ip)) {
    return fail(429, 'Too many requests. Please try again in a minute, or email support@taleem360.online.');
  }

  const body = readBody(req);

  // Honeypot: a field hidden from humans. Bots fill it, so treat a filled
  // honeypot as success without delivering anything.
  if (clean(body.website, 200)) return succeed();

  const lead = {
    institutionName: clean(body.institutionName, MAX_LEN.institutionName),
    contactName: clean(body.contactName, MAX_LEN.contactName),
    email: clean(body.email, MAX_LEN.email).toLowerCase(),
    phone: clean(body.phone, MAX_LEN.phone),
    country: clean(body.country, MAX_LEN.country),
    city: clean(body.city, MAX_LEN.city),
    institutionType: clean(body.institutionType, MAX_LEN.institutionType),
    studentCount: clean(body.studentCount, MAX_LEN.studentCount),
    campusCount: clean(body.campusCount, MAX_LEN.campusCount),
    currentSystem: clean(body.currentSystem, MAX_LEN.currentSystem),
    message: clean(body.message, MAX_LEN.message),
    whiteLabel: body.whiteLabel === 'on' || body.whiteLabel === true || body.whiteLabel === 'true',
  };

  // Validation. A quote needs the school's size; a general enquiry does not.
  const formType = clean(body.formType, 20) === 'contact' ? 'contact' : 'quote';
  const missing = [];
  if (!lead.contactName) missing.push('your name');
  if (!lead.email) missing.push('email');
  if (formType === 'quote') {
    if (!lead.institutionName) missing.push('institution name');
    if (!lead.studentCount) missing.push('number of students');
  } else if (!lead.message) {
    missing.push('your message');
  }
  if (missing.length) return fail(400, `Please provide: ${missing.join(', ')}.`);
  if (!EMAIL_RE.test(lead.email)) return fail(400, 'Please enter a valid email address.');

  if (!INSTITUTION_TYPES.includes(lead.institutionType)) {
    lead.institutionType = lead.institutionType || 'Other';
  }

  const webhook = process.env.LEAD_WEBHOOK_URL;
  if (!webhook) {
    // Loud, not silent. The operator sees the cause; the visitor gets a route
    // that actually works.
    console.error(
      '[leads/quote] LEAD_WEBHOOK_URL is not set, so the lead could not be delivered. ' +
        'Set it in the Vercel project environment variables. See docs/lead-capture-setup.md.'
    );
    return fail(
      503,
      'Our enquiry form is temporarily unavailable. Please email support@taleem360.online and we will reply directly.'
    );
  }

  const payload = {
    ...lead,
    formType,
    submittedAt: new Date().toISOString(),
    source: 'taleem360.online',
    page: clean(req.headers.referer, 300),
    secret: process.env.LEAD_SHARED_SECRET || '',
  };

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10_000);
    let upstream;
    try {
      upstream = await fetch(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
        redirect: 'follow',
      });
    } finally {
      clearTimeout(timer);
    }

    if (!upstream.ok) {
      console.error('[leads/quote] Webhook rejected the lead:', upstream.status, await upstream.text().catch(() => ''));
      return fail(502, 'We could not save your enquiry. Please email support@taleem360.online instead.');
    }

    return succeed();
  } catch (err) {
    console.error('[leads/quote] Delivery failed:', err?.message || err);
    return fail(502, 'We could not save your enquiry. Please email support@taleem360.online instead.');
  }
}

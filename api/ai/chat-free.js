/**
 * POST /api/ai/chat-free — free-tier (zero-cost) AI chat for Taleem360.
 *
 * Wires the public-facing AI chatbot to a free model so the site stays at
 * $0 ongoing cost while the pilot earns revenue (mandate: BUILD -> EARN ->
 * INVEST). The premium model keeps the existing Gemini endpoint.
 *
 * INPUT:  { message, context?, userIntent?, consentGiven? }
 * OUTPUT: { answer, intent, leadCaptureNeeded?, leadCaptureMessages? }
 *
 * intent values:
 *   info      — general knowledge about Taleem360 (features, pricing tiers,
 *               modules, roadmap)
 *   pricing   — the user is comparing price / packages
 *   pilot     — the user wants a free 30-day pilot or a demo
 *   buy       — the user wants to start the paid subscription
 *   support   — they need help with the platform
 *   other     — fallback
 *
 * consent gating: when consentGiven is false and the user asks a question
 * that takes them out of the public knowledge base (pricing, pilot, buy,
 * support), the endpoint refuses the personalisation step and returns a
 * consent prompt instead of guessing.
 */
import https from 'node:https';

/** Free-tier model config (set in the Vercel project environment or .env) */
const FREE_MODEL_URL =
  process.env.FREE_AI_MODEL_URL || process.env.OPENROUTER_FREE_MODEL_URL;
const FREE_MODEL_NAME = process.env.FREE_MODEL_NAME || 'solar-mini-4';
const FREE_API_KEY = process.env.FREE_AI_API_KEY || process.env.OPENROUTER_API_KEY;

/** System instruction constrains the free model to the site's real domain. */
const SYSTEM_INSTRUCTION =
  `You are Taleem360 AI, a free assistant for Taleem360 School ERP & LMS (Pakistan).\n` +
  `Taleem360 is a cloud ERP and LMS suite for K-12 schools and daycares in Pakistan.\n` +
  `It covers: student records, attendance, fees, double-entry accounting, report cards,\n` +
  `parent messaging, timetable, examination, library, homework/LMS and transport.\n\n` +
  `Taleem360 pricing: single published price USD 49/month for up to 200 active student\n` +
  `profiles. Extra students, multi-campus and white-label are quoted individually.\n` +
  `A 30-day pilot is free (self-serve). Nothing is sold with missing fields.\n\n` +
  `Answer honestly. If you do not know something (e.g. live school data) say you do\n` +
  `not have that data and point the user to the relevant module. Do not invent prices\n` +
  `or features. Do not share personal data. Keep answers concise and in English.\n` +
  `Always confirm a price or a plan with the current published price page before\n` +
  `recommending a deal.`;

const FREE_MODEL_PROMPT = {
  info:
    'Answer as Taleem360 AI. Keep the answer concise but complete.',
  pricing:
    'The user is asking about price, packages or students. Offer the published ' +
    'USD 49/month plan for up to 200 active student profiles and say larger schools, ' +
    'multi-campus and white-label are quoted. Offer the free 30-day pilot.',
  pilot:
    'The user wants a pilot or demo. Tell them the 30-day pilot is free and self-serve, ' +
    'and offer to capture their contact for a personalised breakdown.',
  buy:
    'The user wants to buy or start the paid plan. Offer the published USD 49/month ' +
    'plan for up to 200 active student profiles and offer a quote for above 200 / ' +
    'multi-campus / white-label. Offer the free 30-day pilot.',
  support:
    'The user wants help with the platform. Ask which module (attendance, fees, finance, ' +
    'exam, etc.) and offer to capture their email for follow-up.',
  other:
    'Answer as Taleem360 AI. Keep it concise. If unsure, say so and point to the ' +
    'pricing or contact page.',
};

/**
 * POST data to a remote HTTPS endpoint and parse the JSON body.
 * node-fetch is not guaranteed in the Vercel serverless runtime, so use
 * node's native https module.
 */
function postJson(url, payload, timeoutMs = 15000) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const options = {
      hostname: parsed.hostname,
      port: parsed.port || 443,
      path: parsed.pathname + parsed.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(JSON.stringify(payload)),
      },
      timeout: timeoutMs,
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (err) {
          reject(new Error(`Invalid JSON from free AI backend: ${data.slice(0, 200)}`));
        }
      });
    });

    req.on('timeout', () => {
      req.destroy(new Error('Free AI backend request timed out'));
    });
    req.on('error', reject);
    req.write(JSON.stringify(payload));
    req.end();
  });
}

/** Fails closed: when the free model is unavailable, return a useful hint. */
function failClosed(res) {
  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).json({
    answer:
      'The free AI assistant is temporarily unavailable. ' +
      'Please email support@taleem360.online and we will reply directly.',
    intent: 'support',
    leadCaptureNeeded: false,
  });
}

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ detail: 'Method Not Allowed' });
  }

  let body = {};
  try {
    body = JSON.parse(String(req.body || '{}'));
  } catch {
    return res.status(400).json({ detail: 'Invalid JSON body' });
  }

  const message = String(body.message || '').trim();
  if (!message) {
    return res.status(400).json({ detail: 'Please send a message.' });
  }

  const intent = String(body.userIntent || 'other').toLowerCase();
  const consentGiven = !!body.consentGiven;
  const rawContext = body.context || {};
  const schoolName = String(rawContext.schoolName || '').trim();

  // ---- consent gating -------------------------------------------------
  const CONFIDENTIAL_INTENTS = ['pricing', 'pilot', 'buy', 'support'];
  if (!consentGiven && CONFIDENTIAL_INTENTS.includes(intent)) {
    // Do not answer confidential questions from a non-consenting user.
    return res.status(200).json({
      answer:
        'Before I can answer personal questions, please accept our Privacy Policy and ' +
        'Terms of Service in the footer. This keeps your school data safe with us.',
      intent: 'info',
      leadCaptureNeeded: false,
    });
  }

  // ---- free model call -------------------------------------------------
  const payload = {
    model: FREE_MODEL_NAME,
    messages: [
      { role: 'system', content: SYSTEM_INSTRUCTION },
      { role: 'user', content: message },
    ],
    temperature: 0.3,
    max_tokens: 700,
    school_name: schoolName,
  };

  if (FREE_MODEL_URL) {
    try {
      const result = await postJson(FREE_MODEL_URL, payload, 12000);
      return res.status(200).json({
        answer: String(result.answer || result.reply || result.output || '').trim(),
        intent,
        leadCaptureNeeded: result.leadCaptureNeeded === true,
        leadCaptureMessages: result.leadCaptureMessages || null,
      });
    } catch (err) {
      console.error('[api/ai/chat-free] free model error:', err.message);
      // Fall through to fail-closed hint.
    }
  }

  // No URL configured or the call failed -> return a helpful, honest message.
  return failClosed(res);
}

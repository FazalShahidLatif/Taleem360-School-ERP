/**
 * Taleem360 Static Page Content & Template Module
 *
 * Single source of truth for the prerendered HTML of every public marketing
 * route. The generator (scripts/generate-static-html.ts) composes each page
 * from this module so that:
 *
 *   1. Every route serves a DISTINCT, visible, crawlable body — never an
 *      empty shell and never the SPA index.html.
 *   2. Every page carries real navigation and a full footer link graph, so no
 *      page is an orphan and internal linking is complete.
 *   3. Styling is self-contained critical CSS — the page is readable and
 *      complete with JavaScript disabled.
 *   4. The client bundle is referenced through placeholders that a post-build
 *      step fills with the real hashed asset paths from dist/index.html.
 *
 * Brand tokens follow BRAND.md (Cosmic Slate + Emerald).
 */

export const BRAND = {
  name: 'Taleem360',
  domain: 'https://taleem360.online',
  tagline: 'School Cloud ERP & LMS Suite',
  description:
    'Cloud ERP for Pakistani schools: attendance, fee collection, double-entry accounting, report cards and parent alerts.',
  email: 'support@taleem360.online',
  phone: '+92-332-2137898',
  phoneHref: '+923322137898',
  whatsapp: '923322137898',
  address: {
    street: '26/792 Cantt Bazar, Drigh Road',
    city: 'Karachi',
    postalCode: '75350',
    country: 'PK',
  },
} as const;

/** Brand palette — mirrors BRAND.md. */
export const COLORS = {
  slate900: '#0F172A',
  slate800: '#1E293B',
  slate700: '#334155',
  slate500: '#64748B',
  slate100: '#F1F5F9',
  slate50: '#F8FAFC',
  emerald500: '#10B981',
  emerald600: '#059669',
  emerald50: '#ECFDF5',
  white: '#FFFFFF',
  line: '#E2E8F0',
} as const;

/** Primary top navigation. */
export const NAV_LINKS: { label: string; href: string }[] = [
  { label: 'Pricing', href: '/pricing' },
  { label: 'Daycare', href: '/daycare' },
  { label: 'Madrasa', href: '/madrasa' },
  { label: 'Skills Academy', href: '/skills-academy' },
  { label: 'White Label', href: '/white-label' },
  { label: 'Blog', href: '/blog' },
  { label: 'Free Resources', href: '/free-resources' },
];

/**
 * Footer link graph. Every public route appears here at least once, which is
 * what removes orphan pages and gives every URL a crawlable inbound path.
 */
export const FOOTER_SECTIONS: { heading: string; links: { label: string; href: string }[] }[] = [
  {
    heading: 'Product',
    links: [
      { label: 'Overview', href: '/' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Compare', href: '/compare' },
      { label: 'Biometric Attendance', href: '/biometric-attendance' },
      { label: 'API & Integrations', href: '/api' },
      { label: 'AI Resource Studio', href: '/ai-resource-studio' },
    ],
  },
  {
    heading: 'Solutions',
    links: [
      { label: 'K-12 Schools', href: '/' },
      { label: 'Daycare & ECE', href: '/daycare' },
      { label: 'Madrasa', href: '/madrasa' },
      { label: 'Private Tutors', href: '/private-tutors' },
      { label: 'Skills Academy', href: '/skills-academy' },
      { label: 'White Label', href: '/white-label' },
    ],
  },
  {
    heading: 'Regions',
    links: [
      { label: 'Karachi', href: '/karachi' },
      { label: 'Lahore', href: '/lahore' },
      { label: 'Islamabad', href: '/islamabad' },
      { label: 'Rawalpindi', href: '/rawalpindi' },
      { label: 'Faisalabad', href: '/faisalabad' },
      { label: 'Multan', href: '/multan' },
      { label: 'Peshawar', href: '/peshawar' },
      { label: 'Quetta', href: '/quetta' },
      { label: 'UAE', href: '/uae' },
      { label: 'Nigeria', href: '/nigeria' },
      { label: 'Bangladesh', href: '/bangladesh' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Support', href: '/support' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Free Resources', href: '/free-resources' },
      { label: 'Blog', href: '/blog' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Cookie Policy', href: '/cookies' },
      { label: 'Refund Policy', href: '/refund-policy' },
    ],
  },
];

/** Shared product capability blocks, reused across solution pages. */
export const CORE_CAPABILITIES: { title: string; body: string }[] = [
  {
    title: 'Attendance that runs itself',
    body: 'Biometric and manual marking, per-period registers, staff duty rosters and automatic parent absence alerts over SMS and WhatsApp.',
  },
  {
    title: 'Fee collection without the queue',
    body: 'Vouchers, partial payments, sibling discounts, arrears tracking and reconciliation against a double-entry ledger — with mobile-wallet and bank channels.',
  },
  {
    title: 'Double-entry accounting built in',
    body: 'A real chart of accounts, journals, ledgers, trial balance and audit-ready financial statements. No spreadsheet exports required.',
  },
  {
    title: 'Report cards and exam workflows',
    body: 'Configurable grading schemes, term and board patterns, remark banks and one-click parent-visible report cards.',
  },
  {
    title: 'Parent portal and messaging',
    body: 'A branded parent login for attendance, dues, results and announcements, plus bulk messaging to any grade, section or route.',
  },
  {
    title: 'Multi-campus, multi-tenant',
    body: 'One account, many branches. Central dashboards with per-campus isolation, role-based access and white-labelled subdomains.',
  },
];

/** Shared FAQ answers, used where a route has no specific FAQ set. */
export const CORE_FAQS: { q: string; a: string }[] = [
  {
    q: 'How long does setup take?',
    a: 'Most schools are running on Taleem360 within a week. Import your student and staff lists from CSV, map your fee heads, and go live. The 30-day pilot includes onboarding support at no cost.',
  },
  {
    q: 'Do we need to pay to try it?',
    a: 'No. The pilot runs for 30 days with full module access and no credit card. Paid licences are activated only after you decide to continue.',
  },
  {
    q: 'Does it work on slow internet?',
    a: 'Yes. Pages are served as static HTML so they open quickly on low bandwidth, and data entry works in short sessions without long-lived connections.',
  },
  {
    q: 'Can parents access it from a phone?',
    a: 'The parent portal is mobile-first. Parents log in from any browser to view attendance, dues, results and school announcements.',
  },
];

export type SectionTable = { caption?: string; headers: string[]; rows: string[][] };
export type Section = { h2: string; body: string[]; bullets?: string[]; table?: SectionTable };
export type Faq = { q: string; a: string };

export type RouteContent = {
  h1: string;
  lead: string;
  sections?: Section[];
  faqs?: Faq[];
  /**
   * Optional crawlable link list rendered as its own section.
   *
   * Added for the blog index: the 55 published posts were listed in the sitemap
   * but linked from nowhere, so Google reported them as "Discovered - currently
   * not indexed". An orphan page in a sitemap is not a ranking candidate; it
   * needs at least one internal link from a crawlable page.
   */
  links?: { href: string; label: string; note?: string }[];
  linksHeading?: string;
};

/** Escapes text for safe HTML text-node and attribute insertion. */
export function esc(s: string): string {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Human-readable label from a route path. */
export function routeLabel(route: string): string {
  const last = route.split('/').filter(Boolean).pop() || 'Home';
  return last
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/\bErp\b/g, 'ERP')
    .replace(/\bLms\b/g, 'LMS')
    .replace(/\bApi\b/g, 'API')
    .replace(/\bFaq\b/g, 'FAQ')
    .replace(/\bEce\b/g, 'ECE')
    .replace(/\bK12\b/g, 'K-12');
}

/** Critical CSS — the page must be fully readable with JS disabled. */
export function renderCriticalCss(): string {
  const c = COLORS;
  return `
:root{--slate-900:${c.slate900};--slate-800:${c.slate800};--slate-700:${c.slate700};--slate-500:${c.slate500};--slate-100:${c.slate100};--slate-50:${c.slate50};--emerald-500:${c.emerald500};--emerald-600:${c.emerald600};--emerald-50:${c.emerald50};--line:${c.line}}
*,*::before,*::after{box-sizing:border-box}
body{margin:0;font-family:Inter,system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;background:#fff;color:var(--slate-700);line-height:1.65;-webkit-font-smoothing:antialiased}
img{max-width:100%;height:auto}
a{color:var(--emerald-600);text-decoration:none}
a:hover{text-decoration:underline}
.t360-wrap{max-width:1120px;margin:0 auto;padding:0 20px}
.t360-skip{position:absolute;left:-9999px;top:0;background:var(--slate-900);color:#fff;padding:10px 16px;z-index:100}
.t360-skip:focus{left:0}
.t360-header{background:var(--slate-900);color:#fff;position:sticky;top:0;z-index:50}
.t360-header .t360-wrap{display:flex;align-items:center;justify-content:space-between;gap:20px;min-height:64px;flex-wrap:wrap}
.t360-brand{display:flex;align-items:center;gap:10px;color:#fff;font-weight:800;font-size:1.15rem;letter-spacing:-.02em}
.t360-brand:hover{text-decoration:none}
.t360-brand-mark{width:34px;height:34px;flex:0 0 34px;border-radius:9px;background:linear-gradient(135deg,var(--emerald-600),var(--emerald-500));display:flex;align-items:center;justify-content:center;color:#fff;font-weight:900;font-size:1rem}
.t360-nav{display:flex;gap:4px;flex-wrap:wrap;align-items:center}
.t360-nav a{color:#CBD5E1;padding:9px 12px;border-radius:8px;font-size:.9rem;font-weight:500;min-height:44px;display:inline-flex;align-items:center}
.t360-nav a:hover{background:var(--slate-800);color:#fff;text-decoration:none}
.t360-nav a[aria-current="page"]{background:var(--emerald-600);color:#fff}
.t360-cta-btn{background:var(--emerald-500);color:#fff!important;font-weight:700;padding:11px 18px;border-radius:9px;display:inline-flex;align-items:center;min-height:44px}
.t360-cta-btn:hover{background:var(--emerald-600);text-decoration:none}
.t360-crumbs{font-size:.82rem;color:var(--slate-500);padding:14px 0 0}
.t360-crumbs ol{list-style:none;display:flex;flex-wrap:wrap;gap:6px;margin:0;padding:0}
.t360-crumbs li+li::before{content:"/";margin-right:6px;color:var(--line)}
.t360-hero{background:linear-gradient(160deg,var(--slate-900),var(--slate-800));color:#fff;padding:52px 0 56px}
.t360-hero h1{font-size:clamp(1.7rem,4vw,2.6rem);line-height:1.2;margin:0 0 16px;letter-spacing:-.025em;color:#fff;font-weight:800}
.t360-hero p{font-size:1.06rem;color:#CBD5E1;max-width:70ch;margin:0 0 26px}
.t360-hero .t360-actions{display:flex;gap:12px;flex-wrap:wrap}
.t360-btn-ghost{border:1.5px solid rgba(255,255,255,.35);color:#fff!important;font-weight:600;padding:11px 18px;border-radius:9px;display:inline-flex;align-items:center;min-height:44px}
.t360-btn-ghost:hover{border-color:#fff;text-decoration:none}
.t360-main{padding:8px 0 0}
.t360-section{padding:34px 0;border-bottom:1px solid var(--slate-100)}
.t360-section:last-of-type{border-bottom:0}
.t360-section h2{font-size:1.4rem;color:var(--slate-900);margin:0 0 14px;letter-spacing:-.02em;font-weight:700}
.t360-table-wrap{overflow-x:auto;margin:18px 0 4px;-webkit-overflow-scrolling:touch}
.t360-table{width:100%;border-collapse:collapse;font-size:.9rem;min-width:520px}
.t360-table caption{text-align:left;font-size:.82rem;color:var(--slate-500);padding:0 0 10px}
.t360-table th,.t360-table td{text-align:left;padding:11px 14px;border-bottom:1px solid var(--slate-200);vertical-align:top}
.t360-table thead th{background:var(--slate-50);color:var(--slate-900);font-weight:700;font-size:.78rem;text-transform:uppercase;letter-spacing:.05em;border-bottom:1px solid var(--slate-300)}
.t360-table tbody tr:last-child td{border-bottom:none}
.t360-table td:first-child{font-weight:600;color:var(--slate-900);white-space:nowrap}
.t360-section h3{font-size:1.06rem;color:var(--slate-900);margin:22px 0 8px;font-weight:700}
.t360-section p{margin:0 0 14px;max-width:78ch}
.t360-section ul{margin:0 0 16px;padding-left:22px}
.t360-section li{margin:0 0 8px}
.t360-link-list{list-style:none;padding:0;margin:14px 0 4px;display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:10px 22px}
.t360-link-list li{margin:0;padding:9px 0;border-bottom:1px solid var(--line);line-height:1.45}
.t360-link-list a{font-weight:600;color:var(--slate-900)}
.t360-link-list a:hover{color:var(--emerald-700);text-decoration:underline}
.t360-link-note{display:block;font-size:.82rem;color:var(--slate-500);font-weight:400}
.t360-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:18px;margin:18px 0 4px}
.t360-card{border:1px solid var(--line);border-radius:14px;padding:20px;background:#fff}
.t360-card h3{margin:0 0 8px;font-size:1rem;color:var(--slate-900)}
.t360-card p{margin:0;font-size:.93rem;color:var(--slate-500)}
.t360-faq details{border:1px solid var(--line);border-radius:12px;padding:14px 16px;margin-bottom:10px;background:var(--slate-50)}
.t360-faq summary{font-weight:700;color:var(--slate-900);cursor:pointer;min-height:28px}
.t360-faq p{margin:10px 0 0;color:var(--slate-700)}
.t360-cta{background:var(--emerald-50);border:1px solid #A7F3D0;border-radius:16px;padding:30px;margin:34px 0}
.t360-cta h2{margin:0 0 10px;color:var(--slate-900);font-size:1.3rem}
.t360-cta p{margin:0 0 18px;color:var(--slate-700)}
.t360-cta-actions{display:flex;gap:12px;flex-wrap:wrap;align-items:center}
.t360-footer{background:var(--slate-900);color:#94A3B8;margin-top:44px;padding:44px 0 26px}
.t360-footer h2{font-size:.78rem;text-transform:uppercase;letter-spacing:.08em;color:#fff;margin:0 0 14px;font-weight:700}
.t360-footer-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:26px}
.t360-footer ul{list-style:none;margin:0;padding:0}
.t360-footer li{margin:0 0 9px}
.t360-footer a{color:#94A3B8;font-size:.9rem}
.t360-footer a:hover{color:#fff}
.t360-footer-bottom{border-top:1px solid #1E293B;margin-top:34px;padding-top:22px;font-size:.85rem;display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap}
.t360-legal{margin-top:8px}
.t360-sr{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
@media(max-width:640px){.t360-hero{padding:36px 0 40px}.t360-section{padding:26px 0}.t360-cta{padding:22px}}
`.trim();
}

/** Renders the sticky header with the primary nav. */
export function renderHeader(activeRoute: string): string {
  const links = NAV_LINKS.map((l) => {
    const current = l.href === activeRoute ? ' aria-current="page"' : '';
    return `        <a href="${esc(l.href)}"${current}>${esc(l.label)}</a>`;
  }).join('\n');
  return `  <header class="t360-header">
    <div class="t360-wrap">
      <a class="t360-brand" href="/">
        <span class="t360-brand-mark" aria-hidden="true">T360</span>
        <span>${esc(BRAND.name)}</span>
      </a>
      <nav class="t360-nav" aria-label="Primary">
${links}
        <a class="t360-cta-btn" href="/contact">Start free pilot</a>
      </nav>
    </div>
  </header>`;
}

/** Renders breadcrumb navigation (visible) for a route. */
export function renderBreadcrumbs(route: string, canonical: string): string {
  if (route === '/') return '';
  const items: { label: string; href: string }[] = [{ label: 'Home', href: '/' }];
  if (route.startsWith('/blog/')) items.push({ label: 'Blog', href: '/blog' });
  items.push({ label: routeLabel(route), href: route });
  const lis = items
    .map((it, i) => {
      const inner =
        i === items.length - 1
          ? esc(it.label)
          : `<a href="${esc(it.href)}">${esc(it.label)}</a>`;
      return `        <li>${inner}</li>`;
    })
    .join('\n');
  return `    <nav class="t360-crumbs" aria-label="Breadcrumb">
      <div class="t360-wrap">
        <ol>
${lis}
        </ol>
      </div>
    </nav>`;
}

/** Renders the shared capability grid. */
export function renderCapabilities(): string {
  const cards = CORE_CAPABILITIES.map(
    (c) => `          <div class="t360-card">
            <h3>${esc(c.title)}</h3>
            <p>${esc(c.body)}</p>
          </div>`
  ).join('\n');
  return `      <section class="t360-section" aria-labelledby="capabilities-heading">
        <h2 id="capabilities-heading">What Taleem360 does</h2>
        <div class="t360-grid">
${cards}
        </div>
      </section>`;
}

/** Renders an FAQ block as an accessible disclosure list. */
export function renderFaqs(faqs: Faq[]): string {
  const items = faqs
    .map(
      (f) => `          <details>
            <summary>${esc(f.q)}</summary>
            <p>${esc(f.a)}</p>
          </details>`
    )
    .join('\n');
  return `      <section class="t360-section t360-faq" aria-labelledby="faq-heading">
        <h2 id="faq-heading">Frequently asked questions</h2>
${items}
      </section>`;
}

/** Renders the closing conversion block. */
export function renderCta(): string {
  return `      <section class="t360-cta" aria-labelledby="cta-heading">
        <h2 id="cta-heading">Start your 30-day free pilot</h2>
        <p>Full module access, no credit card, onboarding included. Tell us about your school and we will set up your workspace.</p>
        <div class="t360-cta-actions">
          <a class="t360-cta-btn" href="/contact">Request a pilot</a>
          <a class="t360-btn-ghost" style="color:#0F172A!important;border-color:#94A3B8" href="/pricing">See pricing</a>
        </div>
      </section>`;
}

/** Renders the footer link graph. */
export function renderFooter(): string {
  const cols = FOOTER_SECTIONS.map((sec) => {
    const links = sec.links
      .map((l) => `            <li><a href="${esc(l.href)}">${esc(l.label)}</a></li>`)
      .join('\n');
    return `        <div>
          <h2>${esc(sec.heading)}</h2>
          <ul>
${links}
          </ul>
        </div>`;
  }).join('\n');
  const year = new Date().getFullYear();
  return `  <footer class="t360-footer">
    <div class="t360-wrap">
      <div class="t360-footer-grid">
${cols}
      </div>
      <div class="t360-footer-bottom">
        <div>
          <strong style="color:#fff">${esc(BRAND.name)}</strong> — ${esc(BRAND.tagline)}<br>
          ${esc(BRAND.address.street)}, ${esc(BRAND.address.city)} ${esc(BRAND.address.postalCode)}, Pakistan<br>
          <a href="mailto:${esc(BRAND.email)}">${esc(BRAND.email)}</a> · <a href="tel:${esc(BRAND.phoneHref)}">${esc(BRAND.phone)}</a>
        </div>
        <div>&copy; ${year} ${esc(BRAND.name)}. All rights reserved.</div>
      </div>
    </div>
  </footer>`;
}

/** Renders the main content column for a route. */
export function renderMain(content: RouteContent, route: string): string {
  const sections = (content.sections || [])
    .map((s) => {
      const paras = s.body.map((p) => `        <p>${esc(p)}</p>`).join('\n');
      const bullets = s.bullets?.length
        ? `\n        <ul>\n${s.bullets.map((b) => `          <li>${esc(b)}</li>`).join('\n')}\n        </ul>`
        : '';
      const table = s.table
        ? `\n        <div class="t360-table-wrap">\n          <table class="t360-table">${
            s.table.caption ? `\n            <caption>${esc(s.table.caption)}</caption>` : ''
          }\n            <thead>\n              <tr>${s.table.headers
            .map((h) => `<th scope="col">${esc(h)}</th>`)
            .join('')}</tr>\n            </thead>\n            <tbody>\n${s.table.rows
            .map((r) => `              <tr>${r.map((c) => `<td>${esc(c)}</td>`).join('')}</tr>`)
            .join('\n')}\n            </tbody>\n          </table>\n        </div>`
        : '';
      return `      <section class="t360-section">
        <h2>${esc(s.h2)}</h2>
${paras}${bullets}${table}
      </section>`;
    })
    .join('\n');

  const faqs = content.faqs && content.faqs.length ? renderFaqs(content.faqs) : '';

  const linkList = content.links && content.links.length
    ? `      <section class="t360-section">
        <h2>${esc(content.linksHeading || 'All pages')}</h2>
        <ul class="t360-link-list">
${content.links
  .map((l) => `          <li><a href="${esc(l.href)}">${esc(l.label)}</a>${l.note ? ` <span class="t360-link-note">${esc(l.note)}</span>` : ''}</li>`)
  .join('\n')}
        </ul>
      </section>`
    : '';

  return `    <div class="t360-hero">
      <div class="t360-wrap">
        <h1>${esc(content.h1)}</h1>
        <p>${esc(content.lead)}</p>
        <div class="t360-actions">
          <a class="t360-cta-btn" href="/contact">Start free pilot</a>
          <a class="t360-btn-ghost" href="/pricing">View pricing</a>
        </div>
      </div>
    </div>
    <main id="main" class="t360-main">
      <div class="t360-wrap">
${sections}
${linkList}
${renderCapabilities()}
${faqs}
${renderCta()}
      </div>
    </main>`;
}

/** Serialises a JSON-LD object into a script tag. */
export function renderJsonLd(schema: object | object[] | undefined): string {
  if (!schema) return '';
  const items = Array.isArray(schema) ? schema : [schema];
  return items
    .map((s) => {
      const json = JSON.stringify(s, null, 2)
        .split('\n')
        .map((line) => '    ' + line)
        .join('\n');
      return `    <script type="application/ld+json">\n${json}\n    </script>`;
    })
    .join('\n');
}

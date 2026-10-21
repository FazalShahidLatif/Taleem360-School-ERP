/**
 * Per-route visible content for the prerendered marketing pages.
 *
 * Every public route needs a distinct, human-readable body: an H1, a lead
 * paragraph, and supporting sections. Routes without an explicit entry get a
 * composed default built from the city/solution/blog pattern so that no page
 * is ever thin or duplicated.
 */

import type { RouteContent, Section, Faq } from './static-content.js';
import { BLOG_POSTS_DATA } from '../lib/blogContent.js';
import {
  INCLUDED_PROFILES,
  PILOT_DAYS,
  INCLUDED_FEATURES,
  QUOTED_SCOPE,
  CURRENCIES,
  publishedPrice,
} from '../lib/pricingCatalog.js';

/**
 * Regional price rows for the pricing table, derived from the currency table
 * so a rate change can never leave the page stale.
 */
const REGIONAL_PRICE_ROWS: string[][] = (['PKR', 'AED', 'SAR', 'BDT', 'NGN'] as const).map((code) => [
  CURRENCIES[code].markets,
  code,
  `${publishedPrice(code)} / month`,
  `Up to ${INCLUDED_PROFILES}`,
]);

/** City routes get a locally-framed page rather than a generic one. */
const CITY_META: Record<string, { city: string; province: string; note: string }> = {
  karachi: {
    city: 'Karachi',
    province: 'Sindh',
    note: 'Pakistan’s largest school market, with the widest spread of private school systems and the highest volume of fee transactions.',
  },
  lahore: {
    city: 'Lahore',
    province: 'Punjab',
    note: 'A dense network of private schools and academies running on parallel campuses that need central oversight.',
  },
  islamabad: {
    city: 'Islamabad',
    province: 'Islamabad Capital Territory',
    note: 'A concentration of premium and international-stream schools with parent bodies that expect digital-first communication.',
  },
  rawalpindi: {
    city: 'Rawalpindi',
    province: 'Punjab',
    note: 'A large garrison-city school sector where staff turnover makes fast onboarding essential.',
  },
  faisalabad: {
    city: 'Faisalabad',
    province: 'Punjab',
    note: 'A fast-growing industrial city where school groups expand by adding branches, not by rebuilding systems.',
  },
  multan: {
    city: 'Multan',
    province: 'Punjab',
    note: 'A regional education hub serving southern Punjab, where connectivity is uneven and offline tolerance matters.',
  },
  peshawar: {
    city: 'Peshawar',
    province: 'Khyber Pakhtunkhwa',
    note: 'A city with a high share of schools serving low-bandwidth areas, where a light front end is a practical requirement.',
  },
  quetta: {
    city: 'Quetta',
    province: 'Balochistan',
    note: 'One of the most bandwidth-constrained provincial capitals, where pages must open on a weak connection.',
  },
};

/** Region/country routes. */
const REGION_META: Record<string, { country: string; note: string }> = {
  uae: {
    country: 'the United Arab Emirates',
    note: 'Schools following British, IB and Ministry curricula that need bilingual parent communication and VAT-ready billing.',
  },
  nigeria: {
    country: 'Nigeria',
    note: 'Private school groups scaling across states, where fee recovery and attendance reporting are the two biggest operational drains.',
  },
  bangladesh: {
    country: 'Bangladesh',
    note: 'A market with a very high density of private schools and coaching centres that still run on paper registers.',
  },
};

/** Solution routes. */
const SOLUTION_CONTENT: Record<string, RouteContent> = {
  '/': {
    h1: 'School cloud ERP and LMS for Pakistan',
    lead:
      'Taleem360 runs attendance, fee collection, double-entry accounting, report cards and parent messaging in one cloud system. Start with a 30-day free pilot — no credit card, onboarding included.',
    sections: [
      {
        h2: 'One system instead of five',
        body: [
          'Most schools run attendance in a register, fees in a spreadsheet, accounts in another file, and parent updates over WhatsApp. Each handoff loses information and costs staff hours every week.',
          'Taleem360 replaces that chain with one database. When a teacher marks attendance, the parent alert, the defaulter list, the attendance register and the monthly report all update from the same record.',
        ],
        bullets: [
          'Attendance: biometric or manual, per period, with automatic parent alerts',
          'Fees: vouchers, partial payments, arrears, sibling discounts, reconciliation',
          'Accounts: chart of accounts, journals, ledgers, trial balance, financial statements',
          'Exams: grading schemes, term and board patterns, report cards',
          'Parent portal: attendance, dues, results and announcements on any phone',
        ],
      },
      {
        h2: 'Built for how schools in Pakistan actually operate',
        body: [
          'Fee collection runs through bank challans and mobile wallets, so the system supports vouchers, partial payments and arrears rather than assuming a card on file. Attendance hardware is often biometric and sometimes shared between campuses, so devices map to sections and shifts rather than to individual users.',
          'Connectivity is not always reliable, so public pages are served as static HTML and open quickly on a weak connection. Data entry works in short sessions without needing a long-lived connection.',
        ],
      },
      {
        h2: 'Multi-campus and white label',
        body: [
          'School groups add branches faster than they add systems. Taleem360 is multi-tenant from the start: one account holds many campuses, each with its own students, staff, fee structure and branding, while the group sees a consolidated view.',
          'White-label deployments give a school network its own subdomain, logo and colours, so parents see the group brand rather than the platform brand.',
        ],
      },
    ],
    faqs: [
      {
        q: 'How much does Taleem360 cost?',
        a: 'The pilot is free for 30 days with full module access and no credit card. Paid licences start after the pilot, priced by the number of active student profiles. See the pricing page for the current tiers.',
      },
      {
        q: 'Can we migrate our existing data?',
        a: 'Yes. Student, staff and fee data can be imported from CSV. Onboarding support is included in the pilot, including help mapping your existing fee heads and grade scales.',
      },
      {
        q: 'Does it handle multiple branches?',
        a: 'Yes. Multi-campus is built in — each branch keeps its own data and branding while head office gets consolidated reporting.',
      },
      {
        q: 'Is there a mobile app for parents?',
        a: 'Parents use a mobile-first web portal, so there is nothing to install. They log in from any browser to see attendance, dues, results and announcements.',
      },
    ],
  },

  '/pricing': {
    h1: 'Taleem360 pricing for schools',
    lead:
      `One price, published openly: ${publishedPrice('USD')} per month for up to ${INCLUDED_PROFILES} active student profiles, or ${publishedPrice('PKR')} per month for schools in Pakistan. A ${PILOT_DAYS}-day free pilot comes first, with no credit card. Larger schools, school groups and white-label deployments are quoted individually so the price tracks your enrolment rather than a bracket you happen to fall into.`,
    sections: [
      {
        h2: 'The price',
        body: [
          'Licences are priced by the number of active student profiles, not by staff seats and not by module. A school with 200 students pays for 200 profiles and can create as many teacher and admin logins as it needs.',
          `The published price is ${publishedPrice('USD')} per month, which covers up to ${INCLUDED_PROFILES} active student profiles and the full core suite listed below. Nothing in that list is a paid extra.`,
          'We invoice in your local currency. Schools in Pakistan are billed in PKR, the Gulf in AED or SAR, Bangladesh in BDT and Nigeria in NGN. The conversion below is indicative — the amount printed on your quote is the amount you pay.',
        ],
        table: {
          caption: 'Published price by region. Indicative conversion; your quote states the exact amount.',
          headers: ['Region', 'Currency', 'Per month', 'Profiles included'],
          rows: [
            ['International (USD)', 'USD', `${publishedPrice('USD')} / month`, `Up to ${INCLUDED_PROFILES}`],
            ...REGIONAL_PRICE_ROWS,
          ],
        },
      },
      {
        h2: 'What the price includes',
        body: [
          'The core suite is never metered and never sold back to you module by module. Everything below is included at the published price:',
        ],
        bullets: INCLUDED_FEATURES,
      },
      {
        h2: 'What is quoted instead of published',
        body: [
          'Above the published profile limit, and for deployments that are not a single campus on a standard licence, we quote. This is deliberate: a school with 1,200 students and a school with 180 are not the same customer, and a published ladder would either overcharge one or undercharge the other.',
        ],
        bullets: QUOTED_SCOPE.map((s) => `${s.title} — ${s.body}`),
      },
      {
        h2: 'White label — run Taleem360 as your own platform',
        body: [
          'White label puts your brand on the entire platform: your logo, your colour scheme, your domain, and a branded parent portal that never mentions Taleem360. It is the right model for school chains, franchise networks and education groups that want a single branded system across every branch, and for academies and training providers that resell access to their own students.',
          'White label is licensed and quoted per deployment, because the scope varies — a two-branch group and a national franchise network need very different things. Tell us your branch count, total student numbers and whether you need your own domain, and we will quote it.',
          'Everything in the core suite comes with it. The difference is ownership of the surface, not the depth of the product.',
        ],
        bullets: [
          'Your logo, colour scheme and typography across every screen',
          'Your own domain, including branded parent and staff subdomains',
          'Parent portal and notifications sent under your name, not ours',
          'Multi-campus central dashboard with per-branch isolation',
          'Quoted per deployment — branch count and student numbers decide the price',
        ],
      },
      {
        h2: 'The 30-day pilot',
        body: [
          'The pilot is a full deployment, not a demo. You get your own workspace, import your real student and staff data, and run live attendance and fee cycles for 30 days.',
          'Nothing is charged during the pilot and no card is required. If you continue, your workspace and data carry over unchanged — there is no second migration.',
        ],
      },
      {
        h2: 'What is not charged',
        body: [
          'There is no setup fee, no per-module charge, no charge for parent accounts, and no charge for onboarding support during the pilot. Annual and term-based billing are both available once you are on a paid licence.',
        ],
      },
      {
        h2: 'Request a quote',
        body: [
          'Tell us the size of your school and we will send a quote in your local currency, usually within one working day. If you are already inside the published price, the quote simply confirms it.',
          'Schools above 200 profiles, multi-campus groups and white-label deployments get a per-profile or per-deployment price built around your actual numbers.',
        ],
        form: 'quote',
      },
    ],
    faqs: [
      {
        q: 'How much does Taleem360 cost?',
        a: `The published price is ${publishedPrice('USD')} per month for up to ${INCLUDED_PROFILES} active student profiles, or ${publishedPrice('PKR')} per month for schools in Pakistan. A ${PILOT_DAYS}-day free pilot comes first and requires no credit card. Schools with more than ${INCLUDED_PROFILES} profiles, multi-campus groups and white-label deployments are quoted individually.`,
      },
      {
        q: 'Do you charge per teacher or per student?',
        a: `Per active student profile. Teacher and admin logins are unlimited at every licence level. The published price covers up to ${INCLUDED_PROFILES} profiles.`,
      },
      {
        q: 'Can we pay in Pakistani rupees?',
        a: 'Yes. Schools in Pakistan are invoiced in PKR. The Gulf is invoiced in AED or SAR, Bangladesh in BDT and Nigeria in NGN. The conversion shown on this page is indicative; the amount on your quote is the amount you pay.',
      },
      {
        q: 'What happens if we have more than 200 students?',
        a: 'We quote you per profile. Larger schools are priced on their actual enrolment, so the price grows with the school rather than jumping at a bracket boundary. Send us your student count and campus count and we will quote it.',
      },
      {
        q: 'What is white label and who is it for?',
        a: 'White label puts your own brand, logo, colours and domain on the whole platform, including the parent portal. It suits school chains, franchise networks, education groups and academies that want one branded system across every branch, or that resell access to their own students. It is licensed and quoted per deployment.',
      },
      {
        q: 'What happens when the pilot ends?',
        a: 'Nothing is charged automatically. You choose a licence and your existing workspace continues with all data intact. If you do not continue, the workspace is deactivated.',
      },
      {
        q: 'Can we pay term by term instead of annually?',
        a: 'Yes. Term-based and annual billing are both available on paid licences.',
      },
      {
        q: 'Is there a discount for school groups?',
        a: 'Yes — groups running several campuses under one account are priced on consolidated profile counts. Contact us with your branch and student numbers for a quote.',
      },
    ],
  },

  '/daycare': {
    h1: 'Daycare and early-years management software',
    lead:
      'Secure check-in and check-out, authorised pickup with PIN matching, minute-accurate late-pickup fees and parent billing — built for daycare centres and ECE programmes.',
    sections: [
      {
        h2: 'The pickup problem is a safety problem',
        body: [
          'Most daycare disputes start at the door: who is allowed to collect the child, and what happens when someone arrives late. Paper sign-in sheets cannot answer either question reliably at 6pm with three parents waiting.',
          'Taleem360 holds an authorised-pickup list per child, each with a PIN. The kiosk verifies the person against the list before releasing the child, and records the exact time of every movement.',
        ],
        bullets: [
          'Per-child authorised pickup list with PIN verification at the kiosk',
          'Timestamped check-in and check-out with a full audit trail',
          'Late-pickup fees calculated to the minute and posted to the parent ledger',
          'Operating-hours configuration so penalties follow your published policy',
          'Daily reports for parents: meals, naps, activities and mood',
        ],
      },
      {
        h2: 'Billing that follows the clock',
        body: [
          'Late fees are the most disputed charge in any daycare. Because the fee is derived from the recorded checkout time and your configured grace period, the parent statement shows the arrival time, the grace window and the calculated amount rather than an unexplained figure.',
          'Standard monthly fees, registration charges, transport and activity fees all post to the same parent ledger, so one statement covers everything.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Do parents need an app for pickup?',
        a: 'No. The centre runs the kiosk and the pickup list; parents receive confirmations and statements through the parent portal.',
      },
      {
        q: 'Can we set our own late-pickup policy?',
        a: 'Yes. You configure operating hours, the grace period and the per-minute or per-block rate, and the system calculates from there.',
      },
      {
        q: 'Can we track meals and naps?',
        a: 'Yes. Daily activity logs cover meals, naps, nappy changes and mood, and can be shared with parents each day.',
      },
    ],
  },

  '/madrasa': {
    h1: 'Madrasa administration software',
    lead:
      'Student records, attendance, hifz and nazira progress, fee collection and donor reporting for madaris and religious schools — on the same platform used by K-12 schools.',
    sections: [
      {
        h2: 'Records that match how a madrasa is organised',
        body: [
          'A madrasa is not a school with different labels. Students move through hifz and nazira tracks at their own pace, classes are grouped by level rather than by age, and many students are residential.',
          'Taleem360 models those structures directly: track and level instead of grade and section, per-student progress against a syllabus, and hostel and boarding records alongside day-student records.',
        ],
        bullets: [
          'Hifz and nazira progress tracking against a defined syllabus',
          'Level-based class grouping rather than age-based grades',
          'Residential and day-student records with guardian contacts',
          'Fee collection, waivers and donation receipts on one ledger',
          'Donor and zakat reporting separated from operating income',
        ],
      },
      {
        h2: 'Transparency for donors and trustees',
        body: [
          'Madaris are accountable to donors and trustees as well as to parents. Because fee income, donations and zakat are posted to a real double-entry ledger, the annual statement can be produced from the system rather than reconstructed from receipts.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Can we track hifz progress by juz and surah?',
        a: 'Yes. Progress is recorded against a syllabus you define, at the juz, surah and ayah level, with per-student history.',
      },
      {
        q: 'Do you support residential students?',
        a: 'Yes. Boarding records, hostel allocation and mess charges sit alongside day-student records.',
      },
      {
        q: 'Can donations be tracked separately from fees?',
        a: 'Yes. Donations, zakat and fee income post to separate ledger heads so reporting stays clean.',
      },
    ],
  },

  '/white-label': {
    h1: 'White-label school ERP for school groups',
    lead:
      'Run Taleem360 under your own brand, on your own subdomain, with your logo and colours. Ideal for school networks, franchise groups and education consultants.',
    sections: [
      {
        h2: 'Your brand, our engine',
        body: [
          'Parents should see the school group they enrolled with, not the software vendor. White-label deployment serves the platform on your subdomain with your logo, your colour palette and your name in every parent-facing message.',
          'Each campus can carry its own branding while head office retains consolidated visibility across the group.',
        ],
        bullets: [
          'Dedicated subdomain with your branding',
          'Per-campus logo and colour overrides',
          'Branded parent portal, report cards and fee vouchers',
          'Consolidated head-office reporting across all campuses',
          'Role-based access so campus admins see only their own data',
        ],
      },
      {
        h2: 'Who this is for',
        body: [
          'School groups that have outgrown a single-campus system, franchise networks that need consistent processes across independently operated branches, and education consultants who want to offer a managed ERP to their clients under their own name.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Do we get our own domain?',
        a: 'You get a dedicated subdomain under your own brand. Pointing a full custom domain at the deployment is available for group accounts.',
      },
      {
        q: 'Can each branch have different branding?',
        a: 'Yes. Branding is resolved per campus, so each branch can carry its own logo and colours while the group keeps a consistent structure.',
      },
      {
        q: 'Is data separated between campuses?',
        a: 'Yes. Each campus is isolated, and role-based access controls who can see consolidated group data.',
      },
    ],
  },

  '/skills-academy': {
    h1: 'Skills academy and course management',
    lead:
      'Enrolment, course catalogues, batch scheduling, fee collection and assignment workflows for vocational academies, bootcamps and training institutes.',
    sections: [
      {
        h2: 'Built for course businesses, not school terms',
        body: [
          'A skills academy sells courses in batches with rolling start dates, not in academic sessions. Students join mid-cycle, pay per course or per instalment, and expect a certificate at the end.',
          'Taleem360 handles rolling enrolment, per-batch capacity, instalment billing and assignment submission with instructor review — the operating model of a training business rather than a school year.',
        ],
        bullets: [
          'Course catalogue with per-batch capacity and rolling start dates',
          'Rolling enrolment and mid-cycle student intake',
          'Per-course and instalment fee collection',
          'Assignment submission with instructor review and grading',
          'Attendance per session with completion tracking',
        ],
      },
    ],
    faqs: [
      {
        q: 'Can students join a batch already in progress?',
        a: 'Yes. Batches accept mid-cycle enrolment up to the capacity you set, and attendance and billing start from the joining date.',
      },
      {
        q: 'Does it support instalment payments?',
        a: 'Yes. Course fees can be billed in full or split into instalments, each tracked against the student ledger.',
      },
    ],
  },

  '/biometric-attendance': {
    h1: 'Biometric attendance for schools',
    lead:
      'Connect biometric readers to live attendance registers, staff duty rosters and automatic parent alerts — so marking happens at the door, not on a clipboard.',
    sections: [
      {
        h2: 'What biometric attendance actually changes',
        body: [
          'Manual marking is a daily time cost and a source of disputes: proxies, late arrivals recorded as on-time, and registers that do not reconcile with the payroll. A biometric reader removes the judgement from the moment of arrival.',
          'Taleem360 maps each device to a section and shift, so a single reader at a shared gate can serve several classes without staff intervention.',
        ],
        bullets: [
          'Device-to-section and device-to-shift mapping',
          'Live attendance registers updated from the reader',
          'Automatic parent absence alerts on the first period of the day',
          'Staff attendance feeding directly into payroll',
          'Per-device and per-shift audit trail',
        ],
      },
      {
        h2: 'Works with the hardware you already have',
        body: [
          'Existing readers can be integrated rather than replaced. If you are buying new hardware, tell us the model and we will confirm compatibility before you commit to a purchase.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Do we have to buy new hardware?',
        a: 'Not necessarily. Existing biometric readers can often be integrated. Share the model with us and we will confirm compatibility before you buy anything.',
      },
      {
        q: 'Can one device serve several classes?',
        a: 'Yes. Devices map to sections and shifts, so a shared gate reader can cover multiple classes.',
      },
      {
        q: 'Does staff attendance feed payroll?',
        a: 'Yes. Staff attendance records connect to the payroll module so overtime and deductions calculate from real arrival and departure times.',
      },
    ],
  },

  '/compare': {
    h1: 'Compare Taleem360 with other school systems',
    lead:
      'An honest comparison of what schools actually need — attendance, fee recovery, accounting, report cards and parent communication — and where Taleem360 differs from spreadsheets, legacy desktop ERP and per-module SaaS.',
    sections: [
      {
        h2: 'The three options most schools are choosing between',
        body: [
          'Spreadsheets and paper registers are free but cost staff hours and lose information at every handoff. Legacy desktop ERP is powerful but single-machine, hard to back up and impossible for parents to reach. Per-module SaaS solves one problem at a time and charges for each.',
          'Taleem360 is one cloud database covering the whole operation, priced per student rather than per module, with a parent portal included.',
        ],
      },
      {
        h2: 'Where Taleem360 differs',
        body: [],
        bullets: [
          'One database, not five synced spreadsheets',
          'Cloud access from any device, not a single office PC',
          'Double-entry accounting built in, not an export to Excel',
          'Fee collection built for bank challans and mobile wallets',
          'Parent portal included, not sold as a separate module',
          'Static, fast-loading pages that work on weak connections',
        ],
      },
      {
        h2: 'Where we are not the right fit',
        body: [
          'If you need a full learning management system with live video classes and SCORM content hosting, Taleem360 covers assignments, grading and lesson planning but is not a video platform. If you are a single-teacher tuition centre with no fee tracking needs, a spreadsheet may genuinely be enough.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Can we run a parallel test against our current system?',
        a: 'Yes. The pilot lets you run live attendance and fee cycles for 30 days and compare the output against your existing process before deciding.',
      },
      {
        q: 'Do you charge extra for the accounting module?',
        a: 'No. Double-entry accounting is included at every tier.',
      },
    ],
  },

  '/free-resources': {
    h1: 'Free resources for schools',
    lead:
      'Downloadable templates, checklists and printable material for school administrators — free, no account required.',
    sections: [
      {
        h2: 'What is available',
        body: [
          'These are the working documents we use with schools during onboarding, published so any school can use them whether or not they run Taleem360.',
        ],
        bullets: [
          'Fee structure planning template',
          'Attendance policy checklist',
          'Parent communication templates for absence and dues',
          'Term report card layout guide',
          'Staff duty roster template',
        ],
      },
      {
        h2: 'Why we publish these',
        body: [
          'Most schools are not short of software — they are short of a clear process to put into it. Publishing the templates costs us nothing and gives schools a starting point that works before any system is involved.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Do I need an account to download?',
        a: 'No. The resources are open and do not require registration.',
      },
      {
        q: 'Can I use these commercially?',
        a: 'Yes, adapt them for your own school. We ask only that you do not resell them as a product.',
      },
    ],
  },

  '/api': {
    h1: 'Taleem360 API and integrations',
    lead:
      'Connect Taleem360 to your website, mobile app, accounting package or payment provider through documented REST endpoints.',
    sections: [
      {
        h2: 'What the API covers',
        body: [
          'The API exposes the records your other systems need to read: students, staff, classes, attendance, fee invoices, payments and results. Access is scoped per campus and authenticated with a per-school key.',
        ],
        bullets: [
          'Students, staff, classes and sections',
          'Attendance records and daily summaries',
          'Fee invoices, payments and outstanding balances',
          'Examination results and report card data',
          'Announcements and message dispatch',
        ],
      },
      {
        h2: 'Common integrations',
        body: [
          'The most requested integrations are a school website that shows vacancies and announcements, an accounting package that needs the fee ledger, payment providers for online collection, and messaging gateways for SMS and WhatsApp alerts.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Is API access included in the licence?',
        a: 'Yes. API access is included on all paid licences. During the pilot you can request a sandbox key.',
      },
      {
        q: 'Is there a rate limit?',
        a: 'Fair-use limits apply per school so that one integration cannot degrade the service for others. The current limit is documented with your key.',
      },
    ],
  },

  '/ai-resource-studio': {
    h1: 'AI Resource Studio for teachers',
    lead:
      'Turn a syllabus document or textbook page into lesson plans, quiz questions, report-card comments and parent messages — reviewed by the teacher before anything is used.',
    sections: [
      {
        h2: 'What the studio does',
        body: [
          'Teachers spend hours each week producing material that follows a predictable pattern: a lesson plan from a chapter, a quiz from a topic, remarks from a set of marks, and a message home. The studio drafts those from the source material you provide.',
          'Every output is a draft. The teacher edits and approves it before it reaches a student or a parent — the studio accelerates the first pass, it does not replace professional judgement.',
        ],
        bullets: [
          'Lesson plans generated from a chapter or syllabus extract',
          'Quiz and worksheet questions with answer keys',
          'Report-card comment banks matched to performance bands',
          'Parent notification messages in plain language',
          'Bilingual output for English and Urdu communication',
        ],
      },
      {
        h2: 'Data handling',
        body: [
          'The studio works on the material you paste or upload for that session. Student names and identifiers are not required to generate teaching material, and the studio does not need them to work.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Do teachers need to review the output?',
        a: 'Yes. Every generated item is a draft that the teacher edits and approves. Nothing is published to students or parents automatically.',
      },
      {
        q: 'Does it support Urdu?',
        a: 'Yes. Parent-facing messages can be generated in English, Urdu, or both.',
      },
      {
        q: 'Is it included in the licence?',
        a: 'Yes. The studio is part of the platform for schools on an active licence.',
      },
    ],
  },

  '/about': {
    h1: 'About Taleem360',
    lead:
      'Taleem360 is a school cloud ERP built in Karachi for schools operating in Pakistan, the Gulf, South Asia and Africa.',
    sections: [
      {
        h2: 'Why we built it',
        body: [
          'School administration software in this region is usually either a desktop package from a decade ago or a foreign SaaS priced in dollars and built for a different fee model. Neither fits a school collecting fees through bank challans and mobile wallets while running biometric attendance across three branches.',
          'Taleem360 was built around those constraints: low bandwidth, cash-and-wallet fee collection, multi-campus groups and parent communication over SMS and WhatsApp.',
        ],
      },
      {
        h2: 'How we work',
        body: [
          'We onboard schools directly rather than through resellers, so the people building the product hear the operational problems first-hand. The pilot is a real deployment, and the feedback from it goes into the roadmap.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Where is Taleem360 based?',
        a: 'In Karachi, Pakistan. Support is provided in English.',
      },
      {
        q: 'Which countries do you serve?',
        a: 'Schools in Pakistan, the UAE, Nigeria and Bangladesh are supported today, with the platform available internationally.',
      },
    ],
  },

  '/contact': {
    h1: 'Contact Taleem360',
    lead:
      'Tell us about your school and we will set up a pilot workspace, or answer any question about the platform first.',
    sections: [
      {
        h2: 'Start a pilot',
        body: [
          'Send us your school name, the number of students, the number of branches, and the modules you care about most. We will confirm the workspace setup and the data you need to prepare for import.',
        ],
      },
      {
        h2: 'Support for existing schools',
        body: [
          'If your school is already running on Taleem360, contact support with your campus name and a description of the issue. Include the student or invoice reference where relevant so we can locate the record quickly.',
        ],
      },
    ],
    faqs: [
      {
        q: 'How quickly do you respond?',
        a: 'Pilot and sales enquiries are answered on business days. Support requests from active schools are handled in the order received.',
      },
      {
        q: 'Is there phone support?',
        a: 'Yes. The contact number is listed in the footer and is answered during Karachi business hours.',
      },
    ],
  },

  '/support': {
    h1: 'Taleem360 support',
    lead:
      'Help for schools already running on Taleem360 — setup questions, data imports, fee cycle issues and attendance device problems.',
    sections: [
      {
        h2: 'Before you contact us',
        body: [
          'Most support requests are resolved faster with a few details included up front. Have your campus name, the affected module, the student or invoice reference, and a note of what you expected to happen versus what happened.',
        ],
        bullets: [
          'Campus and user account',
          'Module: attendance, fees, accounts, exams, portal',
          'Record reference: student ID, invoice number, receipt number',
          'What you expected and what occurred',
          'Any error message shown, verbatim',
        ],
      },
      {
        h2: 'Common tasks',
        body: [
          'Importing students and staff from CSV, mapping fee heads, configuring grade scales and setting up attendance devices are all covered during onboarding. If you are past onboarding and need to repeat one of these, contact support and we will walk you through it.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Is support included in the licence?',
        a: 'Yes. Support is included for active schools at every tier.',
      },
      {
        q: 'Do you help with data import?',
        a: 'Yes. Onboarding support covers the initial import, and repeat imports later are handled through support.',
      },
    ],
  },

  '/blog': {
    h1: 'Taleem360 blog',
    lead:
      'Practical writing on school operations in Pakistan and the wider region — fee recovery, attendance, accounting, staffing and parent communication.',
    sections: [
      {
        h2: 'What we publish',
        body: [
          'Every article is written for the person doing the work: the administrator reconciling fee arrears, the accountant preparing an audit file, the principal dealing with staff turnover. Where a topic maps to a module in Taleem360, the article says so — but the guidance stands on its own.',
        ],
        bullets: [
          'Fee collection and arrears recovery',
          'Attendance policy and parent communication',
          'School accounting and audit preparation',
          'Staffing, payroll and duty rosters',
          'Examinations, grading and report cards',
          'Technology and connectivity constraints',
        ],
      },
      {
        h2: 'Browse by topic',
        body: [
          'Use the footer links to reach any article directly, or start with the solution pages for schools, daycare, madrasa and academies.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Can I republish an article?',
        a: 'Contact us with the article and the publication. We generally allow republication with attribution and a link back.',
      },
    ],
  },

  '/faq': {
    h1: 'Frequently asked questions',
    lead:
      'Answers to the questions schools ask most often before starting a pilot — pricing, setup, data migration, hardware, connectivity and support.',
    sections: [
      {
        h2: 'Before you start',
        body: [
          'The pilot is a full deployment of your own workspace for 30 days, with your real student and staff data, at no cost and with no card required. Onboarding support is included.',
          'You will need your student list, staff list and fee structure as a starting point. Both CSV import and manual entry are supported.',
        ],
      },
      {
        h2: 'Running the system',
        body: [
          'Attendance can be marked manually or captured from biometric readers. Fee collection supports vouchers, partial payments and arrears. Accounts are double-entry with a chart of accounts you configure.',
          'Parents reach the portal from any browser. There is no app to install and no per-parent charge.',
        ],
      },
      {
        h2: 'Data and security',
        body: [
          'Data is held per campus and access is role-based. We do not claim any external security certification, and we will tell you plainly what controls are and are not in place rather than asserting compliance we cannot evidence.',
        ],
      },
    ],
    faqs: [
      {
        q: 'How long does implementation take?',
        a: 'Most schools are live within a week of providing their student and staff data.',
      },
      {
        q: 'Can we keep using our existing biometric devices?',
        a: 'Often yes. Share the model with us and we will confirm compatibility before you buy anything new.',
      },
      {
        q: 'What happens to our data if we stop?',
        a: 'Your data remains available for export during the licence period. We will confirm the export process with you before any account is closed.',
      },
      {
        q: 'Do you offer training?',
        a: 'Onboarding includes training for your admin and teaching staff as part of the pilot.',
      },
      {
        q: 'Is the system available in Urdu?',
        a: 'The interface is in English. Parent-facing messages can be generated in English, Urdu or both.',
      },
    ],
  },
};

/** Builds a solution-style page for a route with no explicit content. */
function buildSolutionContent(route: string, title: string, description: string): RouteContent {
  const label = route.replace(/^\//, '');
  const city = CITY_META[label];
  if (city) {
    return {
      h1: `School management software in ${city.city}`,
      lead: `${description} Taleem360 is used by schools across ${city.city}, ${city.province}.`,
      sections: [
        {
          h2: `Why schools in ${city.city} choose Taleem360`,
          body: [
            city.note,
            `Schools in ${city.city} typically run fee collection through bank challans and mobile wallets, mark attendance manually or with biometric readers, and communicate with parents over SMS and WhatsApp. Taleem360 is built around those workflows rather than adapted to them.`,
          ],
        },
        {
          h2: 'What you get',
          body: [
            'Attendance, fee management, double-entry accounting, examinations, report cards and a parent portal in one cloud database, priced per active student profile with a 30-day free pilot.',
          ],
          bullets: [
            'Attendance with automatic parent absence alerts',
            'Fee vouchers, partial payments, arrears and reconciliation',
            'Double-entry accounting with audit-ready statements',
            'Report cards and exam workflows',
            'Parent portal on any phone, no app required',
          ],
        },
        {
          h2: 'Getting started in ' + city.city,
          body: [
            `Onboarding is remote and runs on your schedule. Import your student and staff lists, map your fee heads, and run live attendance and fee cycles during the 30-day pilot before committing to a licence.`,
          ],
        },
      ],
      faqs: [
        {
          q: `Do you provide on-site setup in ${city.city}?`,
          a: 'Onboarding is delivered remotely, with sessions scheduled around your school hours. Most schools in Karachi and other major cities complete setup without an on-site visit.',
        },
        ...CITY_FAQS,
      ],
    };
  }

  const region = REGION_META[label];
  if (region) {
    return {
      h1: `School ERP for ${region.country}`,
      lead: `${description} Taleem360 serves schools in ${region.country}.`,
      sections: [
        {
          h2: `Built for schools in ${region.country}`,
          body: [
            region.note,
            'Taleem360 covers attendance, fee collection, double-entry accounting, examinations, report cards and parent communication in one cloud system, with a 30-day free pilot.',
          ],
        },
        {
          h2: 'What you get',
          body: [],
          bullets: [
            'Attendance with parent alerts over SMS and WhatsApp',
            'Fee collection with partial payments and arrears tracking',
            'Double-entry accounting and financial statements',
            'Report cards, exam workflows and grade scales',
            'Parent portal, mobile-first and app-free',
          ],
        },
        {
          h2: 'Pricing and pilot',
          body: [
            'Licences are priced per active student profile with a 30-day free pilot and no credit card. School groups with multiple branches are priced on consolidated profile counts.',
          ],
        },
      ],
      faqs: [
        {
          q: `Do you support schools in ${region.country}?`,
          a: 'Yes. Taleem360 is a cloud platform accessible from any country, with onboarding delivered remotely.',
        },
        ...CITY_FAQS,
      ],
    };
  }

  // Generic solution fallback — still a full, distinct page.
  return {
    h1: title.replace(/\s*[|—-]\s*Taleem360\s*$/i, '').replace(/\s*[|—-]\s*$/, ''),
    lead: description,
    sections: [
      {
        h2: 'Overview',
        body: [
          description,
          'Taleem360 brings attendance, fee collection, double-entry accounting, examinations, report cards and parent communication into one cloud database, priced per active student profile with a 30-day free pilot.',
        ],
      },
      {
        h2: 'What you get',
        body: [],
        bullets: [
          'Attendance with automatic parent absence alerts',
          'Fee vouchers, partial payments, arrears and reconciliation',
          'Double-entry accounting with audit-ready statements',
          'Report cards and examination workflows',
          'Parent portal, mobile-first and app-free',
        ],
      },
    ],
    faqs: CITY_FAQS,
  };
}

/** Shared local-market FAQs appended to city and region pages. */
const CITY_FAQS: Faq[] = [
  {
    q: 'How long does setup take?',
    a: 'Most schools are live within a week of providing their student and staff data. The 30-day pilot includes onboarding support at no cost.',
  },
  {
    q: 'Do we need to pay to try it?',
    a: 'No. The pilot runs for 30 days with full module access and no credit card.',
  },
  {
    q: 'Does it work on slow internet?',
    a: 'Yes. Pages are served as static HTML so they open quickly on low bandwidth, and data entry works in short sessions.',
  },
];

/** Builds a blog article page from its slug and SEO metadata. */
function buildBlogContent(route: string, title: string, description: string): RouteContent {
  const slug = route.replace(/^\/blog\//, '');
  const topic = slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/\bErp\b/g, 'ERP')
    .replace(/\bLms\b/g, 'LMS')
    .replace(/\bK12\b/g, 'K-12')
    .replace(/\bApi\b/g, 'API')
    .replace(/\bSms\b/g, 'SMS')
    .replace(/\bGcc\b/g, 'GCC')
    .replace(/\bOlevel\b/g, 'O-Level')
    .replace(/\bAlevel\b/g, 'A-Level')
    .replace(/\bCie\b/g, 'CIE')
    .replace(/\bBise\b/g, 'BISE')
    .replace(/\bFbise\b/g, 'FBISE')
    .replace(/\bPci\b/g, 'PCI')
    .replace(/\bNgo\b/g, 'NGO');

  const cleanTitle = title.replace(/\s*[|—-]\s*Taleem360\s*$/i, '').trim();

  return {
    h1: cleanTitle || topic,
    lead: description,
    sections: [
      {
        h2: 'The problem in practice',
        body: [
          `${description} This article sets out the operational reality behind ${topic.toLowerCase()} and what a workable process looks like for a school administrator.`,
        ],
      },
      {
        h2: 'What to do about it',
        body: [
          'Start with the record, not the software. Any process around ' + topic.toLowerCase() +
            ' only holds if the underlying data is captured once and reused, rather than re-entered in a second spreadsheet or register.',
        ],
        bullets: [
          'Capture the data at the point it is created, once',
          'Derive reports from that record instead of maintaining separate ones',
          'Give parents visibility so queries arrive with context',
          'Reconcile against the ledger, not against a summary total',
        ],
      },
      {
        h2: 'How Taleem360 covers it',
        body: [
          'Taleem360 keeps attendance, fees, accounting, examinations and parent communication in one database, so a record entered once feeds every downstream report. The 30-day pilot lets you run a live cycle before committing.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Can we try this in our own school?',
        a: 'Yes. The 30-day pilot is a full deployment with your own data, at no cost and with no credit card.',
      },
      {
        q: 'Where can I read more?',
        a: 'The blog index lists every article by topic, and the solution pages cover schools, daycare, madrasa and academies.',
      },
    ],
  };
}

/** Legal and policy pages. */
const LEGAL_CONTENT: Record<string, RouteContent> = {
  '/privacy': {
    h1: 'Privacy Policy',
    lead:
      'How Taleem360 collects, uses, stores and shares personal data, and what rights you have over it.',
    sections: [
      {
        h2: 'Data we hold',
        body: [
          'We hold the records a school needs to operate: student and staff names, contact details, attendance, fee and payment records, examination results and account credentials. Schools control this data; Taleem360 processes it on the school’s instruction.',
        ],
      },
      {
        h2: 'Why we hold it',
        body: [
          'Data is used to provide the service — running attendance, billing, accounting and reporting — to authenticate users, to send messages the school has asked us to send, and to meet legal record-keeping obligations.',
        ],
      },
      {
        h2: 'Sharing and retention',
        body: [
          'We do not sell personal data. Data is shared only with service providers needed to run the platform, such as hosting and messaging providers, and where the law requires it. Records are retained for the period the school’s licence is active and for the statutory period afterwards where a legal obligation applies.',
        ],
      },
      {
        h2: 'Your rights',
        body: [
          'Where applicable law provides them, you may request access to, correction of, or deletion of personal data, and may object to certain processing. Requests should be directed to the school that holds the account, which is the controller; we support schools in fulfilling those requests.',
        ],
      },
      {
        h2: 'Certifications',
        body: [
          'Taleem360 does not claim HIPAA, SOC 2 or ISO 27001 certification. No external body has audited this platform against those standards, and we state that plainly rather than implying compliance we cannot evidence.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Who is the data controller?',
        a: 'The school. Taleem360 processes student and staff data on the school’s instruction.',
      },
      {
        q: 'Do you sell data?',
        a: 'No. Personal data is never sold.',
      },
    ],
  },
  '/terms': {
    h1: 'Terms of Service',
    lead: 'The terms governing use of the Taleem360 platform by schools and their authorised users.',
    sections: [
      {
        h2: 'The agreement',
        body: [
          'These terms apply between Taleem360 and the institution subscribing to the platform. By activating a workspace or using the service, the institution accepts them. Where a signed agreement exists, that agreement takes precedence.',
        ],
      },
      {
        h2: 'Licence and acceptable use',
        body: [
          'A licence permits the subscribing institution and its authorised staff and parents to use the platform for its own school operations. It does not permit reselling access, attempting to extract other institutions’ data, or using the platform to send unlawful or unsolicited messages.',
        ],
      },
      {
        h2: 'Pilot, fees and renewal',
        body: [
          'The pilot period runs for 30 days at no charge and with no card required. Paid licences are activated only after the institution chooses to continue. Fees are charged per active student profile. The institution is responsible for the accuracy of the data it imports.',
        ],
      },
      {
        h2: 'Availability and liability',
        body: [
          'We work to keep the platform available and will give notice of planned maintenance, but we do not offer a service-level availability guarantee. To the extent permitted by law, our liability is limited to the fees paid in the preceding period. Nothing in these terms excludes liability that cannot lawfully be excluded.',
        ],
      },
      {
        h2: 'Termination',
        body: [
          'Either party may end the agreement at the end of a billing period. On termination the institution may export its data, after which records are retained or deleted according to the privacy policy and applicable record-keeping obligations.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Is there an availability guarantee?',
        a: 'No formal SLA is offered. We maintain the platform and notify planned maintenance, but we do not guarantee a percentage uptime.',
      },
      {
        q: 'Can we export our data?',
        a: 'Yes. Export is available during the licence period and on termination.',
      },
    ],
  },
  '/cookies': {
    h1: 'Cookie Policy',
    lead: 'Which cookies Taleem360 uses, what each is for, and how to control them.',
    sections: [
      {
        h2: 'Cookies we use',
        body: [
          'Essential cookies keep you signed in and protect forms against cross-site request forgery; these cannot be switched off without breaking the service. Analytics cookies help us understand which pages are used. Preference cookies remember choices such as dismissed notices.',
        ],
        bullets: [
          'Essential: session and authentication, security',
          'Analytics: aggregate page usage measurement',
          'Preference: remembering dismissed notices and display choices',
        ],
      },
      {
        h2: 'Controlling cookies',
        body: [
          'You can block or delete cookies in your browser settings. Blocking essential cookies will prevent sign-in. Because analytics may be gated behind consent, visitors who do not opt in are not counted in analytics reports — which means reported traffic understates total visits.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Can I use the platform without cookies?',
        a: 'No. Essential cookies are required for sign-in and form security.',
      },
    ],
  },
  '/refund-policy': {
    h1: 'Refund Policy',
    lead: 'When fees are refundable, how to request a refund, and how the pilot period is treated.',
    sections: [
      {
        h2: 'The pilot period',
        body: [
          'The 30-day pilot is free and requires no payment, so there is nothing to refund during it. No card is collected at pilot signup.',
        ],
      },
      {
        h2: 'Paid licences',
        body: [
          'If you cancel a paid licence, the remaining unused portion of the current billing period may be refunded on request. Refund requests should be raised through support with your campus name and invoice reference. Charges for completed periods are not refundable.',
        ],
      },
      {
        h2: 'How refunds are processed',
        body: [
          'Approved refunds are returned through the original payment channel. Processing time depends on the bank or wallet provider and is typically within a few business days once approved.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Can I get a refund after the pilot?',
        a: 'If you have not activated a paid licence, no payment has been taken. Paid licences may be refunded pro-rata for the unused portion of the current period.',
      },
      {
        q: 'How do I request a refund?',
        a: 'Contact support with your campus name and invoice reference.',
      },
    ],
  },
};

/**
 * Resolves the visible content for a route: an explicit entry where one
 * exists, a legal page, a blog article, or a composed solution page.
 */
export function buildRouteContent(
  route: string,
  title: string,
  description: string
): RouteContent {
  if (SOLUTION_CONTENT[route]) return SOLUTION_CONTENT[route];
  if (LEGAL_CONTENT[route]) return LEGAL_CONTENT[route];
  if (route.startsWith('/blog/')) return buildBlogContent(route, title, description);
  if (route === '/blog') return SOLUTION_CONTENT['/blog'];
  return buildSolutionContent(route, title, description);
}

/**
 * Taleem360 — published pricing and regional currency conversion.
 *
 * SINGLE SOURCE OF TRUTH for anything that states a price: the /pricing page,
 * the JSON-LD schema, the in-app pricing screen, the pricing ZIP export.
 *
 * ── The pricing model ───────────────────────────────────────────────────────
 *
 * ONE published price: USD 49 per month, covering up to 200 active student
 * profiles, with a 30-day free pilot before it.
 *
 * Above 200 profiles, and for white-label or multi-campus deployments, pricing
 * is QUOTED rather than published. That is deliberate: a 1,200-student premium
 * chain and a 180-student school are not the same customer, and the quote
 * route prices each to its own budget without publishing a ladder of numbers
 * the checkout cannot yet honour.
 *
 * The mandate gates payment integration until the first $1 of revenue, so
 * there is no self-serve checkout. The free pilot is the only self-serve
 * action and it works today. Everything paid goes through a quote.
 *
 * ── Why exactly one number ──────────────────────────────────────────────────
 *
 * This codebase previously asserted three different ranges in three places
 * (49-499 USD in the schema, 29-199 USD on the compare page, "Custom" on the
 * pricing page) while the live pricing page published no numbers at all.
 * Publishing one true number and quoting the rest removes that class of error
 * permanently: the schema can only ever describe something the site says.
 *
 * ── Regional currency ───────────────────────────────────────────────────────
 *
 * The visitor's region decides the display currency. Pakistan settles in PKR,
 * the Gulf in AED and SAR, Bangladesh in BDT, Nigeria in NGN. Rates below are
 * FIXED, not live — deliberately, so a price never moves between page render
 * and checkout. They are indicative conversion aids; the amount actually
 * invoiced is the one on the quote.
 *
 * Review these rates periodically. They are the only numbers in this file that
 * go stale, and they go stale silently.
 */

export type RegionalCurrency = 'USD' | 'PKR' | 'AED' | 'BDT' | 'NGN' | 'SAR';

export interface CurrencyMeta {
  /** ISO 4217 code. */
  code: RegionalCurrency;
  /** Units of local currency per 1 USD. Fixed, not live. */
  perUsd: number;
  /** Decimal places to render. These markets settle in whole units. */
  decimals: number;
  /** Primary markets that settle in this currency. */
  markets: string;
}

/**
 * Fixed regional conversion rates (units of local currency per 1 USD).
 *
 * AED and SAR are effectively pegged to the dollar. PKR is held at the rate
 * the existing checkout service already used (services/pricingService.ts).
 * BDT and NGN are indicative and should be reviewed more often than the pegs.
 */
export const CURRENCIES: Record<RegionalCurrency, CurrencyMeta> = {
  USD: { code: 'USD', perUsd: 1, decimals: 0, markets: 'International / default' },
  PKR: { code: 'PKR', perUsd: 278.5, decimals: 0, markets: 'Pakistan' },
  AED: { code: 'AED', perUsd: 3.673, decimals: 0, markets: 'United Arab Emirates' },
  SAR: { code: 'SAR', perUsd: 3.75, decimals: 0, markets: 'Saudi Arabia' },
  BDT: { code: 'BDT', perUsd: 122, decimals: 0, markets: 'Bangladesh' },
  NGN: { code: 'NGN', perUsd: 1550, decimals: 0, markets: 'Nigeria' },
};

/** Region code -> display currency. Keys match the city and region routes. */
export const REGION_CURRENCY: Record<string, RegionalCurrency> = {
  pk: 'PKR',
  karachi: 'PKR',
  lahore: 'PKR',
  islamabad: 'PKR',
  rawalpindi: 'PKR',
  faisalabad: 'PKR',
  multan: 'PKR',
  peshawar: 'PKR',
  quetta: 'PKR',
  uae: 'AED',
  saudi: 'SAR',
  bangladesh: 'BDT',
  nigeria: 'NGN',
};

/** The one published price, in USD per month. */
export const PUBLISHED_PRICE_USD = 49;

/** Active student profiles included at the published price. */
export const INCLUDED_PROFILES = 200;

/** Free pilot length in days. */
export const PILOT_DAYS = 30;

/** What the published price includes. The core suite is never metered. */
export const INCLUDED_FEATURES: string[] = [
  'Attendance — biometric, QR/RFID and manual, with per-period registers',
  'Fee collection — vouchers, partial payments, sibling discounts and arrears',
  'Double-entry accounting — chart of accounts, journals, ledgers, trial balance',
  'Examinations and configurable grading schemes',
  'Report cards and marksheets',
  'Parent portal — attendance, dues, results and announcements',
  'Unlimited teacher and admin logins',
  'WhatsApp and SMS parent notifications',
];

/** What is quoted rather than published. */
export const QUOTED_SCOPE: { title: string; body: string }[] = [
  {
    title: 'More than 200 active student profiles',
    body: 'Larger schools are quoted per profile, so the price tracks actual enrolment rather than a bracket you happen to fall into.',
  },
  {
    title: 'Multi-campus and school groups',
    body: 'Central dashboards, per-campus isolation and cross-branch reporting are quoted per group.',
  },
  {
    title: 'White label',
    body: 'Your own brand, logo, colour scheme and domain on the platform — licensed and quoted per deployment.',
  },
  {
    title: 'Add-on modules',
    body: 'Daycare Hub, Skills Academy and Solo Pro are priced separately from the school ERP licence.',
  },
];

/** Convert a USD amount into a regional currency using the fixed rate. */
export function convert(usd: number, currency: RegionalCurrency): number {
  const meta = CURRENCIES[currency];
  const factor = Math.pow(10, meta.decimals);
  return Math.round(usd * meta.perUsd * factor) / factor;
}

/** Render a USD amount in a regional currency, e.g. "13,647 PKR" or "$49". */
export function formatPrice(usd: number, currency: RegionalCurrency): string {
  const meta = CURRENCIES[currency];
  const amount = convert(usd, currency);
  const formatted = amount.toLocaleString('en-US', {
    minimumFractionDigits: meta.decimals,
    maximumFractionDigits: meta.decimals,
  });
  return meta.code === 'USD' ? `$${formatted}` : `${formatted} ${meta.code}`;
}

/** The published price rendered in a given currency. */
export function publishedPrice(currency: RegionalCurrency = 'USD'): string {
  return formatPrice(PUBLISHED_PRICE_USD, currency);
}

/**
 * The currency a visitor should see, derived from their region code.
 * Defaults to USD when the region is unknown or international.
 */
export function currencyForRegion(region?: string | null): RegionalCurrency {
  if (!region) return 'USD';
  return REGION_CURRENCY[region.toLowerCase()] || 'USD';
}

/**
 * Currencies the site quotes in, for the "we invoice in your local currency"
 * line on the pricing page. Derived from CURRENCIES so the two cannot drift.
 */
export function quotingCurrencies(): CurrencyMeta[] {
  return Object.values(CURRENCIES).filter((c) => c.code !== 'USD');
}

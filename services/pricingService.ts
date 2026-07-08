/**
 * Core product categories supported on Taleem360.
 */
export type ProductModuleType = 'SchoolERP' | 'PrivateTutors' | 'SkillsAcademy' | 'DaycareHub';

/**
 * Supported regional checkout currencies.
 */
export type CheckoutCurrency = 'USD' | 'AED' | 'PKR';

/**
 * Standard pricing billing cycles.
 */
export type BillingCycle = 'monthly' | 'yearly';

export interface ProductFeature {
  name: string;
  included: boolean;
}

export interface PricingTier {
  id: string; // Unique strict identifier (e.g., PROD_ERP_TIER1)
  name: string;
  moduleType: ProductModuleType;
  usdPricePerMonth: number; // Stored in USD cents to prevent floating point issues (e.g. 4900 for $49)
  usdPricePerYear?: number;  // Stored in USD cents (e.g., 49900 for $499)
  maxStudents?: number;
  features: string[];
}

/**
 * Fixed stable conversion rates to prevent client-side/upstream price fluctuations.
 * Rates are stored as multipliers (multiplied by 1000 to keep integer precision).
 * e.g., 1 USD = 3.67 AED (multiplier: 3670), 1 USD = 278.50 PKR (multiplier: 278500)
 */
export const REGIONAL_CONVERSION_RATES: Record<CheckoutCurrency, number> = {
  USD: 1000,
  AED: 3673, // 1 USD = 3.673 AED
  PKR: 278500, // 1 USD = 278.50 PKR
};

/**
 * Static global product and subscription pricing catalog.
 */
export const PRODUCT_CATALOG: Record<string, PricingTier> = {
  PROD_ERP_PILOT: {
    id: 'PROD_ERP_PILOT',
    name: 'ERP Pilot Tier',
    moduleType: 'SchoolERP',
    usdPricePerMonth: 0,
    usdPricePerYear: 0,
    maxStudents: 30,
    features: ['Basic Student Demographics', 'Single Campus Sheet', 'Attendance Logging'],
  },
  PROD_ERP_TIER1: {
    id: 'PROD_ERP_TIER1',
    name: 'ERP Starter License (Tier 1)',
    moduleType: 'SchoolERP',
    usdPricePerMonth: 4900, // $49.00
    usdPricePerYear: 49000, // $490.00 (discounted)
    maxStudents: 200,
    features: ['Finance & Fees Modules', 'Staff Demographics', 'Timetable Management', 'Standard Portals'],
  },
  PROD_ERP_TIER2: {
    id: 'PROD_ERP_TIER2',
    name: 'ERP Professional Suite (Tier 2)',
    moduleType: 'SchoolERP',
    usdPricePerMonth: 9900, // $99.00
    usdPricePerYear: 99000, // $990.00
    maxStudents: 450,
    features: ['Examination Module', 'AI Performance Insights', 'Parent Portal Access', 'Biometric Integration'],
  },
  PROD_ERP_TIER3: {
    id: 'PROD_ERP_TIER3',
    name: 'ERP Enterprise Engine (Tier 3)',
    moduleType: 'SchoolERP',
    usdPricePerMonth: 29900, // $299.00
    usdPricePerYear: 299000, // $2,990.00
    maxStudents: 1000,
    features: ['Multi-school Management Boards', 'Custom Webhook Gateways', 'Priority SLA Support', 'Unlimited Staff'],
  },
  PROD_DAYCARE_HUB: {
    id: 'PROD_DAYCARE_HUB',
    name: 'Daycare Center Hub Add-on',
    moduleType: 'DaycareHub',
    usdPricePerMonth: 3900, // $39.00
    usdPricePerYear: 39000, // $390.00
    features: ['Real-time Check-In Tracking', 'Secure Kiosk PIN Terminals', 'Automated Penalty Billing'],
  },
  PROD_SKILLS_ACADEMY: {
    id: 'PROD_SKILLS_ACADEMY',
    name: 'Skills Academies & Bootcamps Module',
    moduleType: 'SkillsAcademy',
    usdPricePerMonth: 5900, // $59.00
    usdPricePerYear: 59000, // $590.00
    features: ['Multi-tenant White-Label LMS', 'Split-Installment Plans', 'Digital Certifications'],
  },
  PROD_SOLO_PRO: {
    id: 'PROD_SOLO_PRO',
    name: 'Solo Pro & Private Tutors License',
    moduleType: 'PrivateTutors',
    usdPricePerMonth: 1900, // $19.00
    usdPricePerYear: 19000, // $190.00
    features: ['Custom Booking Pages', 'Mini Availability Portfolios', 'Instant Tutor Logs'],
  },
};

export interface ResolvedPrice {
  productId: string;
  productName: string;
  moduleType: ProductModuleType;
  billingCycle: BillingCycle;
  rawAmountUSD: number; // Stored as standard decimal e.g. 49.00
  amount: number;      // Stored as decimal in target currency e.g. 179.98 AED
  currency: CheckoutCurrency;
  usdCentPrice: number; // Stored in cents
}

/**
 * Service to resolve precise transactional checkout prices.
 */
export class PricingService {
  /**
   * Securely maps and converts USD pricing tiers into target checkout rates with zero client-side manipulation.
   */
  public static getPriceByProductId(
    productId: string,
    billingCycle: BillingCycle = 'monthly',
    targetCurrency: CheckoutCurrency = 'USD'
  ): ResolvedPrice {
    const product = PRODUCT_CATALOG[productId];
    if (!product) {
      throw new Error(`Invalid Product ID: "${productId}". Not found in centralized ledger catalogs.`);
    }

    // 1. Resolve raw base price in USD cents
    let usdCents = product.usdPricePerMonth;
    if (billingCycle === 'yearly') {
      usdCents = product.usdPricePerYear !== undefined ? product.usdPricePerYear : product.usdPricePerMonth * 12;
    }

    // 2. Convert to regional local currency precisely
    const rateMultiplier = REGIONAL_CONVERSION_RATES[targetCurrency] || 1000;
    
    // Integer-only calculation to prevent IEEE 754 floating-point inaccuracies
    // (usdCents * rateMultiplier) is dividing by 1000 (rate scaling) and 100 (cent scaling)
    const convertedAmountCents = Math.round((usdCents * rateMultiplier) / 1000);
    const amountDecimal = convertedAmountCents / 100;

    return {
      productId: product.id,
      productName: product.name,
      moduleType: product.moduleType,
      billingCycle,
      rawAmountUSD: usdCents / 100,
      amount: amountDecimal,
      currency: targetCurrency,
      usdCentPrice: usdCents,
    };
  }
}

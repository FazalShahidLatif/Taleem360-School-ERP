#!/usr/bin/env tsx
/**
 * Static HTML Pre-Renderer for Taleem360
 *
 * Generates per-page static HTML files with correct <head> metadata
 * (title, canonical, meta, OG, Twitter Card, JSON-LD schema) baked in.
 * This ensures non-JS crawlers, bots, and AI scrapers see real page content
 * without executing JavaScript.
 *
 * Run: tsx scripts/generate-static-html.ts
 * Runs automatically during `npm run build` after sitemap generation.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PUBLISHED_PRICE_USD, INCLUDED_PROFILES, PILOT_DAYS, publishedPrice } from '../lib/pricingCatalog.js';
import {
  BRAND,
  esc,
  renderCriticalCss,
  renderHeader,
  renderBreadcrumbs,
  renderMain,
  renderFooter,
  renderJsonLd,
  routeLabel,
} from './static-content.js';
import { buildRouteContent } from './static-route-content.js';
import { BLOG_POSTS_DATA } from '../lib/blogContent.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.resolve(__dirname, '../public');
const STATIC_DIR = path.resolve(PUBLIC_DIR, 'static-html');

// ─── SEO Metadata Map ────────────────────────────────────────────────────────
// Each entry maps a route to its SEO metadata. Mirrors what each page component
// sets via document.title / meta description / canonical in useEffect.
// All URLs use non-www canonical (https://taleem360.online/...).

const SITEMAP_URL = 'https://taleem360.online';

/**
 * Default social share card, used by every route that does not override it.
 *
 * 1200x630 is the size Facebook, LinkedIn, X and WhatsApp expect for a large
 * summary card. Before this default existed, 49 of 51 routes shipped no og:image
 * at all, so a shared link rendered as a bare URL.
 */
const DEFAULT_OG_IMAGE = `${SITEMAP_URL}/og-image.png`;
const DEFAULT_OG_ALT =
  'Taleem360 — school cloud ERP and LMS suite: attendance, fee collection, double-entry accounting, report cards and the parent portal in one system.';

const SEO_MAP: Record<string, {
  title: string;
  description: string;
  canonical: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  schema?: object | object[];  // JSON-LD schema(_{content to inject
  additionalMeta?: Record<string, string>; // any extra <meta> tags
}> = {
  '/': {
    title: 'Taleem360 - School Cloud ERP & LMS Suite Pakistan',
    description: 'Taleem360: cloud ERP for Pakistani schools. Attendance tracking, fee collection, double-entry accounting, report cards, parent alerts. Free 30-day pilot.',
    canonical: `${SITEMAP_URL}/`,
    ogTitle: 'Taleem360 - School Cloud ERP & LMS Suite Pakistan',
    ogDescription: 'Taleem360: cloud ERP for Pakistani schools. Attendance tracking, fee collection, double-entry accounting, report cards, parent alerts. Free 30-day pilot.',
    ogImage: 'https://taleem360.online/og-image.png',
    twitterTitle: 'Taleem360 - School Cloud ERP & LMS Suite Pakistan',
    twitterDescription: 'Taleem360: cloud ERP for Pakistani schools. Attendance tracking, fee collection, double-entry accounting, report cards, parent alerts. Free 30-day pilot.',
    twitterImage: 'https://taleem360.online/og-image.png',
    schema: [
      {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Taleem360',
        url: `${SITEMAP_URL}/`,
        logo: `${SITEMAP_URL}/taleem_logo.png`,
        description: 'Unified cloud database suite automating K-12 attendance tracking, automated student fee collection networks, double-entry ledgers, and parent messaging portals. Every subscription funds free curriculum notes for a child in need.',
        foundingDate: '2026',
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+92-332-2137898',
          contactType: 'customer service',
          email: 'support@taleem360.online',
          availableLanguage: ['English', 'Urdu']
        },
        address: {
          '@type': 'PostalAddress',
          streetAddress: '26/792 Cantt Bazar, Drigh Road',
          addressLocality: 'Karachi',
          postalCode: '75350',
          addressCountry: 'PK'
        },
        sameAs: [
          'https://www.facebook.com/Taleem360PK',
          'https://twitter.com/Taleem360PK',
          'https://www.linkedin.com/company/taleem360-pk'
        ]
      },
      {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: 'Taleem360',
        image: `${SITEMAP_URL}/taleem_logo.png`,
        description: 'Unified cloud database suite automating K-12 attendance tracking, automated student fee collection networks, double-entry ledgers, and parent messaging portals. Every subscription funds free curriculum notes for a child in need.',
        brand: { '@type': 'Brand', name: 'Taleem360' },
        offers: {
          '@type': 'Offer',
          price: String(PUBLISHED_PRICE_USD),
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
          hasMerchantReturnPolicy: {
            '@type': 'MerchantReturnPolicy',
            applicableCountry: 'PK',
            returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
            merchantReturnDays: 30,
            returnMethod: 'https://schema.org/ReturnByMail',
            returnFees: 'https://schema.org/FreeReturn'
          },
          shippingDetails: {
            '@type': 'OfferShippingDetails',
            shippingDestination: {
              '@type': 'DefinedRegion',
              addressCountry: 'PK'
            },
            shippingRate: {
              '@type': 'MonetaryAmount',
              value: '0',
              currency: 'USD'
            },
            deliveryTime: {
              '@type': 'ShippingDeliveryTime',
              handlingTime: {
                '@type': 'QuantitativeValue',
                minValue: '1',
                maxValue: '2',
                unitCode: 'DAY'
              }
            }
          },
          description: `Per month for up to ${INCLUDED_PROFILES} active student profiles. ${PILOT_DAYS}-day free pilot, no credit card required. Larger schools, school groups and white-label deployments are quoted individually.`
        }
      },
      {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'Taleem360 School ERP Suite',
        url: `${SITEMAP_URL}/`,
        image: `${SITEMAP_URL}/taleem_logo.png`,
        description: 'Unified cloud database suite automating K-12 attendance tracking, automated student fee collection networks, double-entry ledgers, and parent messaging portals. Every subscription funds free curriculum notes for a child in need.',
        applicationCategory: 'EducationalApplication',
        operatingSystem: 'All',
        offers: {
          '@type': 'Offer',
          price: String(PUBLISHED_PRICE_USD),
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
          hasMerchantReturnPolicy: {
            '@type': 'MerchantReturnPolicy',
            applicableCountry: 'PK',
            returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
            merchantReturnDays: 30,
            returnMethod: 'https://schema.org/ReturnByMail',
            returnFees: 'https://schema.org/FreeReturn'
          },
          shippingDetails: {
            '@type': 'OfferShippingDetails',
            shippingDestination: {
              '@type': 'DefinedRegion',
              addressCountry: 'PK'
            },
            shippingRate: {
              '@type': 'MonetaryAmount',
              value: '0',
              currency: 'USD'
            },
            deliveryTime: {
              '@type': 'ShippingDeliveryTime',
              handlingTime: {
                '@type': 'QuantitativeValue',
                minValue: '1',
                maxValue: '2',
                unitCode: 'DAY'
              }
            }
          },
          description: `Per month for up to ${INCLUDED_PROFILES} active student profiles. ${PILOT_DAYS}-day free pilot, no credit card required. Larger schools, school groups and white-label deployments are quoted individually.`,
          priceSpecification: {
            '@type': 'PriceSpecification',
            price: String(PUBLISHED_PRICE_USD),
            priceCurrency: 'USD',
            valueAddedTaxIncluded: 'false'
          }
        },
        author: {
          '@type': 'Organization',
          name: 'Taleem360',
          logo: { '@type': 'ImageObject', url: `${SITEMAP_URL}/taleem_logo.png` }
        }
      },
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Taleem360',
        url: `${SITEMAP_URL}/`,
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${SITEMAP_URL}/blog?search={search_term_string}`
          },
          queryInput: 'required name=search_term_string'
        }
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: `${SITEMAP_URL}/`
          }
        ]
      }
    ]
  },

  '/about': {
    title: 'About Taleem360 - Educational Empowerment through Automation',
    description: 'Learn more about Taleem360. We provide unified cloud-based solutions to automate school management operational complexity, giving educators more time to optimize student success.',
    canonical: `${SITEMAP_URL}/about`,
    ogTitle: 'About Taleem360 - Educational Empowerment through Automation',
    ogDescription: 'Learn more about Taleem360. We provide unified cloud-based solutions to automate school management operational complexity, giving educators more time to optimize student success.',
    twitterTitle: 'About Taleem360 - Educational Empowerment through Automation',
    twitterDescription: 'Learn more about Taleem360. We provide unified cloud-based solutions to automate school management operational complexity, giving educators more time to optimize student success.',
  },

  '/pricing': {
    title: 'Taleem360 Pricing — School ERP Plans Pakistan (Free Pilot) | Taleem360',
    description: 'Transparent school ERP pricing for Pakistani schools: attendance, fees, result cards, payroll, and double-entry accounting. Start with a 30-day free pilot — no credit card required. View plans and start free.',
    canonical: `${SITEMAP_URL}/pricing`,
    ogTitle: 'Taleem360 Pricing — School ERP Plans Pakistan (Free Pilot) | Taleem360',
    ogDescription: 'Transparent school ERP pricing for Pakistani schools. Start with a 30-day free pilot — no credit card required.',
    twitterTitle: 'Taleem360 Pricing — School ERP Plans Pakistan (Free Pilot) | Taleem360',
    twitterDescription: 'Transparent school ERP pricing for Pakistani schools. Start with a 30-day free pilot — no credit card required.',
  },

  '/blog': {
    title: 'Taleem360 Blog — School ERP, Attendance & EdTech Guides Pakistan',
    description: 'Taleem360 Blog: expert guides on school ERP systems, student attendance tracking, fee management, and educational technology for Pakistani schools. Updated weekly.',
    canonical: `${SITEMAP_URL}/blog`,
    ogTitle: 'Taleem360 Blog — School ERP, Attendance & EdTech Guides Pakistan',
    ogDescription: 'Taleem360 Blog: expert guides on school ERP systems, student attendance tracking, fee management, and EdTech for Pakistani schools.',
    twitterTitle: 'Taleem360 Blog — School ERP, Attendance & EdTech Guides Pakistan',
    twitterDescription: 'Taleem360 Blog: expert guides on school ERP systems, student attendance tracking, fee management, and EdTech for Pakistani schools.',
  },

  '/faq': {
    title: 'Taleem360 FAQs — School ERP Questions Answered Pakistan | Taleem360',
    description: 'Frequently asked questions about Taleem360 School ERP: attendance tracking, fee collection, biometric integration, pricing, onboarding, and technical support for Pakistani schools.',
    canonical: `${SITEMAP_URL}/faq`,
    ogTitle: 'Taleem360 FAQs — School ERP Questions Answered Pakistan | Taleem360',
    ogDescription: 'Frequently asked questions about Taleem360 School ERP for Pakistani schools.',
    twitterTitle: 'Taleem360 FAQs — School ERP Questions Answered Pakistan | Taleem360',
    twitterDescription: 'Frequently asked questions about Taleem360 School ERP for Pakistani schools.',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is Taleem360 School ERP?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Taleem360 is a unified cloud-based School ERP & LMS suite for Pakistani educational institutions. It automates student registration, attendance tracking (QR, biometric, RFID), fee collection with double-entry accounting, report cards, payroll, parent notifications via WhatsApp/SMS, and staff management — all from one dashboard.'
          }
        },
        {
          '@type': 'Question',
          name: 'Is there a free trial for Taleem360?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes, Taleem360 offers a 30-day free Pilot tier with no credit card required. The Pilot supports up to 100 student profiles and includes daily attendance sheets, grade structures, and parent notifications. After 30 days, upgrading to a paid tier requires manual approval by our Super Admin.'
          }
        },
        {
          '@type': 'Question',
          name: 'How much does Taleem360 cost in Pakistan?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: `Taleem360 has one published price: ${publishedPrice('USD')} per month for up to ${INCLUDED_PROFILES} active student profiles, or ${publishedPrice('PKR')} per month for schools in Pakistan. A ${PILOT_DAYS}-day free pilot comes first and requires no credit card. Schools above ${INCLUDED_PROFILES} profiles, multi-campus groups and white-label deployments are quoted individually so the price tracks actual enrolment.`
          }
        },
        {
          '@type': 'Question',
          name: 'Does Taleem360 support biometric attendance?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Taleem360 supports biometric thumb scanners, RFID cards, and QR code check-ins. The system integrates with hardware and triggers instant parent alerts via WhatsApp/SMS when students check in or out. See our dedicated biometric attendance page for full details.'
          }
        },
        {
          '@type': 'Question',
          name: 'Can Taleem360 handle fee collection and challans?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Taleem360 generates computerized fee challans with dynamic barcodes. It supports online fee collection via JazzCash, EasyPaisa, bank transfers, and WhatsApp alerts. The double-entry ledger system keeps every transaction trackable with audit logs.'
          }
        },
        {
          '@type': 'Question',
          name: 'Is Taleem360 suitable for daycare centers?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Taleem360 has a dedicated daycare management module with child tracking, guardian management, automated billing, late fee engine, and parent notification portals. The Pilot tier supports up to 10 daycare students. Contact us for daycare-specific pricing.'
          }
        },
        {
          '@type': 'Question',
          name: 'Does Taleem360 work for madrasas and Islamic schools?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Taleem360 offers a specialized Madrasa Management module with Hifz tracking, Islamic curriculum mapping, donor funding channels, and Quran recitation records. The system is designed to respect the unique administrative needs of Islamic educational institutions.'
          }
        },
        {
          '@type': 'Question',
          name: 'How do I get started with Taleem360?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Start with the free 30-day Pilot tier — no credit card required. Register on our Onboarding page, complete your school profile, and begin managing students, attendance, and fees immediately. For paid tiers, contact our Super Admin at accts.pak@gmail.com for manual verification and activation.'
          }
        },
        {
          '@type': 'Question',
          name: 'Is my school data secure with Taleem360?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Taleem360 uses TLS encryption for data in transit, role-based access control (RBAC) for authorized personnel only, regular database backups, and centralized audit logs. We operate under FERPA and COPPA-aligned privacy standards. School administrators retain full ownership and export rights to their data at any time.'
          }
        },
        {
          '@type': 'Question',
          name: 'Can Taleem360 be white-labeled for my school brand?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Taleem360 offers white-label solutions where your school brand, logo, color scheme, and domain can be applied to the platform. Contact our sales team for white-label pricing and setup details.'
          }
        },
        {
          '@type': 'Question',
          name: 'Does Taleem360 provide parent portals?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Taleem360 provides parent mobile portals showing student attendance, homework, upcoming exams, fee dues, and complete status reports. Parents receive real-time WhatsApp/SMS alerts for attendance check-ins, fee reminders, and important announcements.'
          }
        },
        {
          '@type': 'Question',
          name: 'Is Taleem360 available internationally?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Taleem360 serves schools in Pakistan (Karachi, Lahore, Islamabad, Rawalpindi, Peshawar, Faisalabad, Multan, Quetta), Nigeria, Bangladesh, UAE, and other countries. Each region gets localized currency support, SMS gateways, and language options including English and Urdu.'
          }
        }
      ]
    }
  },

  '/contact': {
    title: 'Contact Taleem360 — Karachi-Based School ERP Support Pakistan',
    description: 'Contact Taleem360 for school ERP inquiries. Karachi-based support team serving schools across Pakistan. Email, phone, and contact form available. Get a free 30-day pilot.',
    canonical: `${SITEMAP_URL}/contact`,
    ogTitle: 'Contact Taleem360 — Karachi-Based School ERP Support Pakistan',
    ogDescription: 'Contact Taleem360 for school ERP inquiries. Karachi-based support serving schools across Pakistan.',
    twitterTitle: 'Contact Taleem360 — Karachi-Based School ERP Support Pakistan',
    twitterDescription: 'Contact Taleem360 for school ERP inquiries. Karachi-based support serving schools across Pakistan.',
  },

  '/daycare': {
    title: 'Daycare Management Software Pakistan — Child Tracking & Auto-Billing | Taleem360',
    description: 'Taleem360 Daycare Management Software: child check-in/out tracking, guardian management, automated billing with late fee engine, parent notifications via WhatsApp/SMS. 30-day free pilot. Built for Pakistani daycare centers.',
    canonical: `${SITEMAP_URL}/daycare`,
    ogTitle: 'Daycare Management Software Pakistan — Child Tracking & Auto-Billing | Taleem360',
    ogDescription: 'Taleem360 Daycare Management: child tracking, guardian management, auto-billing, parent alerts. 30-day free pilot.',
    twitterTitle: 'Daycare Management Software Pakistan — Child Tracking & Auto-Billing | Taleem360',
    twitterDescription: 'Taleem360 Daycare Management: child tracking, guardian management, auto-billing, parent alerts. 30-day free pilot.',
  },

  '/biometric-attendance': {
    title: 'Biometric Attendance System for Schools Pakistan — QR, RFID & Fingerprint | Taleem360',
    description: 'Taleem360 Biometric Attendance System for Schools in Pakistan: fingerprint scanners, RFID cards, QR code check-ins. Sub-second attendance logging, instant parent alerts via WhatsApp/SMS. 30-day free pilot.',
    canonical: `${SITEMAP_URL}/biometric-attendance`,
    ogTitle: 'Biometric Attendance System for Schools Pakistan — QR, RFID & Fingerprint | Taleem360',
    ogDescription: 'Taleem360 Biometric Attendance: fingerprint, RFID, QR check-ins. Instant parent alerts. 30-day free pilot.',
    twitterTitle: 'Biometric Attendance System for Schools Pakistan — QR, RFID & Fingerprint | Taleem360',
    twitterDescription: 'Taleem360 Biometric Attendance: fingerprint, RFID, QR check-ins. Instant parent alerts. 30-day free pilot.',
  },

  '/compare': {
    title: 'Taleem360 vs School ERP Competitors — Comparison & Review Pakistan | Taleem360',
    description: 'Compare Taleem360 against Fedena, Procare, Brightwheel, ClassDojo, and other school ERP platforms. Side-by-side feature comparison: attendance, fee management, offline resilience, white-label pricing, and Pakistan-specific support.',
    canonical: `${SITEMAP_URL}/compare`,
    ogTitle: 'Taleem360 vs School ERP Competitors — Comparison & Review Pakistan | Taleem360',
    ogDescription: 'Compare Taleem360 against competitors. Side-by-side feature comparison for Pakistani schools.',
    twitterTitle: 'Taleem360 vs School ERP Competitors — Comparison & Review Pakistan | Taleem360',
    twitterDescription: 'Compare Taleem360 against competitors. Side-by-side feature comparison for Pakistani schools.',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Taleem360 vs School ERP Competitors — Comparison',
      url: `${SITEMAP_URL}/compare`,
      image: `${SITEMAP_URL}/taleem_logo.png`,
      description: 'Side-by-side technical comparison of Taleem360 against conventional school platforms (Fedena, Procare, Brightwheel and ClassDojo), covering offline resilience, double-entry accounting, white-label branding and multi-tenant scope.',
      about: { '@type': 'SoftwareApplication', name: 'Taleem360 School ERP Suite' }
    }
  },

  '/free-resources': {
    title: 'Free School Resources Pakistan — Printable Worksheets, Forms & Templates | Taleem360',
    description: 'Free school resources for Pakistani educators: printable worksheets, admission forms, report card templates, attendance sheets, fee challan formats, and classroom management tools. Download and print instantly.',
    canonical: `${SITEMAP_URL}/free-resources`,
    ogTitle: 'Free School Resources Pakistan — Printable Worksheets, Forms & Templates | Taleem360',
    ogDescription: 'Free school resources for Pakistani educators: worksheets, forms, templates, and classroom tools.',
    twitterTitle: 'Free School Resources Pakistan — Printable Worksheets, Forms & Templates | Taleem360',
    twitterDescription: 'Free school resources for Pakistani educators: worksheets, forms, templates, and classroom tools.',
  },

  '/skills-academy': {
    title: 'Skills Academy Management Software Pakistan — Vocational Training ERP | Taleem360',
    description: 'Taleem360 Skills Academy Management Software for Pakistani vocational training centers: student tracking, course management, attendance, fee billing, certificate generation, and instructor scheduling. 30-day free pilot.',
    canonical: `${SITEMAP_URL}/skills-academy`,
    ogTitle: 'Skills Academy Management Software Pakistan — Vocational Training ERP | Taleem360',
    ogDescription: 'Taleem360 Skills Academy ERP: student tracking, courses, attendance, billing, certificates. 30-day free pilot.',
    twitterTitle: 'Skills Academy Management Software Pakistan — Vocational Training ERP | Taleem360',
    twitterDescription: 'Taleem360 Skills Academy ERP: student tracking, courses, attendance, billing, certificates. 30-day free pilot.',
  },

  '/madrasa': {
    title: 'Madrasa Management Software Pakistan — Hifz Tracking & Islamic Curriculum | Taleem360',
    description: 'Taleem360 Madrasa Management Software for Pakistani madrasas and Islamic schools: Hifz tracking, Islamic curriculum mapping, donor funding channels, student records, and attendance. Built for Islamic educational institutions.',
    canonical: `${SITEMAP_URL}/madrasa`,
    ogTitle: 'Madrasa Management Software Pakistan — Hifz Tracking & Islamic Curriculum | Taleem360',
    ogDescription: 'Taleem360 Madrasa Management: Hifz tracking, Islamic curriculum, donor funding, attendance. Built for Islamic schools.',
    twitterTitle: 'Madrasa Management Software Pakistan — Hifz Tracking & Islamic Curriculum | Taleem360',
    twitterDescription: 'Taleem360 Madrasa Management: Hifz tracking, Islamic curriculum, donor funding, attendance. Built for Islamic schools.',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'Taleem360 Madrasa ERP & Islamic Education Suite',
      url: `${SITEMAP_URL}/madrasa`,
      applicationCategory: 'EducationalApplication',
      operatingSystem: 'All',
      description: 'Unified cloud-based Madrasa management software in Pakistan designed to automate Hifz tracking, Islamic curriculum mapping, and donor funding channels.',
      brand: { '@type': 'Brand', name: 'Taleem360' },
      offers: {
        '@type': 'Offer',
        name: '30-day free pilot',
        price: '0',
        priceCurrency: 'USD',
        description: 'Full deployment free for 30 days with no credit card required. Paid licences are priced per active student profile.'
      }
    }
  },

  '/private-tutors': {
    title: 'Private Tutor Management Software Pakistan — Students, Fees & Scheduling | Taleem360',
    description: 'Run a tutoring business on Taleem360: student records, fee collection, class scheduling, attendance and parent updates for private tutors, home tuition teachers and coaching centres.',
    canonical: `${SITEMAP_URL}/private-tutors`,
    ogTitle: 'Private Tutor Management Software Pakistan | Taleem360',
    ogDescription: 'Student records, fee collection, scheduling and parent updates for tutors and coaching centres.',
    twitterTitle: 'Private Tutor Management Software Pakistan | Taleem360',
    twitterDescription: 'Student records, fee collection, scheduling and parent updates for tutors and coaching centres.',
  },
  '/white-label': {
    title: 'White Label School ERP Pakistan — Custom Branded Platform for Schools | Taleem360',
    description: 'Taleem360 White Label School ERP: customize the platform with your school brand, logo, colors, and domain. Perfect for school chains, academies, and educational networks wanting their own branded ERP system.',
    canonical: `${SITEMAP_URL}/white-label`,
    ogTitle: 'White Label School ERP Pakistan — Custom Branded Platform for Schools | Taleem360',
    ogDescription: 'Taleem360 White Label School ERP: your brand, your logo, your domain. Perfect for school chains and networks.',
    twitterTitle: 'White Label School ERP Pakistan — Custom Branded Platform for Schools | Taleem360',
    twitterDescription: 'Taleem360 White Label School ERP: your brand, your logo, your domain. Perfect for school chains and networks.',
  },

  '/api': {
    title: 'Taleem360 API Documentation — School ERP REST API for Developers | Taleem360',
    description: 'Taleem360 API Documentation: RESTful endpoints for school ERP integration. Student management, attendance, fee billing, report cards, and parent notifications. JWT authentication, schema-validated JSON, rate-limit signaling.',
    canonical: `${SITEMAP_URL}/api`,
    ogTitle: 'Taleem360 API Documentation — School ERP REST API for Developers | Taleem360',
    ogDescription: 'Taleem360 API: RESTful endpoints for school ERP integration. JWT auth, schema-validated JSON, rate limits.',
    twitterTitle: 'Taleem360 API Documentation — School ERP REST API for Developers | Taleem360',
    twitterDescription: 'Taleem360 API: RESTful endpoints for school ERP integration. JWT auth, schema-validated JSON, rate limits.',
  },

  '/ai-resource-studio': {
    title: 'AI Resource Studio — AI-Powered School Tools & Educational Content Generator | Taleem360',
    description: 'Taleem360 AI Resource Studio: AI-powered tools for schools — generate lesson plans, quiz questions, report card comments, parent notification messages, and educational content. Built into the Taleem360 platform.',
    canonical: `${SITEMAP_URL}/ai-resource-studio`,
    ogTitle: 'AI Resource Studio — AI-Powered School Tools & Educational Content Generator | Taleem360',
    ogDescription: 'Taleem360 AI Resource Studio: AI tools for lesson plans, quizzes, report comments, and parent notifications.',
    twitterTitle: 'AI Resource Studio — AI-Powered School Tools & Educational Content Generator | Taleem360',
    twitterDescription: 'Taleem360 AI Resource Studio: AI tools for lesson plans, quizzes, report comments, and parent notifications.',
  },

  '/support': {
    title: 'Taleem360 Support Center — Help, FAQs & Contact Pakistan',
    description: 'Taleem360 Support Center: get help with your school ERP. Browse FAQs, submit support tickets, contact our Karachi-based team, and find setup guides for attendance, billing, and parent portals.',
    canonical: `${SITEMAP_URL}/support`,
    ogTitle: 'Taleem360 Support Center — Help, FAQs & Contact Pakistan',
    ogDescription: 'Taleem360 Support Center: FAQs, tickets, and Karachi-based support for your school ERP.',
    twitterTitle: 'Taleem360 Support Center — Help, FAQs & Contact Pakistan',
    twitterDescription: 'Taleem360 Support Center: FAQs, tickets, and Karachi-based support for your school ERP.',
  },

  '/nigeria': {
    title: 'School Management Software Nigeria | Complete ERP Suite - Taleem360',
    description: 'Discover the absolute best school management software in Nigeria. Streamline primary, secondary and high school workloads with online fee collection, SMS alerts, and double-entry accounting.',
    canonical: `${SITEMAP_URL}/nigeria`,
    ogTitle: 'School Management Software Nigeria | Complete ERP Suite - Taleem360',
    ogDescription: 'Best school management software in Nigeria. Fee collection, SMS alerts, double-entry accounting.',
    twitterTitle: 'School Management Software Nigeria | Complete ERP Suite - Taleem360',
    twitterDescription: 'Best school management software in Nigeria. Fee collection, SMS alerts, double-entry accounting.',
  },

  '/bangladesh': {
    title: 'School ERP Bangladesh | Complete School Management System - Taleem360',
    description: 'Looking for the best school ERP in Bangladesh? Scale your campus operations with automated student attendance, school fee challans, and localized SMS alerts.',
    canonical: `${SITEMAP_URL}/bangladesh`,
    ogTitle: 'School ERP Bangladesh | Complete School Management System - Taleem360',
    ogDescription: 'Best school ERP in Bangladesh. Automated attendance, fee challans, localized SMS alerts.',
    twitterTitle: 'School ERP Bangladesh | Complete School Management System - Taleem360',
    twitterDescription: 'Best school ERP in Bangladesh. Automated attendance, fee challans, localized SMS alerts.',
  },

  '/uae': {
    title: 'School Management Software UAE | Premium Education Cloud Platform - Taleem360',
    description: 'Discover the premier school management software in UAE. Taleem360 offers smart biometric integration, parent mobile portals, cashless invoicing, and multi-school ERP.',
    canonical: `${SITEMAP_URL}/uae`,
    ogTitle: 'School Management Software UAE | Premium Education Cloud Platform - Taleem360',
    ogDescription: 'Premier school management software in UAE. Biometric integration, parent portals, cashless invoicing.',
    twitterTitle: 'School Management Software UAE | Premium Education Cloud Platform - Taleem360',
    twitterDescription: 'Premier school management software in UAE. Biometric integration, parent portals, cashless invoicing.',
  },

  '/karachi': {
    title: 'School Management Software Karachi | Complete ERP Suite - Taleem360',
    description: 'Discover the premier school management software in Karachi. Taleem360 offers automated attendance, online fee collection, and dual-persistence ERP solutions tailored for schools in Karachi.',
    canonical: `${SITEMAP_URL}/karachi`,
    ogTitle: 'School Management Software Karachi | Complete ERP Suite - Taleem360',
    ogDescription: 'Premier school management software in Karachi. Automated attendance, online fee collection, dual-persistence ERP.',
    twitterTitle: 'School Management Software Karachi | Complete ERP Suite - Taleem360',
    twitterDescription: 'Premier school management software in Karachi. Automated attendance, online fee collection, dual-persistence ERP.',
  },

  '/lahore': {
    title: 'School ERP Lahore | Smart Education Management System - Taleem360',
    description: 'Looking for a reliable school ERP in Lahore? Optimize your campus operations with biometric attendance, cashless ledgers, and localized SMS alerts in Lahore.',
    canonical: `${SITEMAP_URL}/lahore`,
    ogTitle: 'School ERP Lahore | Smart Education Management System - Taleem360',
    ogDescription: 'Reliable school ERP in Lahore. Biometric attendance, cashless ledgers, localized SMS alerts.',
    twitterTitle: 'School ERP Lahore | Smart Education Management System - Taleem360',
    twitterDescription: 'Reliable school ERP in Lahore. Biometric attendance, cashless ledgers, localized SMS alerts.',
  },

  '/islamabad': {
    title: 'School Management System Islamabad | Premium Cloud ERP - Taleem360',
    description: 'Elevate your federal capital school with the ultimate school management system in Islamabad. Custom biometric tracking, double-entry finance ledger, and parent apps.',
    canonical: `${SITEMAP_URL}/islamabad`,
    ogTitle: 'School Management System Islamabad | Premium Cloud ERP - Taleem360',
    ogDescription: 'Ultimate school management system in Islamabad. Biometric tracking, double-entry ledger, parent apps.',
    twitterTitle: 'School Management System Islamabad | Premium Cloud ERP - Taleem360',
    twitterDescription: 'Ultimate school management system in Islamabad. Biometric tracking, double-entry ledger, parent apps.',
  },

  '/rawalpindi': {
    title: 'School Software Rawalpindi | Advanced Campus ERP - Taleem360',
    description: 'Top-tier school software in Rawalpindi. Streamline admissions, biometric attendance, and automated WhatsApp reminders for parent-teacher coordination.',
    canonical: `${SITEMAP_URL}/rawalpindi`,
    ogTitle: 'School Software Rawalpindi | Advanced Campus ERP - Taleem360',
    ogDescription: 'Top-tier school software in Rawalpindi. Admissions, biometric attendance, WhatsApp reminders.',
    twitterTitle: 'School Software Rawalpindi | Advanced Campus ERP - Taleem360',
    twitterDescription: 'Top-tier school software in Rawalpindi. Admissions, biometric attendance, WhatsApp reminders.',
  },

  '/peshawar': {
    title: 'School ERP Peshawar | Reliable Educational Suite - Taleem360',
    description: 'Discover the premier school ERP in Peshawar. Seamlessly track attendance, generate local bank invoice bills, and digitize admissions across Khyber Pakhtunkhwa.',
    canonical: `${SITEMAP_URL}/peshawar`,
    ogTitle: 'School ERP Peshawar | Reliable Educational Suite - Taleem360',
    ogDescription: 'Premier school ERP in Peshawar. Attendance tracking, bank invoices, digitized admissions.',
    twitterTitle: 'School ERP Peshawar | Reliable Educational Suite - Taleem360',
    twitterDescription: 'Premier school ERP in Peshawar. Attendance tracking, bank invoices, digitized admissions.',
  },

  '/faisalabad': {
    title: 'School Management Software Faisalabad | Localized School ERP - Taleem360',
    description: 'Optimize your academic administration with school management software in Faisalabad. Dual-persistence tech, automated local bank integrations, and SMS alerts.',
    canonical: `${SITEMAP_URL}/faisalabad`,
    ogTitle: 'School Management Software Faisalabad | Localized School ERP - Taleem360',
    ogDescription: 'School management software in Faisalabad. Dual-persistence, bank integrations, SMS alerts.',
    twitterTitle: 'School Management Software Faisalabad | Localized School ERP - Taleem360',
    twitterDescription: 'School management software in Faisalabad. Dual-persistence, bank integrations, SMS alerts.',
  },

  '/multan': {
    title: 'Best School Software Multan | Advanced Student Database - Taleem360',
    description: 'The absolute best school software in Multan. Streamline nursery, primary and K-12 school workflows with smart biometric integration and cloud report cards.',
    canonical: `${SITEMAP_URL}/multan`,
    ogTitle: 'Best School Software Multan | Advanced Student Database - Taleem360',
    ogDescription: 'Best school software in Multan. Biometric integration, cloud report cards, K-12 workflows.',
    twitterTitle: 'Best School Software Multan | Advanced Student Database - Taleem360',
    twitterDescription: 'Best school software in Multan. Biometric integration, cloud report cards, K-12 workflows.',
  },

  '/quetta': {
    title: 'School ERP Quetta | Localized Education Cloud Platform - Taleem360',
    description: 'Introducing the first-mover school ERP in Quetta. Manage classrooms, student files, and school finances smoothly on a secure, offline-resilient local server.',
    canonical: `${SITEMAP_URL}/quetta`,
    ogTitle: 'School ERP Quetta | Localized Education Cloud Platform - Taleem360',
    ogDescription: 'First-mover school ERP in Quetta. Classroom management, student files, offline-resilient server.',
    twitterTitle: 'School ERP Quetta | Localized Education Cloud Platform - Taleem360',
    twitterDescription: 'First-mover school ERP in Quetta. Classroom management, student files, offline-resilient server.',
  },

  '/privacy': {
    title: 'Privacy Policy - Taleem360 School Cloud ERP',
    description: 'Privacy Policy for Taleem360 portal administrators and users. Read about our student data safeguards and manual license verification model.',
    canonical: `${SITEMAP_URL}/privacy`,
  },

  '/terms': {
    title: 'Terms of Service - Taleem360 School Cloud ERP',
    description: 'Terms Of Service and customer agreement policies for Taleem360 ERP Suite. Fully aligned with our manual verification and administrative approval model.',
    canonical: `${SITEMAP_URL}/terms`,
  },

  '/cookies': {
    title: 'Cookie Policy - Taleem360 School Cloud ERP',
    description: 'Read about how cookies and session storage are used on Taleem360 school management portal dashboards.',
    canonical: `${SITEMAP_URL}/cookies`,
  },

  '/refund-policy': {
    title: 'Refund & Billing Policy - Taleem360 School Cloud ERP',
    description: 'Billing and refund inquiries for Taleem360 are processed manually. Contact the Super Admin at accts.pak@gmail.com for questions.',
    canonical: `${SITEMAP_URL}/refund-policy`,
  },

  // Dynamic blog posts — add these individually
  '/blog/pakistani-schools-digital-revolution-cloud-erp': {
    title: 'Pakistani Schools Digital Revolution: Cloud ERP Transformation',
    description: 'How Pakistani schools are undergoing a digital revolution with cloud ERP systems. Explore the transformation from manual ledgers to automated school management.',
    canonical: `${SITEMAP_URL}/blog/pakistani-schools-digital-revolution-cloud-erp`,
  },
  '/blog/saudi-vision-2030-school-administration-transformation': {
    title: 'Saudi Vision 2030: School Administration Transformation',
    description: 'How Saudi Vision 2030 is transforming school administration with digital ERP systems across the Kingdom.',
    canonical: `${SITEMAP_URL}/blog/saudi-vision-2030-school-administration-transformation`,
  },
  '/blog/overcoming-low-bandwidth-regional-lms-solutions': {
    title: 'Overcoming Low Bandwidth: Regional LMS Solutions',
    description: 'Practical solutions for regional schools with low bandwidth connectivity. How offline-resilient LMS platforms keep education running.',
    canonical: `${SITEMAP_URL}/blog/overcoming-low-bandwidth-regional-lms-solutions`,
  },
  '/blog/simplifying-bise-board-exam-registration-cloud-erp': {
    title: 'Simplifying BISE Board Exam Registration with Cloud ERP',
    description: 'How cloud ERP systems simplify BISE board exam registration for Pakistani schools, reducing errors and saving administrative time.',
    canonical: `${SITEMAP_URL}/blog/simplifying-bise-board-exam-registration-cloud-erp`,
  },
  '/blog/biometric-attendance-integration-gcc-academies': {
    title: 'Biometric Attendance Integration for GCC Academies',
    description: 'Implementing biometric attendance systems in GCC academies: best practices, hardware selection, and parent communication strategies.',
    canonical: `${SITEMAP_URL}/blog/biometric-attendance-integration-gcc-academies`,
  },
  '/blog/multilingual-education-middle-east-dual-language-portals': {
    title: 'Multilingual Education in the Middle East: Dual Language Portals',
    description: 'How dual-language portals are transforming multilingual education in the Middle East, supporting Arabic, English, and Urdu in school systems.',
    canonical: `${SITEMAP_URL}/blog/multilingual-education-middle-east-dual-language-portals`,
  },
  '/blog/punjab-private-education-growth-scalable-saas-erp': {
    title: 'Punjab Private Education Growth: Scalable SaaS ERP',
    description: 'How scalable SaaS ERP platforms are supporting the rapid growth of private education in Punjab, Pakistan.',
    canonical: `${SITEMAP_URL}/blog/punjab-private-education-growth-scalable-saas-erp`,
  },
  '/blog/pakistani-school-fee-payments-mobile-wallets-integration': {
    title: 'Pakistani School Fee Payments: Mobile Wallets Integration',
    description: 'Integrating JazzCash, EasyPaisa, and other mobile wallet solutions for school fee collection in Pakistan.',
    canonical: `${SITEMAP_URL}/blog/pakistani-school-fee-payments-mobile-wallets-integration`,
  },
  '/blog/empowering-teachers-pakistan-rural-districts-offline-lms': {
    title: 'Empowering Teachers in Pakistan Rural Districts with Offline LMS',
    description: 'How offline-capable LMS solutions are empowering teachers in Pakistan\'s rural districts where internet connectivity is limited.',
    canonical: `${SITEMAP_URL}/blog/empowering-teachers-pakistan-rural-districts-offline-lms`,
  },
  '/blog/modernization-fbise-federal-board-academies-cloud-erp': {
    title: 'Modernization of FBISE Federal Board Academies with Cloud ERP',
    description: 'How FBISE federal board academies are modernizing with cloud ERP systems for better exam management and student records.',
    canonical: `${SITEMAP_URL}/blog/modernization-fbise-federal-board-academies-cloud-erp`,
  },
  '/blog/integrating-sms-gateway-apis-regional-cellular-challenges': {
    title: 'Integrating SMS Gateway APIs: Regional Cellular Challenges',
    description: 'Overcoming regional cellular challenges when integrating SMS gateway APIs for school parent notifications in South Asia and GCC.',
    canonical: `${SITEMAP_URL}/blog/integrating-sms-gateway-apis-regional-cellular-challenges`,
  },
  '/blog/managing-financial-audits-nonprofit-ngo-schools-south-asia': {
    title: 'Managing Financial Audits for Nonprofit & NGO Schools in South Asia',
    description: 'Best practices for managing financial audits in nonprofit and NGO-run schools across South Asia using cloud ERP systems.',
    canonical: `${SITEMAP_URL}/blog/managing-financial-audits-nonprofit-ngo-schools-south-asia`,
  },
  '/blog/stem-curriculum-middle-east-schools-lms-integration': {
    title: 'STEM Curriculum in Middle East Schools: LMS Integration',
    description: 'Integrating STEM curriculum delivery with LMS platforms in Middle East schools for better tracking and assessment.',
    canonical: `${SITEMAP_URL}/blog/stem-curriculum-middle-east-schools-lms-integration`,
  },
  '/blog/student-data-security-framework-south-asia-gcc-regulations': {
    title: 'Student Data Security Framework: South Asia & GCC Regulations',
    description: 'Navigating student data security regulations across South Asia and GCC countries when implementing cloud-based school ERP systems.',
    canonical: `${SITEMAP_URL}/blog/student-data-security-framework-south-asia-gcc-regulations`,
  },
  '/blog/modern-lesson-planners-olevel-alevel-pk-gcc-cie-syllabus': {
    title: 'Modern Lesson Planners for O-Level, A-Level PK & GCC CIE Syllabus',
    description: 'How modern lesson planner tools support O-Level, A-Level, and CIE syllabus delivery in Pakistan and GCC schools.',
    canonical: `${SITEMAP_URL}/blog/modern-lesson-planners-olevel-alevel-pk-gcc-cie-syllabus`,
  },
  '/blog/stress-free-parents-multi-payment-portals-fee-recovery': {
    title: 'Stress-Free Parents: Multi-Payment Portals for Fee Recovery',
    description: 'How multi-payment portal integrations reduce parent stress and improve fee recovery rates for schools in Pakistan.',
    canonical: `${SITEMAP_URL}/blog/stress-free-parents-multi-payment-portals-fee-recovery`,
  },
  '/blog/taleem360-definitive-multi-tenant-educational-erp-solution': {
    title: 'Taleem360: The Definitive Multi-Tenant Educational ERP Solution',
    description: 'Why Taleem360 is the definitive multi-tenant educational ERP solution for school chains, networks, and groups in Pakistan and globally.',
    canonical: `${SITEMAP_URL}/blog/taleem360-definitive-multi-tenant-educational-erp-solution`,
  },
  '/blog/ece-daycare-early-childhood-kiosk-guardian-security': {
    title: 'ECE Daycare: Early Childhood Kiosk & Guardian Security',
    description: 'Early childhood education daycare management with kiosk check-in systems and guardian security protocols for child safety.',
    canonical: `${SITEMAP_URL}/blog/ece-daycare-early-childhood-kiosk-guardian-security`,
  },
  '/blog/white-labeled-educational-growth-vercel-subdomains-branding': {
    title: 'White-Labeled Educational Growth: Vercel Subdomains & Branding',
    description: 'How white-labeled educational platforms using Vercel subdomains are driving branded growth for school networks and tutoring businesses.',
    canonical: `${SITEMAP_URL}/blog/white-labeled-educational-growth-vercel-subdomains-branding`,
  },
};

// ─── Blog routes derived from the single source of truth ──────────────────────
// lib/blogContent.ts is what the sitemap generator reads. Deriving the static
// HTML routes from the same array guarantees the sitemap and the prerendered
// pages can never drift apart again — a previous hand-maintained list covered
// only 20 of 55 published posts, so 35 sitemap URLs served an empty SPA shell
// and were never indexed. Curated entries already in SEO_MAP are preserved.
let derivedBlogRoutes = 0;
for (const post of BLOG_POSTS_DATA) {
  if (!post.is_published) continue;
  const route = `/blog/${post.slug}`;
  if (SEO_MAP[route]) continue;
  SEO_MAP[route] = {
    title: post.title,
    description: post.excerpt,
    canonical: post.canonical || `${SITEMAP_URL}${route}`,
    ogTitle: post.title,
    ogDescription: post.excerpt,
    ogImage: post.image_url,
    twitterTitle: post.title,
    twitterDescription: post.excerpt,
  };
  derivedBlogRoutes++;
}
console.log(`Derived ${derivedBlogRoutes} blog route(s) from lib/blogContent.ts`);

// ─── HTML Template ────────────────────────────────────────────────────────────

const HTML_HEAD_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="google-site-verification" content="google2cbad101865766ce.html" />
    <title>{TITLE}</title>
    <meta name="title" content="{TITLE}" />
    <meta name="description" content="{DESCRIPTION}" />
    <meta name="robots" content="index, follow" />
    <meta name="article:published_time" content="2026-06-21" />
    <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
    <meta name="bingbot" content="index, follow" />
    <link rel="canonical" href="{CANONICAL}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="{CANONICAL}" />
    <meta property="og:title" content="{OG_TITLE}" />
    <meta property="og:description" content="{OG_DESCRIPTION}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@Taleem360" />
    <meta name="twitter:creator" content="@Taleem360" />
    <meta name="twitter:url" content="{CANONICAL}" />
    <meta name="twitter:title" content="{TWITTER_TITLE}" />
    <meta name="twitter:description" content="{TWITTER_DESCRIPTION}" />
{TWITTER_IMAGE_META}
{OG_IMAGE_META}
{SCHEMA_SCRIPTS}
    <!-- Icons — SVG first (best quality, supported by Google and all modern browsers),
         then PNG fallbacks, then the legacy .ico. Every file exists in public/;
         none of these may point at a missing asset, because the SPA catch-all
         would answer with HTML and a 200, which reads as a soft 404. -->
    <link rel="icon" href="/favicon.ico" sizes="any" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
    <link rel="manifest" href="/manifest.json" />
    <meta name="theme-color" content="#0F172A" />
    <meta name="msapplication-TileColor" content="#0F172A" />
    <meta name="msapplication-config" content="none" />
    <!-- Google Tag Manager (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=GT-TXHQHSRK"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'GT-TXHQHSRK');
    </script>

    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" media="print" onload="this.media='all'">
    <noscript>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    </noscript>
{CRITICAL_CSS}
{ENTRY_CSS}
  </head>
  <body>
    <a class="t360-skip" href="#main">Skip to main content</a>
{HEADER}
{BREADCRUMBS}
{MAIN}
{FOOTER}
    <div id="cookie-consent-placeholder"></div>
    <script>
      (function () {
        var KEY = 't360_cookie_notice_dismissed';
        try { if (localStorage.getItem(KEY) === '1') return; } catch (e) {}
        window.addEventListener('load', function () {
          var el = document.getElementById('cookie-consent-placeholder');
          if (!el) return;
          el.innerHTML =
            '<div style="position:fixed;left:0;right:0;bottom:0;background:#0F172A;color:#E2E8F0;padding:14px 20px;font:14px/1.5 Inter,system-ui,sans-serif;display:flex;gap:16px;align-items:center;justify-content:center;flex-wrap:wrap;z-index:60">' +
            '<span>This site uses cookies to improve your experience. <a href="/cookies" style="color:#10B981">Learn more</a></span>' +
            '<button type="button" id="t360-cookie-ok" style="background:#10B981;color:#fff;border:0;border-radius:8px;padding:11px 20px;font-weight:700;min-height:44px;cursor:pointer">Got it!</button>' +
            '</div>';
          var btn = document.getElementById('t360-cookie-ok');
          if (btn) btn.addEventListener('click', function () {
            try { localStorage.setItem(KEY, '1'); } catch (e) {}
            el.innerHTML = '';
          });
        });
      })();
    </script>
{ENTRY_JS}
  </body>
</html>`;

/** Escape a string for safe inclusion in a JSON string inside a <script> tag */
function jsonEscape(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

/** Generate <script type="application/ld+json"> blocks from schema data */
function renderSchemaScripts(schema: object | object[] | undefined): string {
  if (!schema) return '';
  const items = Array.isArray(schema) ? schema : [schema];
  return items.map((s) => {
    const json = JSON.stringify(s, null, 2);
    return `    <script type="application/ld+json">\n${json.split('\n').join('\n    ')}\n    </script>`;
  }).join('\n');
}

/** Generate OG image <meta> tag if present */
function renderOgImage(ogImage: string | undefined): string {
  if (!ogImage) return '';
  return `\n    <meta property="og:image" content="${jsonEscape(ogImage)}" />`;
}

/** Generate Twitter image <meta> tag if present */
function renderTwitterImage(twImage: string | undefined): string {
  if (!twImage) return '';
  return `\n    <meta name="twitter:image" content="${jsonEscape(twImage)}" />`;
}

/** Generate a base64 data URI for the og:image so it's embedded in HTML (no external request needed for crawlers) */
function renderTechDataUri(ogImage: string | undefined): string {
  if (!ogImage) return '';
  // Use a Unsplash image as the OG image - include it as a normal URL since base64 of
  // a 1200x630 image would be huge. Most crawlers can fetch it.
  return '';
}

/** Generate accessibility note for screen readers */
function renderAccessibilityNote(route: string): string {
  const routeName = route === '/' ? 'Home' : route.replace('/', '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  return `Page: ${routeName}. ${SEO_MAP[route]?.description || ''}`;
}

/** Ensure a directory exists */
function ensureDir(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/** Build a human-readable crumb label from a route (e.g. /biometric-attendance → "Biometric Attendance") */
function routeNameForCrumb(route: string): string {
  const last = route.split('/').filter(Boolean).pop() || 'Home';
  return last
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/\bErp\b/, 'ERP')
    .replace(/\bLms\b/, 'LMS')
    .replace(/\bApi\b/, 'API')
    .replace(/\bFaq\b/, 'FAQ');
}

/** Generate a static HTML file for one route */
function generatePage(route: string, meta: typeof SEO_MAP[string]): void {
  // For blog posts (/blog/slug), strip the /blog/ prefix from the filename
  // so Vercel rewrites can map /blog/slug → /static-html/slug.html
  const routePath = route === '/' ? '' : route.substring(1);
  const isBlogPost = routePath.startsWith('blog/');
  const filename = route === '/'
    ? 'index.html'
    : isBlogPost
      ? routePath.substring('blog/'.length) + '.html'   // slug.html
      : routePath + '.html';                             // about.html, pricing.html, etc.
  const filePath = path.resolve(STATIC_DIR, filename);

  const title = meta.title;
  const description = meta.description;
  const canonical = meta.canonical;
  const ogTitle = meta.ogTitle || title;
  const ogDescription = meta.ogDescription || description;
  const ogImage = meta.ogImage || DEFAULT_OG_IMAGE;
  const twitterTitle = meta.twitterTitle || title;
  const twitterDescription = meta.twitterDescription || description;
  const twitterImage = meta.twitterImage || ogImage;

  // Every page gets a BreadcrumbList so Google can render breadcrumb rich results.
  // Replaces any hand-authored BreadcrumbList in SEO_MAP (the homepage has a
  // 1-item Home-only entry that was too sparse to be a valid trail).
  const breadcrumbItems: object[] = [
    { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITEMAP_URL}/` }
  ];
  let segmentPos = 2;
  if (route.startsWith('/blog/')) {
    breadcrumbItems.push({ '@type': 'ListItem', position: segmentPos++, name: 'Blog', item: `${SITEMAP_URL}/blog` });
  }
  // Final crumb uses the route's last path segment; on the homepage the Home
  // crumb alone is the complete valid trail (a 1-item list is accepted by Google).
  if (route !== '/') {
    breadcrumbItems.push({
      '@type': 'ListItem',
      position: segmentPos,
      name: routeNameForCrumb(route),
      item: canonical
    });
  }
  const breadcrumbList = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems
  };

  const existing = meta.schema
    ? (Array.isArray(meta.schema) ? meta.schema : [meta.schema])
    : [];
  // Drop any hand-authored BreadcrumbList (homepage has a sparse 1-item entry)
  // so we never emit two BreadcrumbList blocks on one page.
  const withoutStaleBreadcrumb = existing.filter(
    (s) => (s as { '@type'?: string })['@type'] !== 'BreadcrumbList'
  );
  const pageSchema = [...withoutStaleBreadcrumb, breadcrumbList];

  const schemaScripts = renderSchemaScripts(pageSchema);
  const twitterImageMeta = renderTwitterImage(twitterImage);

  // One og:image tag, with the dimensions and alt text that social platforms and
  // AI crawlers use to decide how to render the preview. The previous version
  // emitted the tag without dimensions, and only for routes that set ogImage.
  const ogImageUrlMeta = ogImage
    ? `\n    <meta property="og:image" content="${jsonEscape(ogImage)}" />` +
      `\n    <meta property="og:image:secure_url" content="${jsonEscape(ogImage)}" />` +
      `\n    <meta property="og:image:type" content="image/png" />` +
      `\n    <meta property="og:image:width" content="1200" />` +
      `\n    <meta property="og:image:height" content="630" />` +
      `\n    <meta property="og:image:alt" content="${jsonEscape(DEFAULT_OG_ALT)}" />`
    : '';

  // ── Visible page body ───────────────────────────────────────────────────
  // The marketing pages are complete static HTML: header nav, breadcrumbs,
  // real per-route content, capability grid, FAQ block, CTA and a full footer
  // link graph. No React bundle is required, so the page renders instantly and
  // every route has crawlable text and internal links.
  const content = buildRouteContent(route, title, description);
  const header = renderHeader(route);
  const breadcrumbs = renderBreadcrumbs(route, canonical);
  const main = renderMain(content, route);
  const footer = renderFooter();
  const criticalCss = `    <style>\n${renderCriticalCss().split('\n').map((l) => '      ' + l).join('\n')}\n    </style>`;

  const html = HTML_HEAD_TEMPLATE
    .replaceAll('{TITLE}', jsonEscape(title))
    .replaceAll('{DESCRIPTION}', jsonEscape(description))
    .replaceAll('{CANONICAL}', jsonEscape(canonical))
    .replaceAll('{OG_TITLE}', jsonEscape(ogTitle))
    .replaceAll('{OG_DESCRIPTION}', jsonEscape(ogDescription))
    .replaceAll('{OG_IMAGE_META}', ogImageUrlMeta)
    .replaceAll('{TWITTER_TITLE}', jsonEscape(twitterTitle))
    .replaceAll('{TWITTER_DESCRIPTION}', jsonEscape(twitterDescription))
    .replaceAll('{TWITTER_IMAGE_META}', twitterImageMeta)
    .replaceAll('{SCHEMA_SCRIPTS}', schemaScripts)
    .replaceAll('{CRITICAL_CSS}', criticalCss)
    .replaceAll('{ENTRY_CSS}', '')
    .replaceAll('{HEADER}', header)
    .replaceAll('{BREADCRUMBS}', breadcrumbs)
    .replaceAll('{MAIN}', main)
    .replaceAll('{FOOTER}', footer)
    .replaceAll('{ENTRY_JS}', '')
    .replaceAll('{ACCESSIBILITY_NOTE}', jsonEscape(renderAccessibilityNote(route)));

  // Fail loudly rather than shipping a page with an unfilled placeholder.
  const leftover = html.match(/\{[A-Z_]{3,}\}/g);
  if (leftover) {
    throw new Error(
      `Unreplaced placeholder(s) in ${filename}: ${[...new Set(leftover)].join(', ')}`
    );
  }

  ensureDir(STATIC_DIR);
  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`✅ Generated: ${filename} (${(html.length / 1024).toFixed(1)} KB)`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

console.log('╔══════════════════════════════════════════════╗');
console.log('║  Taleem360 Static HTML Pre-Renderer           ║');
console.log('║  Generating per-page HTML with baked-in SEO   ║');
console.log('╚══════════════════════════════════════════════╝');
console.log('');

const routes = Object.keys(SEO_MAP).sort();
console.log(`Generating ${routes.length} static HTML pages...`);
console.log('');

for (const route of routes) {
  generatePage(route, SEO_MAP[route]);
}

console.log('');
console.log('╔══════════════════════════════════════════════╗');
console.log('║  Static HTML generation complete              ║');
console.log(`║  ${routes.length} pages written to public/static-html/    ║`);
console.log('╚══════════════════════════════════════════════╝');

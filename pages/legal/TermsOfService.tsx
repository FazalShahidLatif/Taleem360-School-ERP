import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

export const TermsOfService: React.FC = () => {
  useEffect(() => {
    document.title = 'Terms of Service - Taleem360 School Cloud ERP';
    
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', 'Terms Of Service and customer agreement policies for Taleem360 ERP Suite. Fully aligned with our manual verification and administrative approval model.');

    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', 'https://www.taleem360.online/terms');
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
      <div className="prose prose-indigo max-w-none text-gray-600 space-y-6">
        <p className="text-sm text-gray-500">Last updated: June 17, 2026</p>

        <section className="bg-emerald-50 border border-emerald-100 rounded-xl p-5 mb-8">
          <h2 className="text-lg font-semibold text-emerald-900 mb-2">Manual Verification Agreement</h2>
          <p className="text-emerald-950 text-sm leading-relaxed">
            Please note that all paid institutional tiers are created and verified manually by our Super Admin. There is no automated credit card billing or direct merchant integration on this workspace. All corporate contracts are verified directly with our administrative desk to secure academic integrity.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">1. Acceptance of Terms</h2>
          <p>
            By registering, logging into, or using Taleem360 ("Taleem360-School ERP"), you form a binding legal contract with Taleem360 and agree to comply at all times with these Terms of Service. If you do not agree to these Terms, please immediately terminate your session.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">2. Description of Service</h2>
          <p>
            Taleem360 provides a cloud-based School Enterprise Resource Planning (ERP) &amp; Learning Management System (LMS) suite designed to automate K-12 management, including student profiles, timetables, fee collection accounts, payroll registries, secure biometric logs, and local parent portals.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">3. Registration Obligations &amp; Security</h2>
          <p>
            To activate and utilize the administrative modules, you must complete the registration and onboarding process. You agree to: (a) provide accurate, current, and complete corporate and school demographic information; (b) maintain the confidentiality of passwords and admin credentials; (c) take full legal responsibility for all activities transacted under your verified credentials.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">4. Pilot Trial Terms and Abuse Prevention Policy</h2>
          <p>
            Taleem360 offers a free 30-day "Pilot" tier designed purely for testing and evaluating our educational ERP features. The following specific restrictions and rules apply to all Pilot Trial registrations:
          </p>
          <ul className="list-disc pl-5 mt-3 space-y-2">
            <li>
              <strong>Trial Duration:</strong> The Pilot plan is limited to a strict free trial period of exactly 30 days. After this 30-day period expires, access to core administrative actions will be suspended. Upgrading to a paid subscription requires manual approval.
            </li>
            <li>
              <strong>Institution-Specific Capacity Limits:</strong>
              <ul className="list-circle pl-5 mt-1 space-y-1">
                <li><strong>Schools and Colleges:</strong> Capped at a maximum of 30 active student profiles.</li>
                <li><strong>Daycare Centers:</strong> Capped at a maximum of 10 active student profiles.</li>
                <li><strong>Vocational Training:</strong> Capped at a maximum of 5 active student profiles.</li>
                <li><strong>Private Tutors:</strong> Capped at a maximum of 5 active student profiles.</li>
              </ul>
            </li>
            <li>
              <strong>Age-Based Registration Restrictions:</strong>
              <ul className="list-circle pl-5 mt-1 space-y-1">
                <li><strong>Daycare Programs:</strong> Only children strictly under 5 years of age are allowed to enroll and register.</li>
                <li><strong>Primary Schools (Grade 1-5):</strong> Only children between 5 and 10 years of age are permitted to enroll.</li>
                <li><strong>Vocational Training:</strong> Enrolled students must be at least 15 years of age.</li>
              </ul>
            </li>
            <li>
              <strong>Abuse Prevention &amp; IP Tracking:</strong> To prevent resource exploitation, once a Pilot Trial expires, the registering institution's IP address and demographic metadata are logged. A strict policy restricts any individual, campus, or organization to only one free Pilot Trial per 365-day period. Any attempts to bypass this block will result in automatic and immediate system suspension.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">5. Subscriptions, Payments &amp; Manual Approvals</h2>
          <p>
            Certain ERP modules and premium features require a paid subscription:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Manual Activation:</strong> All paid packages (Tier 1, Tier 2, Tier 3) require credential verification and manual approval by the Super Admin at accts.pak@gmail.com. Direct online subscription purchases are disabled.
            </li>
            <li>
              <strong>No Automated Renewals:</strong> Because all packages are handled manually, there are no automated card cycles, billing surprises, or hidden merchant transaction fees.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">6. Cancellation and Refund Policy</h2>
          <p>
            School administrators can cancel or adjust manual renewal agreements at any time by coordinating directly with <a href="mailto:accts.pak@gmail.com" className="text-emerald-600 hover:underline font-semibold">accts.pak@gmail.com</a>.
          </p>
          <p>
            For complete guidelines regarding manual billing adjustments, please consult our detailed {' '}
            <Link to="/refund-policy" className="text-emerald-600 hover:underline font-semibold">
              Refund &amp; Billing Policy Page
            </Link>.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">7. Data Ownership and Compliance</h2>
          <p>
            As a school administrator, you retain all absolute ownership legal rights to the student rosters, transcripts, ledger accounts, and custom files uploaded to our database. Taleem360 is dedicated to securing this database. We maintain strict compliance with regional data guidelines, including standard encryption and role-based permissions.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">8. Governing Law &amp; Corporate Address</h2>
          <p>
            These terms and conditions and any legal interaction with Taleem360 shall be governed by and interpreted in accordance with the laws of Pakistan.
          </p>
          <p className="mt-4 font-semibold text-gray-800">
            Corporate Contact Office:
          </p>
          <p className="text-gray-600 leading-relaxed">
            Taleem360
            <br />
            26/792 Cantt Bazar, Drigh Road, Karachi -75350, Pakistan
          </p>
        </section>
      </div>
    </div>
  );
};

import React, { useEffect } from 'react';

export const RefundPolicy: React.FC = () => {
  useEffect(() => {
    document.title = 'Refund & Billing Policy - Taleem360 School Cloud ERP';
    
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', 'Billing and refund inquiries for Taleem360 are processed manually. Contact the Super Admin at accts.pak@gmail.com for questions.');

    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', 'https://www.taleem360.online/refund-policy');
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Refund &amp; Billing Policy</h1>
      <div className="prose prose-indigo max-w-none text-gray-600 space-y-6">
        <p className="text-sm text-gray-500">Last updated: June 17, 2026</p>

        <section className="bg-emerald-50 border border-emerald-100 rounded-xl p-5 mb-8">
          <h2 className="text-lg font-semibold text-emerald-900 mb-2">Manual Verification &amp; Billing Model</h2>
          <p className="text-emerald-950 text-sm leading-relaxed">
            Taleem360 operates strictly on a manual onboarding and custom subscription verification model. We have disabled all automated online checkout pathways and direct card charging to maintain maximum transparency and audit controls for educational institutions.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">1. Direct Subscriptions &amp; Payments</h2>
          <p>
            No direct paid subscriptions are processed automatically online. All custom licenses (Tier 1, Tier 2, Tier 3) require credential verification and manual approval by the Super Admin. Any institutional payments are negotiated and executed offline.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">2. Refund Requests &amp; Billing Queries</h2>
          <p>
            As all paid onboarding packages go through our manual credential review, refund claims and cancellation requests are coordinated directly with the Super Admin. Approved cancellations are processed within 1-2 business days with no automatic renewal liability.
          </p>
          <p className="mt-4">
            To submit a billing inquiry or request a pro-rated refund, please email the Super Admin directly at <a href="mailto:accts.pak@gmail.com" className="text-emerald-600 hover:underline font-semibold">accts.pak@gmail.com</a>. Our support desk email <em>support@taleem360.online</em> has been suspended.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">3. Contact Information &amp; Corporate Desk</h2>
          <p>
            For any board-level agreements, audit reports, or tax compliance paperwork, please coordinate with our primary administrative desk:
          </p>
          <ul className="list-unstyled space-y-3 pl-0">
            <li>
              <strong>Primary Contact &amp; Super Admin:</strong> <a href="mailto:accts.pak@gmail.com" className="text-emerald-600 hover:underline font-semibold">accts.pak@gmail.com</a>
            </li>
            <li>
              <strong>Business Office Address:</strong> 
              <br />
              Cantt Bazar Faisal, Karachi-75350, Pakistan
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
};

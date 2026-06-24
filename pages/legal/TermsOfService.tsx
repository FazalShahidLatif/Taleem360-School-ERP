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
    metaDescription.setAttribute('content', 'Terms Of Service and customer agreement policies for Taleem360 ERP Suite. Understood with Paddle Merchant of Record compliance notices.');

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

        <section className="bg-indigo-50 border border-indigo-100 rounded-xl p-5 mb-8">
          <h2 className="text-lg font-semibold text-indigo-900 mb-2">Paddle Merchant of Record Notice</h2>
          <p className="text-indigo-950 text-sm leading-relaxed">
            Please note that our order process and subsequent subscription payments are completed and managed securely by our online Merchant of Record and outsourcing partner, <strong>Paddle.com</strong>. Paddle is the legal Merchant of Record for all orders placed on our website and provides billing customer support, processes regional VAT/sales taxes, and issues transaction invoices.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">1. Acceptance of Terms</h2>
          <p>
            By registering, logging into, or using Taleem360 ("Taleem360-School ERP"), you form a binding legal contract with Taleem360 and agree to comply at all times with these Terms of Service. If you do not agree to these Terms, please immediately terminate your session and delete your account.
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
          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">4. Subscriptions, Payments &amp; Merchant of Record</h2>
          <p>
            Certain ERP modules and premium institutional features require a paid subscription.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Billing Partner (Paddle):</strong> Our order execution process is handled and hosted by Paddle.com. By completing checkout, you authorize Paddle to process transactions and handle billing on behalf of Taleem360.
            </li>
            <li>
              <strong>Immediate Delivery:</strong> Immediately upon successful transaction confirmation from Paddle, your school’s account will be elevated, enabling instantly active SaaS modules.
            </li>
            <li>
              <strong>Automatic Renewals:</strong> Monthly or annual subscription fees are billed in advance on a recurring automatic-renewal schedule corresponding to your selected payment tier (Starter, Professional, or Enterprise).
            </li>
            <li>
              <strong>Pricing and Taxes:</strong> Pricing plans are listed clearly on our website page. Regional sales taxes or VAT are dynamically computed and added by our MoR (Paddle) during the final step of checkout.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">5. Cancellation and Refund Policy</h2>
          <p>
            School administrators can cancel repeating renewals at any time by navigating to "School Settings" or contacting <a href="mailto:support@taleem360.online" className="text-indigo-600 hover:underline">support@taleem360.online</a>.
          </p>
          <p>
            We offer an absolute 14-day fully-guaranteed refund window for all new client registrations. For complete guidelines regarding cancellations, billing, and claiming refunds, please consult our detailed {' '}
            <Link to="/refund-policy" className="text-indigo-600 hover:underline font-semibold">
              Refund &amp; Cancellation Policy Page
            </Link>.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">6. Data Ownership and Compliance</h2>
          <p>
            As a school administrator, you retain all absolute ownership legal rights to the student rosters, transcripts, ledger accounts, and custom educational files uploaded to our cloud databases. Taleem360 is dedicated to securing this database. We maintain strict compliance with regional data guidelines, including standard data encryption and secure role-based permissions.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">7. Termination of Service</h2>
          <p>
            We reserve the right, acting reasonably and with formal notice, to suspend or terminate accounts that breach these Terms or create legal liabilities for our platform, our payment providers, or other active institutional subscribers.
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
            26/792 Cantt Bazar, Drigh Road, Karaci -75350, Pakistan
            <br />
            Business Helpline: +92 (332) 213 7898
            <br />
            Contact Email: <a href="mailto:support@taleem360.online" className="text-indigo-600 hover:underline">support@taleem360.online</a>
          </p>
        </section>
      </div>
    </div>
  );
};

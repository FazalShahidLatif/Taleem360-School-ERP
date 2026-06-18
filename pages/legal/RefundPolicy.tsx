import React, { useEffect } from 'react';

export const RefundPolicy: React.FC = () => {
  useEffect(() => {
    document.title = 'Refund & Cancellation Policy - Taleem360 School Cloud ERP';
    
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', 'Read about the Refund and Cancellation Policies of the Taleem360 ERP Suite subscription models, processed securely by Paddle.');

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
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Refund &amp; Cancellation Policy</h1>
      <div className="prose prose-indigo max-w-none text-gray-600 space-y-6">
        <p className="text-sm text-gray-500">Last updated: June 17, 2026</p>

        <section className="bg-indigo-50 border border-indigo-100 rounded-xl p-5 mb-8">
          <h2 className="text-lg font-semibold text-indigo-900 mb-2">Merchant of Record Disclosure</h2>
          <p className="text-indigo-950 text-sm leading-relaxed">
            Our order process and subscription billing are handled by our online merchant of record and payment partner, <strong>Paddle.com</strong>. Paddle is the Merchant of Record (MoR) for all of our platform transactions. They process card payments, comply with local tax regulations, handle subscription management, and manage legal billing inquiries.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">1. Delivery and Fulfillment Policy</h2>
          <p>
            Taleem360 is a fully digital, cloud-based School ERP &amp; Learning Management System. Because our platform is hosted in the cloud, there is no physical delivery, shipping fee, or postal delay involved. 
          </p>
          <p>
            Upon successful registration and confirmation of your purchase or subscription payment through our Merchant of Record (Paddle), your account is upgraded immediately. All paid features, student management modules, cloud ledgers, and SMS broadcasts will be instantly unlocked inside your school administration dashboard.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">2. Subscription Cancellation</h2>
          <p>
            You can cancel your subscription at any time without any cancellation fees, penalties, or long-term commitments. 
          </p>
          <p>
            To cancel your subscription, you may do so through one of the following methods:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Directly in Settings:</strong> Navigate to the <em>School Settings</em> or <em>Accounting / Subscription</em> section inside your school administrator dashboard, and click on "Manage Subscription".
            </li>
            <li>
              <strong>Via Email Support:</strong> Submit a request to our support team at <a href="mailto:support@taleem360.online" className="text-indigo-600 hover:underline">support@taleem360.online</a> with your account registration details. We require at least 1-2 business days prior to your billing cycle renewal date to process cancellations manually.
            </li>
          </ul>
          <p>
            Upon cancellation, your premium plan will remain active until the end of your current pre-paid billing cycle. No further automatic recurring charges will be initiated after cancellation.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">3. Refund Policy (14-Day Money-Back Guarantee)</h2>
          <p>
            We stand behind the quality of Taleem360 ERP. To ensure you can subscribe with absolute confidence, we offer a <strong>14-Day Money-Back Guarantee</strong> for all first-time purchases and new subscription plans.
          </p>
          <p>
            If you determine that Taleem360 does not perfectly fit your school’s administrative requirements within 14 calendar days of your initial purchase date, you are eligible for a full 100% refund of your purchase amount.
          </p>
          <h3 className="text-lg font-medium text-gray-900 mt-4 mb-2">How to Request a Refund:</h3>
          <p>
            To lodge a refund claim, please email us directly at <a href="mailto:support@taleem360.online" className="text-indigo-600 hover:underline">support@taleem360.online</a>. Please include the following details:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>The registered administrator email address and school name.</li>
            <li>The order ID, transaction ID, or copy of your receipt received from Paddle.</li>
            <li>A brief description of why you are requesting a refund (this helps us improve our educational services).</li>
          </ul>
          <p className="mt-4">
            Once submitted, our support team will handle your request immediately. Approved refunds will be automatically reversal-processed by Paddle back to the original funding payment method (Visa, Mastercard, PayPal, etc.) within 5-10 business days depending on your financial institution.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">4. Subsequent Billing &amp; Renewal Refunds</h2>
          <p>
            Except as outlined in our 14-day money-back guarantee, or as mandated by applicable consumer protection laws in your local jurisdiction, processed renewal payments (monthly or annual subscription renewals) are generally non-refundable. If you cancel after a renewal invoice has been generated and charged, you will retain access to your premium system until the end of that billing period.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">5. Contact Information &amp; Legal Entity</h2>
          <p>
            If you have any questions or require administrative assistance with your payments, subscription, or refunds, please do not hesitate to contact our customer support team:
          </p>
          <ul className="list-unstyled space-y-3 pl-0">
            <li>
              <strong>Customer Support Email:</strong> <a href="mailto:support@taleem360.online" className="text-indigo-600 hover:underline">support@taleem360.online</a> (Response timeline is within 24 hours)
            </li>
            <li>
              <strong>Physical Headquarters / Business Office:</strong> 
              <br />
              Cantt Bazar Faisal, Karachi-75350, Pakistan
            </li>
            <li>
              <strong>Official Corporate Registry:</strong> Registered in compliance with SECP guidelines.
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
};

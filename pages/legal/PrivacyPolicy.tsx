import React, { useEffect } from 'react';

export const PrivacyPolicy: React.FC = () => {
  useEffect(() => {
    document.title = 'Privacy Policy - Taleem360 School Cloud ERP';
    
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', 'Privacy Policy for Taleem360 portal administrators and users. Read about our student data safeguards and manual license verification model.');

    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', 'https://www.taleem360.online/privacy');
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
      <div className="prose prose-indigo max-w-none text-gray-600 space-y-6">
        <p className="text-sm text-gray-500">Last updated: June 17, 2026</p>

        <section className="bg-emerald-50 border border-emerald-100 rounded-xl p-5 mb-8">
          <h2 className="text-lg font-semibold text-emerald-900 mb-2">Secure Institutional Data Policy</h2>
          <p className="text-emerald-950 text-sm leading-relaxed">
            All transaction processes, sub-registries, and school-administered directories on this platform are managed under manual verification protocols. We do not integrate automated online checkouts or share data with external payment processors.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">1. Introduction</h2>
          <p>
            Welcome to Taleem360-School ERP. We respect your privacy and are committed to protecting the confidential student and administrative data you load on our platform. This policy outlines how we gather, protect, process, and store user metadata when managing school portals and dashboards.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">2. The Categories of Data We Collect</h2>
          <p>
            We process two categories of data: platform administrator data and school-administered student/parent records.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Identity &amp; Contact Data:</strong> Includes researcher names, email addresses, phone digits, and school registry fields populated during manual administrative onboarding.
            </li>
            <li>
              <strong>Student &amp; Parent Administration Data:</strong> Roster files, attendance coordinates, gradebooks, timetables, and billing fee ledgers submitted by the authorized school administrator.
            </li>
            <li>
              <strong>Technical Logs &amp; Metadata:</strong> Internet Protocol (IP) addresses, browser cookies, local sessions metadata, and analytics detailing system navigation speed.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">3. Payment Information &amp; Third-Party Disclosures</h2>
          <p>
            Taleem360 does not support online payment processing. We do not collect, process, or hold raw card credentials or sensitive payment details. All custom licensing packages are managed and authorized manually by our Super Admin team at accts.pak@gmail.com. No payment-related data is disclosed to third parties.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">4. How We Secure and Store Your Data</h2>
          <p>
            We implement high-level digital security protocols across all modules:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>End-to-end data transmission security utilizing TLS (Transport Layer Security) encryption.</li>
            <li>Role-Based Access Control (RBAC) ensuring only authorized regional school personnel can examine class records.</li>
            <li>Regular database backups and secure firewall protocols hosted in reliable container architecture.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">5. Cookies and Web Analytics</h2>
          <p>
            We use technical cookies to store active administrator sessions and verify subscription permissions dynamically on your web browser. You can disable cookies inside your personal browser settings, although doing so may restrict certain interactive elements of the core ERP interface.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">6. Your Legal Privacy Rights</h2>
          <p>
            Depending on your regional educational authority and jurisdiction, you possess specific legal rights, including requesting deletion of student registries or auditing held administrative metadata. To exercise these rights, please connect immediately with our safety officer:
          </p>
          <p className="mt-4 text-emerald-700 font-semibold">
            Primary Communication Center:
          </p>
          <p className="text-gray-600 leading-relaxed">
            Taleem360 Security Division
            <br />
            Email Support: <a href="mailto:accts.pak@gmail.com" className="text-emerald-600 hover:underline font-semibold">accts.pak@gmail.com</a>
            <br />
            Address: Cantt Bazar Faisal, Karachi-75350, Pakistan
          </p>
        </section>
      </div>
    </div>
  );
};

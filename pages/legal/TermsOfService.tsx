import React from 'react';

export const TermsOfService: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
      <div className="prose prose-indigo max-w-none text-gray-600 space-y-6">
        <p>Last updated: March 08, 2026</p>
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">1. Acceptance of Terms</h2>
          <p>By accessing and using Taleem360-School ERP, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">2. Description of Service</h2>
          <p>Taleem360-School ERP provides users with access to a rich collection of resources, including various school management tools, student tracking, and financial modules. You understand and agree that the Service is provided "AS-IS" and that Taleem360 assumes no responsibility for the timeliness, deletion, mis-delivery or failure to store any user communications or personalization settings.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">3. Registration Obligations</h2>
          <p>In consideration of your use of the Service, you represent that you are of legal age to form a binding contract and are not a person barred from receiving services under the laws of any applicable jurisdiction.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">4. User Account, Password and Security</h2>
          <p>You will receive a password and account designation upon completing the Service's registration process. You are responsible for maintaining the confidentiality of the password and account and are fully responsible for all activities that occur under your password or account.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">5. Modifications to Service</h2>
          <p>Taleem360 reserves the right at any time and from time to time to modify or discontinue, temporarily or permanently, the Service (or any part thereof) with or without notice.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">6. Termination</h2>
          <p>You agree that Taleem360 may, under certain circumstances and without prior notice, immediately terminate your account and access to the Service.</p>
        </section>
      </div>
    </div>
  );
};

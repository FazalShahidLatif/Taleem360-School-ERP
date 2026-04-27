import React from 'react';

export const CookiePolicy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Cookie Policy</h1>
      <div className="prose prose-indigo max-w-none text-gray-600 space-y-6">
        <p>Last updated: March 08, 2026</p>
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">1. What are Cookies?</h2>
          <p>Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work, or work more efficiently, as well as to provide information to the owners of the site.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">2. How We Use Cookies</h2>
          <p>We use cookies for several reasons, including:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Essential Cookies:</strong> These are necessary for the website to function properly. They include, for example, cookies that enable you to log into secure areas of our website.</li>
            <li><strong>Analytical/Performance Cookies:</strong> They allow us to recognize and count the number of visitors and to see how visitors move around our website when they are using it.</li>
            <li><strong>Functionality Cookies:</strong> These are used to recognize you when you return to our website. This enables us to personalize our content for you and remember your preferences.</li>
          </ul>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">3. Managing Cookies</h2>
          <p>Most web browsers allow some control of most cookies through the browser settings. To find out more about cookies, including how to see what cookies have been set and how to manage and delete them, visit <a href="https://www.aboutcookies.org" className="text-indigo-600 hover:text-indigo-500">www.aboutcookies.org</a> or <a href="https://www.allaboutcookies.org" className="text-indigo-600 hover:text-indigo-500">www.allaboutcookies.org</a>.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">4. Changes to This Cookie Policy</h2>
          <p>We may update our Cookie Policy from time to time. We will notify you of any changes by posting the new Cookie Policy on this page.</p>
        </section>
      </div>
    </div>
  );
};

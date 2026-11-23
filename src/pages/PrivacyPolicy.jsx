import React from "react";
import Navbar from "../components/home/Navbar";
import FooterSection from "../components/home/FooterSection";

const sections = [
  {
    title: "1. Google Analytics Disclosure",
    content: `We use Google Analytics, a web analytics service provided by Google, Inc. ("Google"). Google Analytics uses "cookies" — small text files placed on your computer — to help us analyze how users interact with our Site.\n\nFor more information on how Google uses data when you use our Site, please visit Google's partner site: https://policies.google.com/technologies/partner-sites`,
  },
  {
    title: "2. Data We Collect via Google Analytics",
    content: null,
    list: [
      "Your IP address (masked/anonymized where required by law).",
      "Operating system and browser type.",
      "Device type (mobile, desktop, tablet).",
      "Pages visited on our Site and time spent on those pages.",
      "Referral sources (how you arrived at our Site).",
      "General geographic location (city/region).",
    ],
  },
  {
    title: "3. Purpose of Collection",
    content: "We use the information gathered by Google Analytics to:",
    list: [
      "Monitor and analyze web traffic and trends.",
      "Improve the design, functionality, and user experience of our Site.",
      "Understand which content is most relevant to our visitors.",
      "Evaluate the effectiveness of our marketing campaigns.",
    ],
  },
  {
    title: "4. Cookies and Tracking Technologies",
    content:
      "Google Analytics sets cookies (such as the _ga and _gid cookies) to distinguish unique users and throttle request rates. These cookies are stored on your device for varying durations depending on their function. By using this Site, you consent to the processing of data about you by Google in the manner and for the purposes set out above.",
  },
  {
    title: "5. How to Opt-Out",
    content:
      "You have several options to prevent your data from being used by Google Analytics:",
    list: [
      "Browser Add-on: You can download and install the Google Analytics Opt-out Browser Add-on (https://tools.google.com/dlpage/gaoptout). This prevents the Google Analytics JavaScript from sharing information with Google Analytics about visit activity.",
      "Cookie Settings: You can refuse the use of cookies by selecting the appropriate settings on your browser. However, please note that if you do this, you may not be able to use the full functionality of this Site.",
      "Consent Banner: If you are visiting from the EU or other regions with strict privacy laws, you may use our on-site cookie consent banner to reject 'Analytical' or 'Performance' cookies.",
    ],
  },
  {
    title: "6. GDPR and International Transfers (For EU/EEA Users)",
    content:
      "If you are located in the European Economic Area (EEA), we process your data based on your explicit consent. Google may transfer and store the information collected by cookies on servers in the United States. We ensure that such transfers comply with applicable data protection laws through the use of standard contractual clauses or other approved data transfer mechanisms.",
  },
  {
    title: "7. CCPA/CPRA Disclosure (For California Residents)",
    content:
      "We do not 'sell' your personal information in the traditional sense. However, the use of Google Analytics may be considered 'sharing' for cross-context behavioral advertising under the California Privacy Rights Act (CPRA). You may opt-out of such sharing using the mechanisms described in Section 5.",
  },
  {
    title: "8. Contact Us",
    content:
      "If you have any questions about this Privacy Policy or our use of Google Analytics, please contact us at: marketing@farislee.com",
  },
];

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#F7F8FA]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Navbar />

      {/* Hero */}
      <div className="bg-[#0A1628] pt-28 pb-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-[#C8102E] text-xs tracking-[0.3em] uppercase font-semibold">Legal</span>
          <h1 className="text-white text-4xl font-bold mt-4">Privacy Policy</h1>
          <div className="w-12 h-0.5 bg-[#C8102E] mx-auto mt-5" />
          <p className="text-white/50 mt-4 text-sm">
            This Privacy Policy describes how Faris Lee Investments ("we," "us," or "our") collects, uses, and shares information when you visit www.farislee.com (the "Site"). We are committed to protecting your privacy and being transparent about the technologies we use.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-16 space-y-10">
        {sections.map((s) => (
          <div key={s.title}>
            <h2 className="text-[#0A1628] text-lg font-bold mb-3">{s.title}</h2>
            {s.content && <p className="text-gray-500 leading-relaxed mb-3">{s.content}</p>}
            {s.list && (
              <ul className="list-disc list-inside space-y-1.5 text-gray-500 text-sm leading-relaxed">
                {s.list.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            )}
          </div>
        ))}

        {/* Third-Party Providers */}
        <div>
          <h2 className="text-[#0A1628] text-lg font-bold mb-3">Third-Party Service Providers</h2>

          <h3 className="text-[#0A1628] font-semibold mb-2">Email Marketing</h3>
          <p className="text-gray-500 leading-relaxed mb-4">
            We may use your personal data to contact you with newsletters, marketing or promotional materials and other information that may be of interest to you. You may opt-out of receiving any or all of these communications by following the unsubscribe link or instructions provided in any email we send or by contacting us. We may use Email Marketing Service Providers to manage and send emails to you. Visit{" "}
            <a href="https://www.constantcontact.com/legal/privacy-center" target="_blank" rel="noopener noreferrer" className="text-[#C8102E] hover:underline">
              Constant Contact's Privacy Center
            </a>{" "}
            for more information.
          </p>

          <h3 className="text-[#0A1628] font-semibold mb-2">How We Use Your Information</h3>
          <ul className="list-disc list-inside space-y-1.5 text-gray-500 text-sm leading-relaxed mb-4">
            <li>To provide and maintain our services.</li>
            <li>To communicate with you, including responding to inquiries.</li>
            <li>To send marketing materials or newsletters (if you have opted in).</li>
            <li>To analyze website performance and improve user experience.</li>
            <li>We do not sell your personal information to third parties.</li>
          </ul>

          <p className="text-gray-500 leading-relaxed mb-4">
            We utilize several third-party tools to help operate our website and business. These providers have access to your personal information only to perform specific tasks on our behalf:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-500 text-sm leading-relaxed">
            <li><strong>Google Analytics:</strong> Used to understand how visitors engage with our site via anonymous traffic data cookies. You can opt-out by installing the Google Analytics Opt-out Browser Add-on.</li>
            <li><strong>Constant Contact:</strong> Used to manage email marketing lists and send communications. You can unsubscribe at any time using the link at the bottom of our emails.</li>
            <li><strong>Buildout.com:</strong> Used for commercial real estate listings and marketing. Information submitted through listing inquiries may be processed via Buildout's platform.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-[#0A1628] text-lg font-bold mb-3">Advertising and Tracking</h2>
          <p className="text-gray-500 leading-relaxed">
            Our website does not display third-party advertisements. We do not use "behavioral tracking" for advertising purposes, though we do use the analytics mentioned above to improve site functionality.
          </p>
        </div>

        <div>
          <h2 className="text-[#0A1628] text-lg font-bold mb-3">Document Access</h2>
          <p className="text-gray-500 leading-relaxed">
            When you access documents on our site, we may require you to provide contact details (email, first name, last name, phone, company, job title, country) before viewing certain tiers of documents. We use cookies to recognize returning visitors. If you clear cookies, you may be asked to enter your information again, which can create duplicate leads and separate web activity for each instance.
          </p>
        </div>

        <p className="text-gray-400 text-xs pt-4 border-t border-gray-200">
          © {new Date().getFullYear()} Faris Lee Investments. All rights reserved.
        </p>
      </div>

      <FooterSection />
    </div>
  );
}
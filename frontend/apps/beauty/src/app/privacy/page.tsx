import type { Metadata } from "next";
import { generatePageMeta } from "@/lib/seo";

export const metadata: Metadata = generatePageMeta({
  title: "Privacy Policy — Appilico Beauty",
  description: "Read Appilico's Privacy Policy. Learn how we collect, use, and protect your personal information in compliance with Australian Privacy Principles.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-display font-bold text-gray-900 mb-2">Privacy Policy</h1>
      <p className="text-sm text-gray-400 mb-10">Effective Date: January 2026 · Last Updated: May 2026</p>

      <div className="prose prose-gray max-w-none prose-headings:font-display prose-headings:text-gray-900 prose-a:text-primary">
        <p>
          Appilico Pty Ltd (&ldquo;Appilico&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) is committed to protecting your privacy. This Privacy Policy outlines how we collect, use, disclose, and safeguard your personal information when you use the Appilico Beauty platform (beauty.appilico.com.au) and related services.
        </p>
        <p>
          We comply with the Australian Privacy Principles (APPs) contained in the <em>Privacy Act 1988</em> (Cth).
        </p>

        <h2>1. Information We Collect</h2>
        <h3>Personal Information</h3>
        <ul>
          <li><strong>Account information:</strong> Name, email address, phone number, and password when you create an account</li>
          <li><strong>Business information:</strong> Business name, address, suburb, category, services, pricing, photos, and descriptions (for providers)</li>
          <li><strong>Reviews and ratings:</strong> Content you submit including your name and review text</li>
          <li><strong>Enquiries:</strong> Messages sent through our contact or enquiry forms</li>
        </ul>
        <h3>Usage Data</h3>
        <ul>
          <li>Pages visited, search queries, and features used</li>
          <li>Device information, browser type, and IP address</li>
          <li>Referral sources and interaction patterns</li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <ul>
          <li>To operate and maintain the Appilico marketplace</li>
          <li>To create and manage your account and provider profile</li>
          <li>To facilitate communication between customers and providers</li>
          <li>To display reviews, ratings, and business information publicly</li>
          <li>To send important platform notifications and updates</li>
          <li>To improve our services, features, and user experience</li>
          <li>To detect and prevent fraudulent or abusive activity</li>
          <li>To comply with legal obligations</li>
        </ul>

        <h2>3. Who We Share Your Information With</h2>
        <p>We do not sell your personal information. We may share information with:</p>
        <ul>
          <li><strong>Other users:</strong> Your public profile, reviews, and business information are visible to other platform users</li>
          <li><strong>Service providers:</strong> Trusted third-party services that help us operate the platform (hosting, analytics, email delivery)</li>
          <li><strong>Legal authorities:</strong> When required by law, court order, or to protect our rights</li>
        </ul>

        <h2>4. Your Rights</h2>
        <p>Under the Australian Privacy Principles, you have the right to:</p>
        <ul>
          <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
          <li><strong>Correction:</strong> Request correction of inaccurate or outdated information</li>
          <li><strong>Deletion:</strong> Request deletion of your account and personal information</li>
          <li><strong>Complaint:</strong> Lodge a complaint about our handling of your personal information</li>
        </ul>
        <p>To exercise any of these rights, contact us at <a href="mailto:privacy@appilico.com.au">privacy@appilico.com.au</a>.</p>

        <h2>5. Cookies and Tracking</h2>
        <p>
          We use cookies and similar tracking technologies to enhance your experience, remember your preferences, and analyse platform usage. You can control cookie settings through your browser. Disabling cookies may affect some platform functionality.
        </p>
        <p>We use the following analytics services:</p>
        <ul>
          <li><strong>Google Analytics 4:</strong> To understand how users interact with the platform</li>
          <li><strong>Microsoft Clarity:</strong> To understand user behaviour through session recordings and heatmaps</li>
        </ul>

        <h2>6. Data Security</h2>
        <p>
          We implement industry-standard security measures to protect your personal information, including encrypted data transmission (HTTPS), secure password hashing, and access controls. However, no method of electronic storage or transmission is 100% secure.
        </p>

        <h2>7. Data Retention</h2>
        <p>
          We retain your personal information for as long as your account is active or as needed to provide services. When you delete your account, we will remove your personal information within 30 days, except where we are required to retain it for legal or regulatory purposes.
        </p>

        <h2>8. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the updated policy on this page and updating the &ldquo;Last Updated&rdquo; date.
        </p>

        <h2>9. Contact Us</h2>
        <p>
          For any privacy-related questions, concerns, or requests, please contact:
        </p>
        <p>
          <strong>Privacy Officer</strong><br />
          Appilico Pty Ltd<br />
          Email: <a href="mailto:privacy@appilico.com.au">privacy@appilico.com.au</a><br />
          Perth, Western Australia
        </p>
        <p>
          If you are not satisfied with our response, you may lodge a complaint with the <a href="https://www.oaic.gov.au" target="_blank" rel="noopener noreferrer">Office of the Australian Information Commissioner (OAIC)</a>.
        </p>
      </div>
    </div>
  );
}

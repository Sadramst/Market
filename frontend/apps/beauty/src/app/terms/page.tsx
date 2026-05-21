import type { Metadata } from "next";
import { generatePageMeta } from "@/lib/seo";

export const metadata: Metadata = generatePageMeta({
  title: "Terms of Service — Appilico Beauty",
  description: "Read Appilico's Terms of Service. Understand the rules and guidelines for using Perth's beauty marketplace platform.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)', fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 400 }}>Terms of Service</h1>
      <p className="text-[13px] mb-10" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-muted)' }}>Effective Date: January 2026 · Last Updated: May 2026</p>

      <div className="prose prose-gray max-w-none" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)', lineHeight: 1.75 }}>
        <p>
          Welcome to Appilico Beauty (&ldquo;Platform&rdquo;), operated by Appilico Pty Ltd (&ldquo;Appilico&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;). By accessing or using our Platform at beauty.appilico.com.au, you agree to be bound by these Terms of Service (&ldquo;Terms&rdquo;). If you do not agree, please do not use the Platform.
        </p>

        <h2>1. Platform Description</h2>
        <p>
          Appilico Beauty is an online marketplace that connects beauty service providers (&ldquo;Providers&rdquo;) with customers (&ldquo;Users&rdquo;) in Perth, Western Australia. We provide a platform for Providers to list their services and for Users to discover, compare, and contact beauty professionals.
        </p>
        <p>
          Appilico is not a party to any transaction between Providers and Users. We do not provide beauty services directly and are not responsible for the quality, safety, or legality of services offered by Providers.
        </p>

        <h2>2. Eligibility</h2>
        <ul>
          <li>You must be at least 18 years of age to create an account or use the Platform</li>
          <li>Provider accounts must represent a legitimate beauty business operating in Western Australia</li>
          <li>You must provide accurate and truthful information when registering</li>
        </ul>

        <h2>3. Provider Terms</h2>
        <p>By listing your business on Appilico, you agree to:</p>
        <ul>
          <li><strong>Accurate information:</strong> Provide truthful, current, and complete information about your business, services, and pricing</li>
          <li><strong>Professional conduct:</strong> Maintain professional standards in all interactions with Users and the Platform</li>
          <li><strong>Listing standards:</strong> Ensure your profile content (descriptions, photos, services) is accurate, appropriate, and does not infringe on third-party rights</li>
          <li><strong>Responsiveness:</strong> Make reasonable efforts to respond to enquiries in a timely manner</li>
          <li><strong>Compliance:</strong> Comply with all applicable laws, regulations, and licensing requirements for your business in Western Australia</li>
        </ul>

        <h2>4. Customer Terms</h2>
        <p>By using Appilico as a customer, you agree to:</p>
        <ul>
          <li><strong>Personal use:</strong> Use the Platform for personal, non-commercial purposes only</li>
          <li><strong>Review guidelines:</strong> Submit only honest, fair, and accurate reviews based on genuine experiences. Do not submit fake, defamatory, or malicious reviews</li>
          <li><strong>Respectful conduct:</strong> Treat Providers and other Users with respect in all communications</li>
        </ul>

        <h2>5. Prohibited Conduct</h2>
        <p>You must not:</p>
        <ul>
          <li>Use the Platform for any unlawful purpose</li>
          <li>Submit false, misleading, or fraudulent information</li>
          <li>Harass, abuse, or threaten other users</li>
          <li>Scrape, crawl, or collect data from the Platform without permission</li>
          <li>Attempt to gain unauthorised access to our systems or other users&apos; accounts</li>
          <li>Upload malicious software, spam, or inappropriate content</li>
          <li>Circumvent or manipulate Platform features (e.g., review manipulation, fake accounts)</li>
          <li>Use the Platform to advertise competing services or third-party platforms</li>
        </ul>

        <h2>6. Intellectual Property</h2>
        <p>
          All content, design, trademarks, and intellectual property on the Appilico Platform belong to Appilico Pty Ltd unless otherwise stated. You retain ownership of content you submit (e.g., photos, reviews, descriptions), but grant us a non-exclusive, royalty-free licence to display and use that content on the Platform.
        </p>

        <h2>7. Reviews and Content</h2>
        <p>
          Reviews submitted through the Platform are subject to moderation. We reserve the right to remove reviews that violate our guidelines, contain inappropriate content, or appear to be fraudulent. Providers may respond to reviews but cannot remove them.
        </p>

        <h2>8. Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by law:
        </p>
        <ul>
          <li>Appilico is provided &ldquo;as is&rdquo; without warranties of any kind</li>
          <li>We are not liable for any damages arising from your use of the Platform or interactions with Providers</li>
          <li>We do not guarantee the accuracy, completeness, or reliability of any listings, reviews, or information on the Platform</li>
          <li>Our total liability for any claim shall not exceed the amount you have paid to us (if any) in the 12 months prior to the claim</li>
        </ul>

        <h2>9. Account Termination</h2>
        <p>
          We reserve the right to suspend or terminate your account at any time if you violate these Terms or engage in conduct that we deem harmful to the Platform, its users, or our reputation. You may also delete your account at any time through your account settings.
        </p>

        <h2>10. Changes to Terms</h2>
        <p>
          We may update these Terms from time to time. Continued use of the Platform after changes constitutes acceptance of the revised Terms. We will notify registered users of material changes via email.
        </p>

        <h2>11. Governing Law</h2>
        <p>
          These Terms are governed by the laws of Western Australia, Australia. Any disputes arising from these Terms or your use of the Platform shall be subject to the exclusive jurisdiction of the courts of Western Australia.
        </p>

        <h2>12. Contact</h2>
        <p>
          For questions or concerns about these Terms of Service, please contact:
        </p>
        <p>
          <strong>Legal Department</strong><br />
          Appilico Pty Ltd<br />
          Email: <a href="mailto:legal@appilico.com.au">legal@appilico.com.au</a><br />
          Perth, Western Australia
        </p>
      </div>
    </div>
  );
}

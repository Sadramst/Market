import type { Metadata } from "next";
import { generatePageMeta } from "@/lib/seo";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = generatePageMeta({
  title: "Contact Us — Appilico Beauty",
  description: "Get in touch with the Appilico team. We're here to help with general enquiries, provider support, issue reporting, and partnership opportunities.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)', fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 400 }}>
          Get in <em>Touch</em>
        </h1>
        <p className="text-[15px] font-light max-w-lg mx-auto mt-2" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)' }}>Have a question or need help? We&apos;d love to hear from you.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Contact Info */}
        <div className="space-y-6">
          <div className="p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px' }}>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-[20px]">✉️</span>
              <div>
                <h3 className="text-[15px] font-medium" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-primary)' }}>Email</h3>
                <a href="mailto:hello@appilico.com.au" className="text-[14px] hover:underline" style={{ color: 'var(--brand-rose)' }}>hello@appilico.com.au</a>
              </div>
            </div>
          </div>

          <div className="p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px' }}>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-[20px]">📍</span>
              <div>
                <h3 className="text-[15px] font-medium" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-primary)' }}>Location</h3>
                <p className="text-[14px]" style={{ color: 'var(--text-secondary)' }}>Perth, Western Australia</p>
              </div>
            </div>
          </div>

          <div className="p-6" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '8px' }}>
            <p className="text-[14px] font-light" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)' }}>
              <span className="font-medium" style={{ color: 'var(--text-primary)' }}>Response time:</span> We aim to respond within 1–2 business days. For urgent provider support, please include your business name in the subject.
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px' }}>
          <h2 className="mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', fontSize: '1.125rem', fontWeight: 600 }}>Send a Message</h2>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}

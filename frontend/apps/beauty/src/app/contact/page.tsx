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
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-display font-bold text-gray-900 mb-4">Get in Touch</h1>
        <p className="text-gray-500 max-w-lg mx-auto">Have a question or need help? We&apos;d love to hear from you.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Contact Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Email</h3>
                <a href="mailto:hello@appilico.com.au" className="text-sm text-primary hover:underline">hello@appilico.com.au</a>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Location</h3>
                <p className="text-sm text-gray-500">Perth, Western Australia</p>
              </div>
            </div>
          </div>

          <div className="bg-rose-50/50 rounded-2xl border border-rose-100/50 p-6">
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Response time:</span> We aim to respond within 1–2 business days. For urgent provider support, please include your business name in the subject.
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="text-lg font-display font-bold text-gray-900 mb-4">Send a Message</h2>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}

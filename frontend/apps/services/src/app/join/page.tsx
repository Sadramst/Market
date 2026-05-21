import type { Metadata } from "next";
import Link from "next/link";
import { serviceCategories } from "../../lib/serviceCategories";

export const metadata: Metadata = {
  title: "List Your IT Service",
  description: "Join Appilico Services as a Perth IT professional or technology service provider.",
};

export default function JoinPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-14 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[1fr_420px] lg:items-start">
        <section>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Provider intake</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-950">List your Perth IT service</h1>
          <p className="mt-4 max-w-2xl text-gray-500">Create a discoverable profile for businesses looking for web, app, cloud, support, security, and product specialists.</p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {["Profile review", "Verified contact details", "Category matching", "Source-backed listings"].map((item) => (
              <div key={item} className="rounded-2xl border border-gray-100 bg-white p-4 text-sm font-medium text-gray-700 shadow-sm shadow-gray-900/[0.02]">{item}</div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xl shadow-blue-900/[0.05]">
          <h2 className="text-lg font-semibold text-gray-950">Business details</h2>
          <form className="mt-5 space-y-4" action="mailto:hello@appilico.com.au" method="post" encType="text/plain">
            <input name="business" required placeholder="Business name" className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-blue-400" />
            <input name="email" type="email" required placeholder="Work email" className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-blue-400" />
            <input name="website" placeholder="Website or profile link" className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-blue-400" />
            <select name="category" className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-blue-400" defaultValue="">
              <option value="" disabled>Primary category</option>
              {serviceCategories.map((category) => <option key={category.slug} value={category.slug}>{category.name}</option>)}
            </select>
            <textarea name="notes" placeholder="Services, suburb coverage, and useful links" className="min-h-28 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-blue-400" />
            <button className="w-full rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700">Send listing request</button>
          </form>
          <p className="mt-4 text-center text-xs text-gray-400">Prefer email? <Link href="mailto:hello@appilico.com.au" className="text-blue-600">hello@appilico.com.au</Link></p>
        </section>
      </div>
    </div>
  );
}

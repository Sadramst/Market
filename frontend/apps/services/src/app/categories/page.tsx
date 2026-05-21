import type { Metadata } from "next";
import Link from "next/link";
import { serviceCategories } from "../../lib/serviceCategories";

export const metadata: Metadata = {
  title: "IT Service Categories",
  description: "Browse Perth IT service categories including web development, cloud, cybersecurity, support, data, and digital marketing.",
};

export default function CategoriesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-14 sm:px-6 lg:px-8">
      <div className="mb-10 max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Categories</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-950">Find the right Perth tech specialist</h1>
        <p className="mt-3 text-gray-500">Browse service areas built around real business needs, from product builds to ongoing support.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {serviceCategories.map((category) => (
          <Link key={category.slug} href={`/category/${category.slug}`} className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm shadow-gray-900/[0.02] transition hover:border-blue-200 hover:shadow-lg hover:shadow-blue-900/[0.06]">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-sm font-bold text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">{category.short}</div>
            <h2 className="text-lg font-semibold text-gray-950 group-hover:text-blue-600">{category.name}</h2>
            <p className="mt-2 text-sm leading-6 text-gray-500">{category.desc}</p>
            <span className="mt-5 inline-flex text-sm font-semibold text-blue-600">Browse providers</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

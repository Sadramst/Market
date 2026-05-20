import Link from "next/link";

const itCategories = [
  { name: "Web Development", desc: "Websites, web apps & portals", icon: "🌐", slug: "web-development" },
  { name: "Mobile Apps", desc: "iOS, Android & cross-platform", icon: "📱", slug: "mobile-apps" },
  { name: "Cloud & DevOps", desc: "AWS, Azure, CI/CD pipelines", icon: "☁️", slug: "cloud-devops" },
  { name: "Cybersecurity", desc: "Audits, pen testing & compliance", icon: "🔒", slug: "cybersecurity" },
  { name: "Data & Analytics", desc: "BI, dashboards & data pipelines", icon: "📊", slug: "data-analytics" },
  { name: "IT Support", desc: "Managed services & helpdesk", icon: "🖥️", slug: "it-support" },
  { name: "AI & ML", desc: "Machine learning & automation", icon: "🤖", slug: "ai-ml" },
  { name: "UI/UX Design", desc: "User research & interface design", icon: "🎨", slug: "ui-ux-design" },
  { name: "Consulting", desc: "Strategy, architecture & advisory", icon: "💼", slug: "consulting" },
  { name: "Networking", desc: "Infrastructure & connectivity", icon: "🔌", slug: "networking" },
  { name: "E-Commerce", desc: "Online stores & marketplaces", icon: "🛒", slug: "ecommerce" },
  { name: "Digital Marketing", desc: "SEO, PPC & social media", icon: "📣", slug: "digital-marketing" },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-cyan-50/50 to-white pointer-events-none" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center py-24 px-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 border border-blue-100 rounded-full text-sm text-blue-600 font-medium mb-6 animate-fade-in-up">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
            Perth, Western Australia
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-5 leading-[1.1] tracking-tight animate-fade-in-up animation-delay-100">
            Find Trusted<br />
            <span className="gradient-text-blue">IT Professionals</span>
          </h1>
          <p className="text-lg text-gray-500 mb-10 max-w-2xl mx-auto animate-fade-in-up animation-delay-200">
            Perth&apos;s marketplace for web developers, app builders, cloud engineers, and tech service providers.
          </p>

          <form action="/search" method="GET" className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl shadow-blue-900/5 border border-gray-100 p-2 flex flex-col md:flex-row gap-2 animate-fade-in-up animation-delay-300">
            <div className="flex-1 relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input
                type="text"
                name="q"
                placeholder="What IT service do you need?"
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-gray-50/50 border-0 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white text-gray-900 placeholder:text-gray-400 text-sm transition-all"
              />
            </div>
            <button type="submit" className="px-8 py-3.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all hover:shadow-lg hover:shadow-blue-600/20 active:scale-[0.98] text-sm">
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-6xl mx-auto py-20 px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">IT Service Categories</h2>
          <p className="text-gray-400 mt-2">Find the right tech professional for your project</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {itCategories.map((cat, i) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="service-card flex flex-col items-center p-5 rounded-2xl bg-white border border-gray-100 hover:border-blue-200 group animate-fade-in-up"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <span className="text-3xl mb-3 group-hover:scale-110 transition-transform">{cat.icon}</span>
              <span className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 text-center transition-colors">{cat.name}</span>
              <span className="text-xs text-gray-400 text-center mt-1">{cat.desc}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gradient-to-b from-gray-50/80 to-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Describe Your Project", desc: "Post your IT project requirements and budget", icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              )},
              { step: "2", title: "Get Matched", desc: "Receive proposals from verified Perth tech professionals", icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              )},
              { step: "3", title: "Hire & Build", desc: "Choose the right provider and start your project", icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              )},
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-cyan-500 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-600/20">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 text-lg">{item.title}</h3>
                <p className="text-sm text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-slate-900 to-blue-950" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-3xl" />
        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">Are You a Tech Professional?</h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            List your IT services on Appilico and get discovered by Perth businesses looking for tech talent.
          </p>
          <Link href="/join" className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-600 text-white rounded-full text-sm font-semibold hover:bg-blue-500 transition-all hover:shadow-xl hover:shadow-blue-600/20 active:scale-[0.98]">
            List Your Service — Free
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </Link>
        </div>
      </section>

      {/* SEO Content */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">IT Services in Perth</h2>
          <div className="prose prose-gray text-gray-500 space-y-4 text-center">
            <p>
              Appilico Services connects Perth businesses with trusted IT professionals and tech service providers.
              Whether you need a website built, an app developed, cloud infrastructure set up, or ongoing IT support,
              our marketplace helps you find and compare the right providers.
            </p>
            <p>
              Browse verified tech professionals across web development, mobile app development, cybersecurity,
              cloud computing, data analytics, and more. Every provider is reviewed by real clients.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

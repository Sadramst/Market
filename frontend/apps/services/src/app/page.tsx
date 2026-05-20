import Link from "next/link";

const itCategories = [
  { name: "Web Development", icon: "🌐", slug: "web-development" },
  { name: "Mobile Apps", icon: "📱", slug: "mobile-apps" },
  { name: "Cloud & DevOps", icon: "☁️", slug: "cloud-devops" },
  { name: "Cybersecurity", icon: "🔒", slug: "cybersecurity" },
  { name: "Data & Analytics", icon: "📊", slug: "data-analytics" },
  { name: "IT Support", icon: "🖥️", slug: "it-support" },
  { name: "AI & ML", icon: "🤖", slug: "ai-ml" },
  { name: "UI/UX Design", icon: "🎨", slug: "ui-ux-design" },
  { name: "Consulting", icon: "💼", slug: "consulting" },
  { name: "Networking", icon: "🔌", slug: "networking" },
  { name: "E-Commerce", icon: "🛒", slug: "ecommerce" },
  { name: "Digital Marketing", icon: "📣", slug: "digital-marketing" },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-white py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4 leading-tight">
            Find Trusted<br />
            <span className="text-blue-600">IT Professionals</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Perth&apos;s marketplace for web developers, app builders, cloud engineers, and tech service providers.
          </p>

          <form action="/search" method="GET" className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-2 flex flex-col md:flex-row gap-2">
            <input
              type="text"
              name="q"
              placeholder="What IT service do you need?"
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
            <button type="submit" className="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors">
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-6xl mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-2">IT Service Categories</h2>
        <p className="text-gray-500 text-center mb-10">Find the right tech professional for your project</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {itCategories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="flex flex-col items-center p-4 rounded-xl bg-white border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all group"
            >
              <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">{cat.icon}</span>
              <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 text-center">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-10">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Describe Your Project", desc: "Post your IT project requirements and budget" },
              { step: "2", title: "Get Matched", desc: "Receive proposals from verified Perth tech professionals" },
              { step: "3", title: "Hire & Build", desc: "Choose the right provider and start your project" },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  {item.step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto py-16 px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Are You a Tech Professional?</h2>
        <p className="text-gray-500 mb-6 max-w-xl mx-auto">
          List your IT services on Appilico and get discovered by Perth businesses looking for tech talent.
        </p>
        <Link href="/join" className="inline-block px-8 py-3 bg-blue-600 text-white rounded-full text-lg font-medium hover:bg-blue-700 transition-colors">
          List Your Service — Free
        </Link>
      </section>

      {/* SEO Content */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-4xl mx-auto prose prose-lg text-gray-600">
          <h2 className="text-2xl font-bold text-gray-900 text-center">IT Services in Perth</h2>
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
      </section>
    </>
  );
}

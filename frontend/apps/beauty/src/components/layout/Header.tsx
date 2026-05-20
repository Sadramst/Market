import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-rose-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-display font-bold text-primary">Appilico</span>
            <span className="text-sm text-rose-400 font-medium">Beauty</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/search" className="text-gray-600 hover:text-primary transition-colors">
              Browse
            </Link>
            <Link href="/categories" className="text-gray-600 hover:text-primary transition-colors">
              Categories
            </Link>
            <Link href="/suburbs" className="text-gray-600 hover:text-primary transition-colors">
              Suburbs
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Link
              href="/search"
              className="p-2 text-gray-500 hover:text-primary transition-colors"
              aria-label="Search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>
            {/* TODO: Auth modal / user menu */}
            <Link
              href="/join"
              className="hidden sm:inline-flex items-center px-4 py-2 bg-primary text-white rounded-full text-sm font-medium hover:bg-primary-dark transition-colors"
            >
              List Your Business
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

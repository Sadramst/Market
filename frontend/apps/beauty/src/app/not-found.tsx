export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center">
      <span className="text-6xl mb-4 block">💅</span>
      <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">Page Not Found</h1>
      <p className="text-gray-500 mb-6">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <a
        href="/"
        className="inline-block px-6 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary-dark transition-colors"
      >
        Back to Home
      </a>
    </div>
  );
}

export default function AdminHomePage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="max-w-lg text-center px-4">
        <h1 className="text-3xl font-bold mb-4">
          Appilico Admin
        </h1>
        <p className="text-[var(--muted-foreground)] mb-6">
          Platform management dashboard for providers, reviews, content moderation, and analytics.
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--primary-light)] text-[var(--primary-dark)] text-sm font-medium">
          🔒 Admin Access Required
        </div>
      </div>
    </div>
  );
}

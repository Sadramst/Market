export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="max-w-2xl text-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="text-[var(--primary)]">Appilico</span> Services
        </h1>
        <p className="text-lg text-[var(--muted-foreground)] mb-8">
          Find trusted IT professionals and tech service providers in Perth.
          Coming soon — launching as a lighter companion to our beauty marketplace.
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--accent)] text-[var(--accent-foreground)] text-sm font-medium">
          🚧 Under Development
        </div>
      </div>
    </div>
  );
}

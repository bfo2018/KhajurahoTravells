import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <main className="section-shell flex min-h-[60vh] items-center justify-center py-16">
      <div className="glass-panel max-w-xl p-10 text-center">
        <p className="eyebrow">404</p>
        <h1 className="mt-4 font-display text-5xl text-ink">Page not found</h1>
        <p className="mt-4 text-stone-600">
          The page you requested does not exist. Return to the homepage to continue browsing.
        </p>
        <Link to="/" className="primary-button mt-8">
          Back Home
        </Link>
      </div>
    </main>
  );
}

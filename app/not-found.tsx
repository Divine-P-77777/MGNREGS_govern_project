"use client";
import Link from "next/link";


export default function NotFoundPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="max-w-xl w-full bg-white rounded-xl shadow-md ring-1 ring-slate-200 p-8 text-center">
        <div className="mx-auto w-24 h-24 flex items-center justify-center rounded-full bg-amber-50 mb-6">
          {/* subtle friendly SVG */}
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgb(120 113 108)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M11 7h2" />
            <path d="M12 3v4" />
            <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9" />
            <path d="M12 8v5" />
            <path d="M12 15h.01" />
          </svg>
        </div>

        <h1 className="text-2xl font-semibold text-slate-800 mb-2">Page not found</h1>
        <p className="text-sm text-slate-500 mb-6">
          The page you're looking for doesn't exist or has moved. Here are a few quick options to
          get back on track.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-sky-600 text-white text-sm font-medium hover:bg-sky-700 transition"
            aria-label="Return to Mitra dashboard"
          >
            Return to dashboard
          </Link>

          <Link
            href="/compare"
            className="inline-flex items-center justify-center px-4 py-2 rounded-md border border-slate-200 bg-white text-sm text-slate-700 hover:bg-slate-50 transition"
            aria-label="Go to district comparison"
          >
            Search districts
          </Link>
        </div>

        <div className="mt-6 text-xs text-slate-400">
          If you think this is an error, please{" "}
          <Link href="/contact" className="text-sky-600 hover:underline">
            contact Mitra support
          </Link>
          . You can also try reloading or check the URL for typos.
        </div>
      </div>
    </main>
  );
}
"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex h-screen flex-col bg-background text-foreground font-body">
      {/* Center content */}
      <div className="flex flex-1 flex-col items-center justify-center text-center px-4">
        <h1 className="font-display text-5xl font-bold leading-snug mb-8">
          100 enter <br />
          3 finalists <br />
          1 champion
        </h1>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/enter">
            <button className="btn btn-primary px-6 py-3 rounded-lg shadow-lg font-display text-lg transition hover:bg-primary/90">
              Enter
            </button>
          </Link>
          <Link href="/rules">
            <button className="btn btn-accent px-6 py-3 rounded-lg shadow-lg font-display text-lg transition hover:bg-accent/90">
              Rules
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

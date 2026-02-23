"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-xl font-bold text-[var(--hm-text)] mb-2">Coś poszło nie tak</h1>
      <p className="text-sm text-[var(--hm-muted)] mb-6 text-center max-w-md">
        Wystąpił błąd. Możesz spróbować ponownie lub wrócić na stronę główną.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <button
          type="button"
          onClick={reset}
          className="px-5 py-2.5 rounded-xl bg-[#ffbd45] text-[#0e1117] font-medium hover:opacity-90"
        >
          Spróbuj ponownie
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl border border-[var(--hm-border)] px-5 py-2.5 text-sm font-medium hover:border-[#ffbd45]"
          style={{ backgroundColor: "var(--hm-btn-secondary-bg)", color: "var(--hm-btn-secondary-text)" }}
        >
          ← Strona główna
        </Link>
      </div>
    </main>
  );
}

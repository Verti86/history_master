"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const redirectTo =
      typeof window !== "undefined"
        ? `${window.location.origin}/login?reset=ok`
        : undefined;
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });
    setLoading(false);
    if (err) {
      setError("Nie udało się wysłać linku. Sprawdź adres email i spróbuj ponownie.");
      return;
    }
    setSuccess(true);
  }

  if (success) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-8">
        <div className="rounded-2xl border border-[#444] bg-[#262730]/80 p-6 max-w-md text-center space-y-4">
          <p className="text-4xl" aria-hidden>✉️</p>
          <h1 className="text-xl font-bold text-[#fafafa]">Sprawdź swoją skrzynkę</h1>
          <p className="text-[#e0e0e0] text-sm">
            Wysłaliśmy na <strong className="text-[#fafafa]">{email}</strong> link do ustawienia nowego hasła.
            Kliknij w link w mailu, ustaw hasło i zaloguj się ponownie.
          </p>
          <p className="text-xs text-[#aaa]">
            Nie widzisz maila? Sprawdź folder <strong>SPAM</strong>.
          </p>
          <Link
            href="/login"
            className="inline-block mt-4 px-5 py-2.5 rounded-xl bg-[#ffbd45] text-[#0e1117] font-medium hover:opacity-90"
          >
            Wróć do logowania
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-2xl font-bold mb-2">Zapomniałem hasła</h1>
      <p className="text-[#aaa] text-sm mb-6 text-center max-w-sm">
        Podaj adres email powiązany z kontem. Wyślemy link do ustawienia nowego hasła.
      </p>
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm text-[#aaa] mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-lg bg-[#262730] border border-[#444] text-[#fafafa] focus:border-[#ffbd45] outline-none"
          />
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-3 rounded-lg bg-[#ffbd45] text-[#0e1117] font-medium hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Wysyłanie…" : "Wyślij link"}
        </button>
      </form>
      <Link
        href="/login"
        className="mt-6 inline-flex items-center gap-2 rounded-xl border border-[#444] bg-[#262730]/80 px-4 py-2.5 text-sm font-medium text-[#fafafa] transition-colors hover:border-[#ffbd45]"
      >
        ← Wróć do logowania
      </Link>
    </main>
  );
}

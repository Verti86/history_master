"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err) {
      setError("Nieprawidłowy email lub hasło. Sprawdź dane i spróbuj ponownie.");
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-2xl font-bold mb-6">Zaloguj się</h1>
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
        <div>
          <label htmlFor="password" className="block text-sm text-[#aaa] mb-1">
            Hasło
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="w-full px-4 py-2 rounded-lg bg-[#262730] border border-[#444] text-[#fafafa] focus:border-[#ffbd45] outline-none"
          />
        </div>
        {error && (
          <p className="text-red-400 text-sm">{error}</p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-3 rounded-lg bg-[#ffbd45] text-[#0e1117] font-medium hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Logowanie…" : "Zaloguj się"}
        </button>
      </form>
      <p className="mt-6 text-sm text-[#888]">
        Nie masz konta?{" "}
        <Link href="/rejestracja" className="text-[#ffbd45] hover:underline">
          Zarejestruj się
        </Link>
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center gap-2 rounded-xl border border-[#444] bg-[#262730]/80 px-4 py-2.5 text-sm font-medium text-[#fafafa] transition-colors hover:border-[#ffbd45] hover:bg-[#262730]"
      >
        <span aria-hidden>←</span>
        Strona główna
      </Link>
    </main>
  );
}

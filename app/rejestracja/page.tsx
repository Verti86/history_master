"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function RejestracjaPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error: err } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    setSuccess(true);
  }

  if (success) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-8">
        <p className="text-green-400 mb-4">Konto założone! Zaloguj się.</p>
        <Link href="/login" className="text-[#ffbd45] hover:underline">
          Przejdź do logowania
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-2xl font-bold mb-6">Rejestracja</h1>
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
            Hasło (min. 6 znaków)
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
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
          {loading ? "Rejestracja…" : "Załóż konto"}
        </button>
      </form>
      <p className="mt-6 text-sm text-[#888]">
        Masz konto?{" "}
        <Link href="/login" className="text-[#ffbd45] hover:underline">
          Zaloguj się
        </Link>
      </p>
      <Link href="/" className="mt-4 text-sm text-[#888] hover:text-[#aaa]">
        ← Strona główna
      </Link>
    </main>
  );
}

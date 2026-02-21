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
    if (password.length < 8) {
      setError("Hasło musi mieć co najmniej 8 znaków.");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { error: err } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (err) {
      setError("Coś poszło nie tak. Sprawdź, czy hasło ma co najmniej 8 znaków, i spróbuj ponownie.");
      return;
    }
    setSuccess(true);
  }

  if (success) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-8 max-w-lg mx-auto text-center">
        <div className="rounded-2xl border border-[#444] bg-[#262730]/80 p-6 space-y-4">
          <p className="text-4xl" aria-hidden>✉️</p>
          <h2 className="text-xl font-bold text-[#fafafa]">
            Konto zostało utworzone!
          </h2>
          <p className="text-[#e0e0e0] leading-relaxed">
            Wysłaliśmy na Twój adres email wiadomość z linkiem. <strong className="text-[#fafafa]">Kliknij ten link</strong>, żeby potwierdzić konto i móc się zalogować.
          </p>
          <p className="text-sm text-[#aaa]">
            Nie widzisz maila? Sprawdź folder <strong>SPAM</strong> lub <strong>Oferty</strong>. Wiadomość może przyjść z kilkuminutowym opóźnieniem.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-xl bg-[#ffbd45] text-[#0e1117] font-medium px-5 py-2.5 hover:opacity-90 transition-opacity"
            >
              Przejdź do logowania
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 justify-center rounded-xl border border-[#444] bg-[#262730]/80 px-5 py-2.5 text-sm font-medium text-[#fafafa] transition-colors hover:border-[#ffbd45] hover:bg-[#262730]"
            >
              <span aria-hidden>←</span>
              Strona główna
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-2xl font-bold mb-2">Załóż konto</h1>
      <p className="text-[#aaa] text-sm mb-6">Wpisz swój email i wymyśl hasło. Potem wyślemy Ci maila z linkiem do aktywacji konta.</p>
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm text-[#aaa] mb-1">
            Twój adres email
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
            Wymyśl hasło (co najmniej 8 znaków)
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
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
          {loading ? "Wysyłamy…" : "Załóż konto"}
        </button>
      </form>
      <p className="mt-6 text-sm text-[#888]">
        Masz już konto?{" "}
        <Link href="/login" className="text-[#ffbd45] hover:underline">
          Zaloguj się
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

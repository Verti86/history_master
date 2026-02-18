"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

const NICK_REGEX = /^[a-zA-Z0-9ąćęłńóśźżĄĆĘŁŃÓŚŹŻ _\-]{1,32}$/;

export default function UstawNickPage() {
  const [nick, setNick] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const s = nick.trim();
    if (!s) {
      setError("Podaj nick.");
      return;
    }
    if (s.length > 32 || !NICK_REGEX.test(s)) {
      setError("Nick: 1–32 znaki, tylko litery, cyfry, spacja, myślnik i podkreślenie.");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }
    const { error: err } = await supabase.from("profiles").upsert({ id: user.id, nickname: s });
    setLoading(false);
    if (err) {
      setError("Nie udało się zapisać. Spróbuj ponownie.");
      return;
    }
    router.push("/menu");
    router.refresh();
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-2xl font-bold mb-6">Ustaw swój Nick</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <div>
          <label htmlFor="nick" className="block text-sm text-[#aaa] mb-1">Jak chcesz się nazywać?</label>
          <input
            id="nick"
            type="text"
            value={nick}
            onChange={(e) => setNick(e.target.value)}
            maxLength={32}
            className="w-full px-4 py-2 rounded-lg bg-[#262730] border border-[#444] text-[#fafafa] focus:border-[#ffbd45] outline-none"
          />
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-3 rounded-lg bg-[#ffbd45] text-[#0e1117] font-medium hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Zapisywanie…" : "Zapisz"}
        </button>
      </form>
      <Link href="/" className="mt-6 text-sm text-[#888] hover:text-[#aaa]">← Strona główna</Link>
    </main>
  );
}

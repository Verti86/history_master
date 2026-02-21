import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function AdminPage() {
  let stats: { activeLast7: number; quizPlays: number; flashcardPlays: number; topCategories: { id: string; count: number }[] } = {
    activeLast7: 0,
    quizPlays: 0,
    flashcardPlays: 0,
    topCategories: [],
  };
  try {
    const admin = createAdminClient();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const iso = sevenDaysAgo.toISOString();
    const { data: recent } = await admin.from("game_stats").select("user_id").gte("created_at", iso);
    const activeLast7 = new Set((recent || []).map((r) => r.user_id)).size;
    const { data: allRows } = await admin.from("game_stats").select("game_mode, category_id");
    let quizPlays = 0;
    let flashcardPlays = 0;
    const categoryCount: Record<string, number> = {};
    (allRows || []).forEach((r) => {
      const mode = (r as { game_mode?: string }).game_mode;
      const cid = (r as { category_id?: string }).category_id;
      if (mode === "Quiz") quizPlays++;
      if (mode === "Fiszki") flashcardPlays++;
      if (cid) categoryCount[cid] = (categoryCount[cid] || 0) + 1;
    });
    const topCategories = Object.entries(categoryCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([id, count]) => ({ id, count }));
    stats = { activeLast7, quizPlays, flashcardPlays, topCategories };
  } catch {
    // Brak service_role lub brak kolumny created_at
  }

  return (
    <main className="max-w-2xl">
      <section className="mb-8 p-4 rounded-xl border border-[#444] bg-[#262730]/50">
        <h2 className="font-bold mb-3">📊 Statystyki</h2>
        <ul className="text-sm text-[#aaa] space-y-1">
          <li>Aktywni użytkownicy (ostatnie 7 dni): <strong className="text-[#fafafa]">{stats.activeLast7}</strong></li>
          <li>Rozegrane quizy (łącznie): <strong className="text-[#fafafa]">{stats.quizPlays}</strong></li>
          <li>Sesje fiszek (łącznie): <strong className="text-[#fafafa]">{stats.flashcardPlays}</strong></li>
          {stats.topCategories.length > 0 && (
            <li>Najpopularniejsze działy: {stats.topCategories.map((c) => `${c.id} (${c.count})`).join(", ")}</li>
          )}
        </ul>
      </section>
      <p className="text-[#aaa] mb-6">Zarządzaj użytkownikami i moderuj czat.</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/uzytkownicy"
          className="block p-6 rounded-xl border border-[#444] bg-[#262730]/80 hover:border-[#ffbd45] transition-colors"
        >
          <span className="text-2xl block mb-2">👥</span>
          <strong className="text-[#fafafa]">Użytkownicy</strong>
          <p className="text-sm text-[#888] mt-1">
            Lista kont, nicki, statystyki XP
          </p>
        </Link>
        <Link
          href="/admin/czat"
          className="block p-6 rounded-xl border border-[#444] bg-[#262730]/80 hover:border-[#ffbd45] transition-colors"
        >
          <span className="text-2xl block mb-2">💬</span>
          <strong className="text-[#fafafa]">Moderacja czatu</strong>
          <p className="text-sm text-[#888] mt-1">
            Ostatnie wiadomości, usuń nieodpowiednie
          </p>
        </Link>
        <Link
          href="/admin/eksport"
          className="block p-6 rounded-xl border border-[#444] bg-[#262730]/80 hover:border-[#ffbd45] transition-colors"
        >
          <span className="text-2xl block mb-2">📥</span>
          <strong className="text-[#fafafa]">Eksport treści</strong>
          <p className="text-sm text-[#888] mt-1">
            Pobierz pytania quizu i oś czasu (JSON)
          </p>
        </Link>
      </div>
    </main>
  );
}

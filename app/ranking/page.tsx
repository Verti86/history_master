import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getCurrentWeekStart } from "@/lib/weekly-challenge";

const PAGE_SIZE = 20;

export default async function RankingPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(typeof params?.page === "string" ? params.page : params?.page?.[0] ?? "1", 10));

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("nickname").eq("id", user.id).single();
  if (!profile?.nickname) redirect("/ustaw-nick");

  const { data: allStats } = await supabase.from("game_stats").select("user_id, points, created_at");
  const { data: profiles } = await supabase.from("profiles").select("id, nickname");
  const nicks: Record<string, string> = {};
  (profiles || []).forEach((p) => {
    nicks[p.id] = p.nickname?.trim() || `Gracz_${p.id.slice(0, 8)}`;
  });
  const weekStart = getCurrentWeekStart();
  const scoresAll: Record<string, number> = {};
  const scoresWeek: Record<string, number> = {};
  (allStats || []).forEach((r) => {
    const name = nicks[r.user_id] || `Gracz_${r.user_id?.slice(0, 8)}`;
    const pts = r.points || 0;
    scoresAll[name] = (scoresAll[name] || 0) + pts;
    const created = (r as { created_at?: string }).created_at;
    if (created && created.slice(0, 10) >= weekStart) scoresWeek[name] = (scoresWeek[name] || 0) + pts;
  });

  const rankingAll = Object.entries(scoresAll).sort((a, b) => b[1] - a[1]);
  const rankingWeek = Object.entries(scoresWeek).sort((a, b) => b[1] - a[1]);
  const totalAll = rankingAll.length;
  const totalWeek = rankingWeek.length;

  const tab = params?.tab === "week" ? "week" : "all";
  const list = tab === "week" ? rankingWeek : rankingAll;
  const total = tab === "week" ? totalWeek : totalAll;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageList = list.slice(start, start + PAGE_SIZE);

  return (
    <main className="min-h-screen p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🏆 Pełny ranking</h1>
      <div className="flex gap-2 mb-4">
        <Link
          href="/ranking?tab=all"
          className={`px-3 py-1.5 rounded-lg text-sm font-medium ${params?.tab !== "week" ? "bg-[#ffbd45] text-[#0e1117]" : ""}`}
          style={params?.tab === "week" ? { backgroundColor: "var(--hm-tab-inactive-bg)", color: "var(--hm-tab-inactive-text)" } : undefined}
        >
          Cały czas ({totalAll})
        </Link>
        <Link
          href="/ranking?tab=week"
          className={`px-3 py-1.5 rounded-lg text-sm font-medium ${params?.tab === "week" ? "bg-[#ffbd45] text-[#0e1117]" : ""}`}
          style={params?.tab !== "week" ? { backgroundColor: "var(--hm-tab-inactive-bg)", color: "var(--hm-tab-inactive-text)" } : undefined}
        >
          Ten tydzień ({totalWeek})
        </Link>
      </div>
      <ul className="space-y-2 mb-6">
        {pageList.map(([name, pts], i) => (
          <li key={`rank-${tab}-${start + i}`} className="flex justify-between items-center py-2 border-b border-[var(--hm-border)]">
            <span><strong>{start + i + 1}.</strong> {name}</span>
            <strong className="text-[#ffbd45]">{pts}</strong>
          </li>
        ))}
      </ul>
      {totalPages > 1 && (
        <nav className="flex flex-wrap gap-2 justify-center mb-6" aria-label="Paginacja">
          {currentPage > 1 && (
            <Link href={`/ranking?tab=${params?.tab ?? "all"}&page=${currentPage - 1}`} className="px-4 py-2 rounded-lg border border-[var(--hm-border)] text-sm hover:border-[#ffbd45]">
              ← Poprzednia
            </Link>
          )}
          <span className="px-4 py-2 text-sm text-[var(--hm-muted)]">
            Strona {currentPage} / {totalPages}
          </span>
          {currentPage < totalPages && (
            <Link href={`/ranking?tab=${params?.tab ?? "all"}&page=${currentPage + 1}`} className="px-4 py-2 rounded-lg border border-[var(--hm-border)] text-sm hover:border-[#ffbd45]">
              Następna →
            </Link>
          )}
        </nav>
      )}
      <p className="text-center">
        <Link href="/menu" className="text-sm text-[#ffbd45] hover:underline">← Powrót do menu</Link>
      </p>
    </main>
  );
}

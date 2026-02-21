import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/admin";
import { getLevelForXp } from "@/lib/levels";
import { ACHIEVEMENTS } from "@/lib/achievements";
import { computeStreak } from "@/lib/streak";
import { getCurrentWeekChallenge, getCurrentWeekStart } from "@/lib/weekly-challenge";
import MenuRanking from "./MenuRanking";

export default async function MenuPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const admin = isAdmin(user);

  const { data: profile } = await supabase
    .from("profiles")
    .select("nickname")
    .eq("id", user.id)
    .single();

  const nick = profile?.nickname?.trim() || null;
  if (!nick) redirect("/ustaw-nick");

  const { data: stats } = await supabase
    .from("game_stats")
    .select("points, game_mode, category_id, created_at")
    .eq("user_id", user.id);
  const totalXp = (stats || []).reduce((s, r) => s + (r.points || 0), 0);
  const level = getLevelForXp(totalXp);
  const activityDates = (stats || [])
    .map((r) => (r as { created_at?: string }).created_at)
    .filter(Boolean)
    .map((c) => (c as string).slice(0, 10));
  const streak = computeStreak(activityDates);
  const quizCount = (stats || []).filter((r) => (r as { game_mode?: string }).game_mode === "Quiz").length;
  const flashcardCount = (stats || []).filter((r) => (r as { game_mode?: string }).game_mode === "Fiszki").reduce((s, r) => s + (r.points || 0), 0);
  const categoryIds = new Set((stats || []).map((r) => (r as { category_id?: string }).category_id).filter(Boolean) as string[]);
  const weekStart = getCurrentWeekStart();
  const weekXp = (stats || []).reduce((s, r) => {
    const created = (r as { created_at?: string }).created_at;
    if (!created || created.slice(0, 10) < weekStart) return s;
    return s + (r.points || 0);
  }, 0);
  const weekChallenge = getCurrentWeekChallenge();

  const { data: unlocked } = await supabase.from("user_achievements").select("achievement_id").eq("user_id", user.id);
  const unlockedIds = new Set((unlocked || []).map((u) => u.achievement_id));
  for (const a of ACHIEVEMENTS) {
    if (a.check(totalXp, { quizCount, flashcardCount, categoryIds }) && !unlockedIds.has(a.id)) {
      await supabase.from("user_achievements").upsert({ user_id: user.id, achievement_id: a.id }, { onConflict: "user_id,achievement_id" });
      unlockedIds.add(a.id);
    }
  }
  const achievementCount = unlockedIds.size;

  const { data: allStats } = await supabase.from("game_stats").select("user_id, points, created_at");
  const { data: profiles } = await supabase.from("profiles").select("id, nickname");
  const nicks: Record<string, string> = {};
  (profiles || []).forEach((p) => { nicks[p.id] = p.nickname || `Gracz_${p.id.slice(0, 8)}`; });
  const scoresAll: Record<string, number> = {};
  const scoresWeek: Record<string, number> = {};
  (allStats || []).forEach((r) => {
    const name = nicks[r.user_id] || `Gracz_${r.user_id?.slice(0, 8)}`;
    const pts = r.points || 0;
    scoresAll[name] = (scoresAll[name] || 0) + pts;
    const created = (r as { created_at?: string }).created_at;
    if (created && created.slice(0, 10) >= weekStart) scoresWeek[name] = (scoresWeek[name] || 0) + pts;
  });
  const rankingAll = Object.entries(scoresAll).sort((a, b) => b[1] - a[1]).slice(0, 10);
  const rankingWeek = Object.entries(scoresWeek).sort((a, b) => b[1] - a[1]).slice(0, 10);

  return (
    <main className="min-h-screen p-8 max-w-2xl mx-auto">
      <header className="mb-8">
        <h1 className="text-2xl font-bold">🛡️ History Master Online</h1>
      </header>
      <p className="text-[var(--hm-text)] mb-2">Witaj, <strong>{nick}</strong>! ⚔️</p>
      <p className="mb-1">Twoje XP: <strong className="text-[#ffbd45]">{totalXp}</strong></p>
      <p className="mb-1">{level.icon} Poziom: <strong>{level.name}</strong></p>
      {level.nextLevelAt != null && (
        <div className="mb-2 w-full max-w-xs h-2 rounded-full overflow-hidden" style={{ backgroundColor: "var(--hm-progress-track)" }}>
          <div className="h-full bg-[#ffbd45] transition-all" style={{ width: `${level.progress * 100}%` }} />
        </div>
      )}
      {streak > 0 && <p className="mb-4 text-amber-400">🔥 {streak} {streak === 1 ? "dzień" : "dni"} z rzędu</p>}
      <p className="mb-2 text-sm text-[var(--hm-muted)]">Odznaki: {achievementCount}/{ACHIEVEMENTS.length}</p>
      <section className="border border-[var(--hm-border)] rounded-xl p-3 mb-6">
        <h3 className="font-bold text-sm mb-2">🎯 {weekChallenge.title}</h3>
        <p className="text-sm text-[var(--hm-muted)] mb-2">{weekChallenge.description}</p>
        <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: "var(--hm-progress-track)" }}>
          <div className="h-full bg-emerald-500 transition-all" style={{ width: `${Math.min(1, weekXp / weekChallenge.targetXp) * 100}%` }} />
        </div>
        <p className="text-xs mt-1">{weekXp} / {weekChallenge.targetXp} XP</p>
      </section>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <Link
          href="/quiz"
          className="menu-card menu-card-quiz p-4 rounded-xl bg-gradient-to-br from-[#262730] to-[#1a1a24] border border-[#444] hover:border-[#ffbd45] hover:shadow-lg hover:shadow-yellow-500/20 text-center transition-all duration-300 group"
        >
          <span className="menu-icon text-2xl inline-block mb-1">📝</span>
          <span className="block font-medium">Quiz</span>
        </Link>
        <Link
          href="/fiszki"
          className="menu-card menu-card-fiszki p-4 rounded-xl bg-gradient-to-br from-[#262730] to-[#1a1a24] border border-[#444] hover:border-[#60a5fa] hover:shadow-lg hover:shadow-blue-500/20 text-center transition-all duration-300 group"
        >
          <span className="menu-icon text-2xl inline-block mb-1">🧠</span>
          <span className="block font-medium">Fiszki</span>
        </Link>
        <Link
          href="/os-czasu"
          className="menu-card menu-card-czas p-4 rounded-xl bg-gradient-to-br from-[#262730] to-[#1a1a24] border border-[#444] hover:border-[#a78bfa] hover:shadow-lg hover:shadow-purple-500/20 text-center transition-all duration-300 group"
        >
          <span className="menu-icon text-2xl inline-block mb-1">⏳</span>
          <span className="block font-medium">Oś czasu</span>
        </Link>
        <Link
          href="/skojarzenia"
          className="menu-card menu-card-skojarzenia p-4 rounded-xl bg-gradient-to-br from-[#262730] to-[#1a1a24] border border-[#444] hover:border-[#34d399] hover:shadow-lg hover:shadow-green-500/20 text-center transition-all duration-300 group"
        >
          <span className="menu-icon text-2xl inline-block mb-1">🕵️</span>
          <span className="block font-medium">Skojarzenia</span>
        </Link>
      </div>

      <section className="border border-[var(--hm-border)] rounded-xl p-4">
        <h2 className="font-bold mb-3">🏆 Ranking Top 10</h2>
        <MenuRanking all={rankingAll} week={rankingWeek} />
      </section>

      {admin && (
        <p className="mt-6 text-center">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors hover:border-[#ffbd45]"
            style={{ borderColor: "var(--hm-link-secondary-border)", backgroundColor: "var(--hm-link-secondary-bg)", color: "var(--hm-link-secondary-text)" }}
          >
            ⚙️ Panel administracyjny
          </Link>
        </p>
      )}

      <nav className="mt-8 flex flex-wrap items-center justify-center gap-3" aria-label="Nawigacja">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors hover:border-[#ffbd45]"
          style={{ borderColor: "var(--hm-link-secondary-border)", backgroundColor: "var(--hm-link-secondary-bg)", color: "var(--hm-link-secondary-text)" }}
        >
          <span aria-hidden>←</span>
          Strona główna
        </Link>
        <form action="/auth/signout" method="post" className="inline">
          <button
            type="submit"
            className="hm-btn-logout inline-flex items-center gap-2 rounded-xl border border-[var(--hm-border)] px-4 py-2.5 text-sm font-medium transition-colors hover:border-red-500/60 hover:bg-red-500/10 hover:text-red-400"
            style={{ backgroundColor: "var(--hm-btn-secondary-bg)", color: "var(--hm-btn-secondary-text)" }}
          >
            Wyloguj
          </button>
        </form>
      </nav>
    </main>
  );
}

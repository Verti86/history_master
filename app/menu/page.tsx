import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function MenuPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("nickname")
    .eq("id", user.id)
    .single();

  const nick = profile?.nickname?.trim() || null;
  if (!nick) redirect("/ustaw-nick");

  const { data: stats } = await supabase
    .from("game_stats")
    .select("points")
    .eq("user_id", user.id);
  const totalXp = (stats || []).reduce((s, r) => s + (r.points || 0), 0);

  const { data: allStats } = await supabase.from("game_stats").select("user_id, points");
  const { data: profiles } = await supabase.from("profiles").select("id, nickname");
  const nicks: Record<string, string> = {};
  (profiles || []).forEach((p) => { nicks[p.id] = p.nickname || `Gracz_${p.id.slice(0, 8)}`; });
  const scores: Record<string, number> = {};
  (allStats || []).forEach((r) => {
    const name = nicks[r.user_id] || `Gracz_${r.user_id?.slice(0, 8)}`;
    scores[name] = (scores[name] || 0) + (r.points || 0);
  });
  const ranking = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  return (
    <main className="min-h-screen p-8 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">🛡️ History Master Online</h1>
        <form action="/auth/signout" method="post">
          <button type="submit" className="text-sm text-[#888] hover:text-[#fafafa]">
            Wyloguj
          </button>
        </form>
      </div>
      <p className="text-[#aaa] mb-6">Witaj, <strong className="text-[#fafafa]">{nick}</strong>! ⚔️</p>
      <p className="mb-6">Twoje XP: <strong className="text-[#ffbd45]">{totalXp}</strong></p>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <Link
          href="/quiz"
          className="p-4 rounded-xl bg-[#262730] border border-[#444] hover:border-[#ffbd45] text-center transition"
        >
          📝 Quiz
        </Link>
        <Link
          href="/fiszki"
          className="p-4 rounded-xl bg-[#262730] border border-[#444] hover:border-[#ffbd45] text-center transition"
        >
          🧠 Fiszki
        </Link>
        <Link
          href="/os-czasu"
          className="p-4 rounded-xl bg-[#262730] border border-[#444] hover:border-[#ffbd45] text-center transition"
        >
          ⏳ Oś czasu
        </Link>
        <Link
          href="/skojarzenia"
          className="p-4 rounded-xl bg-[#262730] border border-[#444] hover:border-[#ffbd45] text-center transition"
        >
          🕵️ Skojarzenia
        </Link>
      </div>

      <section className="border border-[#444] rounded-xl p-4">
        <h2 className="font-bold mb-3">🏆 Ranking Top 10</h2>
        <ul className="space-y-1 text-sm">
          {ranking.map(([name, pts], i) => (
            <li key={name}>
              {i + 1}. {name}: <strong>{pts}</strong>
            </li>
          ))}
          {ranking.length === 0 && <li className="text-[#888]">Brak wyników.</li>}
        </ul>
      </section>

      <p className="mt-6 text-center">
        <Link href="/" className="text-sm text-[#888] hover:text-[#ffbd45]">← Strona główna</Link>
      </p>
    </main>
  );
}

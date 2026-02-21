import { createClient } from "@/lib/supabase/server";

export default async function AdminUzytkownicyPage() {
  const supabase = await createClient();
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, nickname")
    .order("nickname");
  const { data: stats } = await supabase
    .from("game_stats")
    .select("user_id, points");

  const xpByUser: Record<string, number> = {};
  (stats || []).forEach((r) => {
    const id = r.user_id ?? "";
    xpByUser[id] = (xpByUser[id] || 0) + (r.points || 0);
  });

  const rows = (profiles || []).map((p) => ({
    id: p.id,
    nickname: p.nickname?.trim() || `(brak nicka)`,
    xp: xpByUser[p.id] ?? 0,
  })).sort((a, b) => b.xp - a.xp);

  return (
    <main>
      <h2 className="text-lg font-bold mb-4">👥 Użytkownicy</h2>
      <p className="text-sm text-[#888] mb-6">
        Lista kont (nick, łączne XP). Zarządzanie kontem (np. blokada) odbywa się w Supabase Dashboard → Authentication → Users.
      </p>
      <div className="overflow-x-auto rounded-xl border border-[#444]">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[#444] bg-[#262730]/80">
              <th className="p-3 font-medium text-[#aaa]">Nick</th>
              <th className="p-3 font-medium text-[#aaa]">XP</th>
              <th className="p-3 font-medium text-[#aaa]">ID (fragment)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-[#333]">
                <td className="p-3">{r.nickname}</td>
                <td className="p-3 font-medium text-[#ffbd45]">{r.xp}</td>
                <td className="p-3 text-[#666] font-mono text-xs">{r.id.slice(0, 8)}…</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {rows.length === 0 && (
        <p className="text-[#888] mt-4">Brak użytkowników w bazie.</p>
      )}
    </main>
  );
}

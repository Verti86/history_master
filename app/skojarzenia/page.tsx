import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AssociationsGame from "./AssociationsGame";
import { getAssociations } from "@/lib/game-data";
import { parseGradeFromSearchParams } from "@/lib/grades";
import { GRADES } from "@/lib/grades";

export default async function SkojarzeniePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const klasa = parseGradeFromSearchParams(params);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("nickname")
    .eq("id", user.id)
    .single();

  if (!profile?.nickname) {
    redirect("/ustaw-nick");
  }

  const associations = getAssociations(klasa);

  if (associations.length === 0) {
    return (
      <main className="min-h-screen p-8 max-w-2xl mx-auto flex flex-col items-center justify-center">
        <h1 className="text-xl font-bold mb-4">🕵️ Skojarzenia</h1>
        <p className="text-[var(--hm-muted)] mb-6 text-center">
          Brak skojarzeń dla klasy {klasa}. Wybierz inną klasę w menu.
        </p>
        <p className="text-sm text-[var(--hm-muted)] mb-4">Zakres: klasa</p>
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {GRADES.map((g) => (
            <Link
              key={g.value}
              href={`/skojarzenia?klasa=${g.value}`}
              className={`px-4 py-2 rounded-xl border text-sm font-medium ${
                klasa === g.value ? "border-[#ffbd45] bg-amber-500/20 text-[#ffbd45]" : "border-[var(--hm-border)] hover:border-[#34d399]/60"
              }`}
              style={klasa !== g.value ? { backgroundColor: "var(--hm-menu-card-bg)", color: "var(--hm-menu-card-text)" } : undefined}
            >
              {g.short}
            </Link>
          ))}
        </div>
        <Link href="/menu" className="text-[#ffbd45] hover:underline">← Powrót do menu</Link>
      </main>
    );
  }

  return (
    <>
      <div className="max-w-2xl mx-auto px-4 pt-4 pb-2 flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm text-[var(--hm-muted)]">Zakres: klasa {klasa}</span>
        <div className="flex gap-2">
          {GRADES.map((g) => (
            <Link
              key={g.value}
              href={`/skojarzenia?klasa=${g.value}`}
              className={`px-3 py-1 rounded-lg text-sm ${klasa === g.value ? "bg-[#34d399]/30 text-[#34d399]" : "text-[var(--hm-muted)] hover:underline"}`}
            >
              {g.short}
            </Link>
          ))}
        </div>
      </div>
      <AssociationsGame associations={associations} userId={user.id} backHref={`/menu?klasa=${klasa}`} />
    </>
  );
}

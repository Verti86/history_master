import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import QuotesGame from "./QuotesGame";
import { getQuotes } from "@/lib/game-data";
import { parseGradeFromSearchParams } from "@/lib/grades";
import { GRADES } from "@/lib/grades";

export default async function KtoPowiedzialPage({
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

  const quotes = getQuotes(klasa);

  if (quotes.length === 0) {
    return (
      <main className="min-h-screen p-8 max-w-2xl mx-auto flex flex-col items-center justify-center">
        <h1 className="text-xl font-bold mb-4">💬 Kto to powiedział?</h1>
        <p className="text-[var(--hm-muted)] mb-6 text-center">
          Brak cytatów dla klasy {klasa}. Wybierz inną klasę w menu.
        </p>
        <p className="text-sm text-[var(--hm-muted)] mb-4">Zakres: klasa</p>
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {GRADES.map((g) => (
            <Link
              key={g.value}
              href={`/kto-powiedzial?klasa=${g.value}`}
              className={`px-4 py-2 rounded-xl border text-sm font-medium ${
                klasa === g.value ? "border-[#f59e0b] bg-amber-500/20 text-[#f59e0b]" : "border-[var(--hm-border)] hover:border-[#f59e0b]/60"
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
              href={`/kto-powiedzial?klasa=${g.value}`}
              className={`px-3 py-1 rounded-lg text-sm ${klasa === g.value ? "bg-[#f59e0b]/30 text-[#f59e0b]" : "text-[var(--hm-muted)] hover:underline"}`}
            >
              {g.short}
            </Link>
          ))}
        </div>
      </div>
      <QuotesGame quotes={quotes} userId={user.id} backHref={`/menu?klasa=${klasa}`} />
    </>
  );
}

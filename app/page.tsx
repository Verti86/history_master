import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect("/menu");

  return (
    <main className="min-h-screen flex flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-2 mt-4">🛡️ History Master Online</h1>
      <p className="text-[#aaa] mb-6 text-center max-w-md">
        Quiz, fiszki i oś czasu z historii – zgodne z podstawą programową dla klas 4–8 SP
      </p>
      <div className="flex gap-4 mb-10">
        <Link
          href="/login"
          className="px-6 py-3 rounded-lg bg-[#ffbd45] text-[#0e1117] font-medium hover:opacity-90"
        >
          Zaloguj się
        </Link>
        <Link
          href="/rejestracja"
          className="px-6 py-3 rounded-lg border border-[#444] text-[#fafafa] hover:bg-[#262730]"
        >
          Rejestracja
        </Link>
      </div>

      <section className="max-w-xl text-center text-[#aaa] text-sm space-y-3 mb-10">
        <h2 className="text-[#e0e0e0] font-semibold text-base">Dla kogo jest ta aplikacja?</h2>
        <p>
          <strong className="text-[#fafafa]">History Master Online</strong> to darmowa aplikacja do nauki historii dla uczniów <strong className="text-[#fafafa]">klas 4–8 szkoły podstawowej</strong>. 
          Zawiera quizy z historii Polski i świata, fiszki, oś czasu oraz skojarzenia – wszystko zgodne z podstawą programową. 
          Wybierz klasę (4–8), by uczyć się tylko swojego zakresu. Idealna do powtórek przed sprawdzianem, na lekcję lub w domu.
        </p>
        <p>
          Tematy: od początków Polski (kl. 4) i średniowiecza (kl. 5), przez czasy nowożytne i RON (kl. 6), wiek XIX (kl. 7), po XX wiek i odzyskanie wolności (kl. 8).
        </p>
      </section>

      <p className="text-sm text-[#888]">
        Ta sama baza Supabase co aplikacja Python. Logowanie i ranking współdzielone.
      </p>
    </main>
  );
}

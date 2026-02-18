import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect("/menu");

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold mb-2">🛡️ History Master Online</h1>
      <p className="text-[#aaa] mb-8 text-center max-w-md">
        Quiz, fiszki i oś czasu z historii – zgodne z podstawą programową dla klasy 6 SP
      </p>
      <div className="flex gap-4">
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
      <p className="mt-8 text-sm text-[#888]">
        Ta sama baza Supabase co aplikacja Python. Logowanie i ranking współdzielone.
      </p>
    </main>
  );
}

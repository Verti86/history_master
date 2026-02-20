import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

const CATEGORIES = [
  { id: "zloty-wiek", name: "Złoty wiek w Polsce", icon: "👑" },
  { id: "odkrycia", name: "Wielkie odkrycia geograficzne", icon: "🌍" },
  { id: "oswiecenie", name: "Oświecenie", icon: "💡" },
  { id: "bitwy", name: "Bitwy XVII wieku", icon: "⚔️" },
  { id: "reformacja", name: "Reformacja", icon: "📜" },
  { id: "wszystkie", name: "Wszystkie tematy", icon: "📚" },
];

export default async function FiszkiPage() {
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

  return (
    <main className="min-h-screen bg-gray-900 text-white p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">🧠 Fiszki</h1>
      <p className="text-gray-400 mb-6">Wybierz temat do nauki:</p>

      <div className="grid gap-3">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.id}
            href={`/fiszki/${cat.id}`}
            className="p-4 rounded-xl bg-gray-800 border border-gray-700 hover:border-blue-500 transition flex items-center gap-3"
          >
            <span className="text-2xl">{cat.icon}</span>
            <span className="font-medium">{cat.name}</span>
          </Link>
        ))}
      </div>

      <p className="mt-8 text-center">
        <Link href="/menu" className="text-gray-400 hover:text-white text-sm">
          ← Powrót do menu
        </Link>
      </p>
    </main>
  );
}

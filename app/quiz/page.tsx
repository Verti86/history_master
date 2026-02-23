import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import CategoryPicker from "@/components/CategoryPicker";
import { getCategoriesByGrade } from "@/lib/categories";
import { parseGradeFromSearchParams } from "@/lib/grades";

const LIMIT_OPTIONS = [10, 20, 0] as const; // 0 = wszystkie

function parseLimit(params: Record<string, string | string[] | undefined>): number {
  const l = params?.limit;
  if (l == null) return 10;
  const v = typeof l === "string" ? l : l[0];
  if (v === "wszystkie") return 0;
  const n = parseInt(v ?? "", 10);
  return LIMIT_OPTIONS.includes(n as 10 | 20 | 0) ? n : 10;
}

export default async function QuizPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const klasa = parseGradeFromSearchParams(params);
  const limit = parseLimit(params);
  const categories = getCategoriesByGrade(klasa);
  const q = `klasa=${klasa}&limit=${limit === 0 ? "wszystkie" : limit}`;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("nickname")
    .eq("id", user.id)
    .single();
  if (!profile?.nickname) redirect("/ustaw-nick");

  const { data: quizStats } = await supabase
    .from("game_stats")
    .select("category_id, points")
    .eq("user_id", user.id)
    .eq("game_mode", "Quiz")
    .not("category_id", "is", null)
    .order("created_at", { ascending: false });
  const lastByCategory: Record<string, number> = {};
  (quizStats || []).forEach((r) => {
    const cid = (r as { category_id?: string }).category_id;
    if (cid && lastByCategory[cid] == null) lastByCategory[cid] = r.points ?? 0;
  });
  const progress = Object.entries(lastByCategory).map(([categoryId, points]) => ({ categoryId, text: `Ostatni: ${points} pkt` }));

  return (
    <CategoryPicker
      baseUrl="/quiz"
      title="📝 Quiz"
      subtitle="Wybierz temat quizu:"
      categories={categories}
      categoryCount={categories.length}
      queryParams={q}
      extraLink={{ href: `/quiz/slabostrony?${q}`, label: "Powtórka słabych stron" }}
      progress={progress}
      extraTop={
        <p className="text-sm text-[var(--hm-muted)] mb-4">
          Liczba pytań:{" "}
          {([10, 20, 0] as const).map((n) => (
            <span key={n}>
              <Link
                href={`/quiz?klasa=${klasa}&limit=${n === 0 ? "wszystkie" : n}`}
                className={limit === n ? "font-medium text-[#ffbd45]" : "hover:underline"}
              >
                {n === 0 ? "Wszystkie" : n}
              </Link>
              {n !== 0 ? " | " : ""}
            </span>
          ))}
        </p>
      }
    />
  );
}

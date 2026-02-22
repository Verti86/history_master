import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import CategoryPicker from "@/components/CategoryPicker";
import { getCategoriesByGrade } from "@/lib/categories";
import { parseGradeFromSearchParams } from "@/lib/grades";

export default async function QuizPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const klasa = parseGradeFromSearchParams(params);
  const categories = getCategoriesByGrade(klasa);
  const q = `klasa=${klasa}`;

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
    />
  );
}

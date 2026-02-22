import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import CategoryPicker from "@/components/CategoryPicker";
import { getCategoriesByGrade } from "@/lib/categories";
import { parseGradeFromSearchParams } from "@/lib/grades";

export default async function FiszkiPage({
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

  return (
    <CategoryPicker
      baseUrl="/fiszki"
      title="🧠 Fiszki"
      subtitle="Wybierz temat do nauki:"
      categories={categories}
      categoryCount={categories.length}
      queryParams={q}
    />
  );
}

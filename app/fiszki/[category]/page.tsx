import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import FlashcardsGame from "./FlashcardsGame";
import { getFlashcardsForCategory, getFlashcardsForGrade } from "@/lib/quiz-loader";
import { getCategoryById } from "@/lib/categories";
import { parseGradeFromSearchParams } from "@/lib/grades";

export default async function FiszkiCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { category } = await params;
  const klasa = parseGradeFromSearchParams(await searchParams);
  const backHref = `/fiszki?klasa=${klasa}`;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("nickname")
    .eq("id", user.id)
    .single();
  if (!profile?.nickname) redirect("/ustaw-nick");

  const categoryInfo = getCategoryById(category, klasa);
  if (!categoryInfo) redirect(backHref);

  const flashcards = category === "wszystkie"
    ? getFlashcardsForGrade(klasa)
    : getFlashcardsForCategory(category);
  if (flashcards.length === 0) redirect(backHref);

  return (
    <FlashcardsGame
      flashcards={flashcards}
      userId={user.id}
      categoryName={categoryInfo.name}
      categoryId={category}
      backHref={backHref}
    />
  );
}

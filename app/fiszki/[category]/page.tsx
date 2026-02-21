import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import FlashcardsGame from "./FlashcardsGame";
import { getFlashcardsForCategory } from "@/lib/quiz-loader";
import { getCategoryById } from "@/lib/categories";

export default async function FiszkiCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("nickname")
    .eq("id", user.id)
    .single();
  if (!profile?.nickname) redirect("/ustaw-nick");

  const categoryInfo = getCategoryById(category);
  if (!categoryInfo) redirect("/fiszki");

  const flashcards = getFlashcardsForCategory(category);
  if (flashcards.length === 0) redirect("/fiszki");

  return <FlashcardsGame flashcards={flashcards} userId={user.id} categoryName={categoryInfo.name} categoryId={category} />;
}

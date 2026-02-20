import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import FlashcardsGame from "./FlashcardsGame";
import { getQuizQuestions } from "@/lib/quiz-data";

const CATEGORY_MAP: Record<string, string> = {
  "zloty-wiek": "Zloty wiek w Polsce",
  "odkrycia": "Wielkie odkrycia geograficzne",
  "oswiecenie": "Oswiecenie",
  "bitwy": "Bitwy XVII wieku",
  "reformacja": "Reformacja",
  "wszystkie": "",
};

export default async function FiszkiCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  
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

  const allQuestions = getQuizQuestions();
  const categoryFilter = CATEGORY_MAP[category];
  
  const questions = categoryFilter === ""
    ? allQuestions
    : allQuestions.filter((q) => q.category === categoryFilter);

  if (questions.length === 0) {
    redirect("/fiszki");
  }

  const flashcards = questions.map((q) => ({
    question: q.question,
    answer: q.answers[q.correct_index],
    explanation: q.explanation,
  }));

  return <FlashcardsGame flashcards={flashcards} userId={user.id} categoryName={category} />;
}

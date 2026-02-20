import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import FlashcardsGame from "./FlashcardsGame";
import { loadQuizQuestions } from "@/lib/quiz-data";

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

  const questions = loadQuizQuestions();
  const flashcards = questions.map((q) => ({
    question: q.question,
    answer: q.correct,
  }));

  return <FlashcardsGame flashcards={flashcards} userId={user.id} />;
}

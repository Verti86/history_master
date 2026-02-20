import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getQuizQuestions } from "@/lib/quiz-data";
import QuizGame from "./QuizGame";

export default async function QuizPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("nick").eq("id", user.id).single();
  if (!profile?.nick?.trim()) redirect("/ustaw-nick");

  const questions = getQuizQuestions();
  if (questions.length === 0) redirect("/menu");

  return (
    <main className="min-h-screen p-8 max-w-2xl mx-auto">
      <QuizGame questions={questions} userId={user.id} />
    </main>
  );
}

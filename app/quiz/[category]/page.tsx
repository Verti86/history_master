import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import QuizGame from "./QuizGame";
import { getQuestionsForCategory, getWeakQuestions } from "@/lib/quiz-loader";
import { getCategoryById } from "@/lib/categories";

export default async function QuizCategoryPage({
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

  if (category === "slabostrony") {
    const { data: wrong } = await supabase.from("quiz_wrong_answers").select("category_id, question_text").eq("user_id", user.id);
    const wrongEntries = (wrong || []).map((r) => ({ category_id: r.category_id, question_text: r.question_text }));
    const questions = getWeakQuestions(wrongEntries);
    if (questions.length === 0) {
      return (
        <main className="min-h-screen p-8 max-w-2xl mx-auto">
          <p className="text-[var(--hm-muted)] mb-4">Nie masz jeszcze zapisanych pomyłek. Rozwiązuj quizy – tutaj pojawią się pytania do powtórki.</p>
          <Link href="/quiz" className="text-[#ffbd45] hover:underline">← Wybierz temat quizu</Link>
        </main>
      );
    }
    return (
      <main className="min-h-screen p-8 max-w-2xl mx-auto">
        <QuizGame
          questions={questions}
          userId={user.id}
          categoryName="Powtórka słabych stron"
          categoryId="wszystkie"
        />
      </main>
    );
  }

  const categoryInfo = getCategoryById(category);
  if (!categoryInfo) redirect("/quiz");

  const questions = getQuestionsForCategory(category);
  if (questions.length === 0) redirect("/quiz");

  return (
    <main className="min-h-screen p-8 max-w-2xl mx-auto">
      <QuizGame
        questions={questions}
        userId={user.id}
        categoryName={categoryInfo.name}
        categoryId={category}
      />
    </main>
  );
}

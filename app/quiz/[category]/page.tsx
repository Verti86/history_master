import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import QuizGame from "./QuizGame";
import { getQuestionsForCategory, getWeakQuestions, getAllQuestionsForGrade } from "@/lib/quiz-loader";
import { getCategoryById } from "@/lib/categories";
import { parseGradeFromSearchParams } from "@/lib/grades";

export default async function QuizCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { category } = await params;
  const klasa = parseGradeFromSearchParams(await searchParams);
  const backHref = `/quiz?klasa=${klasa}`;

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
          <Link href={backHref} className="text-[#ffbd45] hover:underline">← Wybierz temat quizu</Link>
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
          backHref={backHref}
        />
      </main>
    );
  }

  const categoryInfo = getCategoryById(category, klasa);
  if (!categoryInfo) redirect(backHref);

  const questions = category === "wszystkie"
    ? getAllQuestionsForGrade(klasa)
    : getQuestionsForCategory(category);
  if (questions.length === 0) redirect(backHref);

  return (
    <main className="min-h-screen p-8 max-w-2xl mx-auto">
      <QuizGame
        questions={questions}
        userId={user.id}
        categoryName={categoryInfo.name}
        categoryId={category}
        backHref={backHref}
      />
    </main>
  );
}

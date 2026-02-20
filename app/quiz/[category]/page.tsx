import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import QuizGame from "./QuizGame";
import { getQuestionsForCategory } from "@/lib/quiz-loader";
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
      />
    </main>
  );
}

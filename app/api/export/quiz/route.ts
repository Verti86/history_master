import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/admin";
import { getAllQuestions } from "@/lib/quiz-loader";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdmin(user)) {
    return NextResponse.json({ error: "Brak uprawnień" }, { status: 403 });
  }
  const questions = getAllQuestions();
  return new NextResponse(JSON.stringify(questions, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": "attachment; filename=quiz-wszystkie.json",
    },
  });
}

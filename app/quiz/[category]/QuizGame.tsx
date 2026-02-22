"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { QuizQuestion } from "@/lib/quiz-loader";
import { XpToast } from "@/components/XpToast";

const QUESTIONS_PER_ROUND = 10;

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

type Props = {
  questions: QuizQuestion[];
  userId: string;
  categoryName: string;
  categoryId: string;
  /** Link powrotu do wyboru tematu (np. /quiz?klasa=6) */
  backHref?: string;
};

export default function QuizGame({ questions, userId, categoryName, categoryId, backHref = "/quiz" }: Props) {
  const [order] = useState(() => shuffle(questions).slice(0, QUESTIONS_PER_ROUND));
  const [answerOrders] = useState(() => order.map(() => shuffle([0, 1, 2, 3])));
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<"ok" | "wrong" | null>(null);
  const [saved, setSaved] = useState(false);
  const [showXpToast, setShowXpToast] = useState(false);
  const savingRef = useRef(false);

  const current = order[index];
  const total = order.length;
  const finished = index >= total;

  useEffect(() => {
    if (finished && !saved && !savingRef.current) {
      savingRef.current = true;
      saveScore(score).then(() => {
        setSaved(true);
        setShowXpToast(true);
      });
    }
  }, [finished, saved, score]);

  const answers = useMemo(() => {
    if (!current || !answerOrders[index]) return [];
    return answerOrders[index].map((i) => current.answers[i]);
  }, [current, answerOrders, index]);

  async function saveWrongAnswer(questionText: string) {
    const supabase = createClient();
    const { data: row } = await supabase.from("quiz_wrong_answers").select("id, times_wrong").eq("user_id", userId).eq("category_id", categoryId).eq("question_text", questionText).maybeSingle();
    const now = new Date().toISOString();
    if (row?.id) {
      await supabase.from("quiz_wrong_answers").update({ times_wrong: (row.times_wrong ?? 1) + 1, last_wrong_at: now }).eq("id", row.id);
    } else {
      await supabase.from("quiz_wrong_answers").insert({
        user_id: userId,
        category_id: categoryId,
        question_text: questionText,
        times_wrong: 1,
        last_wrong_at: now,
      });
    }
  }

  async function handleAnswer(ans: string) {
    if (feedback !== null) return;
    const correct = current.answers[current.correct_index];
    if (ans === correct) {
      setFeedback("ok");
      setScore((s) => s + 1);
    } else {
      setFeedback("wrong");
      saveWrongAnswer(current.question);
    }
  }

  async function saveScore(finalScore: number) {
    const supabase = createClient();
    await supabase.from("game_stats").insert({
      user_id: userId,
      game_mode: "Quiz",
      points: finalScore,
      category_id: categoryId,
    });
  }

  function nextQuestion() {
    setFeedback(null);
    setIndex((i) => i + 1);
  }

  if (finished) {
    return (
      <div className="space-y-6">
        <XpToast xp={score} show={showXpToast} onDone={() => setShowXpToast(false)} />
        <h1 className="text-2xl font-bold" style={{ color: "var(--hm-text)" }}>🎉 Koniec quizu!</h1>
        <p className="text-xl" style={{ color: "#b45309" }}>
          Wynik: <strong>{score}</strong> / {total}
        </p>
        {!saved && <p style={{ color: "var(--hm-muted)" }}>Zapisywanie wyniku...</p>}
        <div className="flex flex-col gap-3">
          <Link href={backHref} className="inline-block px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 text-center">
            📚 Wybierz inny temat
          </Link>
          <Link href="/menu" className="inline-block px-6 py-3 rounded-lg bg-[#ffbd45] text-[#0e1117] font-medium hover:opacity-90 text-center">
            ← Wróć do menu
          </Link>
        </div>
      </div>
    );
  }

  if (!current) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between text-sm" style={{ color: "var(--hm-muted)" }}>
        <span>Pytanie {index + 1} / {total}</span>
        <span>Punkty: {score}</span>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: "var(--hm-progress-track)" }}>
        <div className="h-full bg-[#ffbd45] transition-all" style={{ width: `${((index + 1) / total) * 100}%` }} />
      </div>

      <p className="text-xs" style={{ color: "var(--hm-muted)" }}>{categoryName}</p>
      <h2 className="text-xl font-medium" style={{ color: "var(--hm-text)" }}>{current.question}</h2>

      {feedback === "wrong" && (
        <div className="p-4 rounded-lg bg-red-900/30 border border-red-700 text-red-200 text-sm">
          Źle. Poprawna odpowiedź: <strong>{current.answers[current.correct_index]}</strong>
          <p className="mt-2 text-[#aaa]">{current.explanation}</p>
        </div>
      )}
      {feedback === "ok" && (
        <div className="p-4 rounded-lg bg-green-900/30 border border-green-700 text-green-200 text-sm">
          Brawo!
          {current.explanation && <p className="mt-2 text-[#aaa]">{current.explanation}</p>}
        </div>
      )}

      <div className="grid gap-2">
        {answers.map((ans) => (
          <button
            key={ans}
            type="button"
            onClick={() => handleAnswer(ans)}
            disabled={feedback !== null}
            className="p-4 rounded-xl border hover:border-[#ffbd45] text-left disabled:opacity-70 disabled:cursor-not-allowed"
            style={{ backgroundColor: "var(--hm-option-bg)", color: "var(--hm-option-text)", borderColor: "var(--hm-option-border)" }}
          >
            {ans}
          </button>
        ))}
      </div>

      {feedback !== null && (
        <button
          type="button"
          onClick={nextQuestion}
          className="w-full py-3 rounded-lg bg-[#ffbd45] text-[#0e1117] font-medium hover:opacity-90"
        >
          Dalej →
        </button>
      )}

      <p className="text-center">
        <Link href={backHref} className="text-sm hover:opacity-90" style={{ color: "var(--hm-muted)" }}>← Zmień temat</Link>
      </p>
    </div>
  );
}

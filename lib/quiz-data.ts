import allQuestions from "./data/quiz-all.json";

export type QuizQuestion = {
  category: string;
  question: string;
  answers: string[];
  correct_index: number;
  explanation: string;
};

export function getQuizQuestions(): QuizQuestion[] {
  return allQuestions as QuizQuestion[];
}

export function loadQuizQuestions(): { question: string; correct: string; answers: string[] }[] {
  return allQuestions.map((q) => ({
    question: q.question,
    correct: q.answers[q.correct_index],
    answers: q.answers,
  }));
}

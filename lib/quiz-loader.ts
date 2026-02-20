import { CATEGORIES, Category } from "./categories";

export type QuizQuestion = {
  category: string;
  question: string;
  answers: string[];
  correct_index: number;
  explanation: string;
};

const questionCache: Record<string, QuizQuestion[]> = {};

function loadQuestionsFromFile(filename: string): QuizQuestion[] {
  if (questionCache[filename]) {
    return questionCache[filename];
  }
  
  try {
    const data = require(`./data/${filename}`);
    questionCache[filename] = data as QuizQuestion[];
    return questionCache[filename];
  } catch {
    console.error(`Failed to load ${filename}`);
    return [];
  }
}

export function getQuestionsForCategory(categoryId: string): QuizQuestion[] {
  if (categoryId === "wszystkie") {
    return getAllQuestions();
  }
  
  const category = CATEGORIES.find((c) => c.id === categoryId);
  if (!category) {
    return [];
  }
  
  return loadQuestionsFromFile(category.file);
}

export function getAllQuestions(): QuizQuestion[] {
  const all: QuizQuestion[] = [];
  for (const cat of CATEGORIES) {
    const questions = loadQuestionsFromFile(cat.file);
    all.push(...questions);
  }
  return all;
}

export function getFlashcardsForCategory(categoryId: string): { question: string; answer: string; explanation: string }[] {
  const questions = getQuestionsForCategory(categoryId);
  return questions.map((q) => ({
    question: q.question,
    answer: q.answers[q.correct_index],
    explanation: q.explanation || "",
  }));
}

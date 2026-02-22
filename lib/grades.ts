/** Klasy szkoły podstawowej (historia w SP: klasy 4–8). Zgodne z podstawą programową 2017. */
export const GRADES = [
  { value: 4, label: "Klasa 4", short: "4" },
  { value: 5, label: "Klasa 5", short: "5" },
  { value: 6, label: "Klasa 6", short: "6" },
  { value: 7, label: "Klasa 7", short: "7" },
  { value: 8, label: "Klasa 8", short: "8" },
] as const;

export type GradeValue = (typeof GRADES)[number]["value"];

export const DEFAULT_GRADE: GradeValue = 6;

export function isValidGrade(n: unknown): n is GradeValue {
  return typeof n === "number" && [4, 5, 6, 7, 8].includes(n);
}

export function parseGradeFromSearchParams(
  params: Record<string, string | string[] | undefined>
): GradeValue {
  const k = params?.klasa;
  if (k == null) return DEFAULT_GRADE;
  const num = typeof k === "string" ? parseInt(k, 10) : parseInt(String(k[0]), 10);
  return isValidGrade(num) ? num : DEFAULT_GRADE;
}

export const SITE_NAME = "History Master Online";
export const SITE_DESCRIPTION =
  "Quiz, fiszki, oś czasu i skojarzenia z historii Polski i świata – zgodne z podstawą programową dla klasy 6 SP. Nauka przez zabawę.";

/** URL repozytorium (stopka: GitHub, Zgłoś błąd) */
export const GITHUB_REPO_URL = "https://github.com/Verti86/quiz-historia";

export function getBaseUrl(): string {
  if (typeof process.env.NEXT_PUBLIC_SITE_URL === "string" && process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  if (typeof process.env.VERCEL_URL === "string" && process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "https://history-master.vercel.app";
}

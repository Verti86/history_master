/** Tekst wyzwania na bieżący tydzień (poniedziałek–niedziela) */
export function getCurrentWeekChallenge(): { title: string; targetXp: number; description: string } {
  return {
    title: "Wyzwanie tygodnia",
    description: "Zdobądź 30 XP w tym tygodniu",
    targetXp: 30,
  };
}

/** Początek bieżącego tygodnia (poniedziałek) w ISO date */
export function getCurrentWeekStart(): string {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - (day === 0 ? 6 : day - 1);
  const monday = new Date(d);
  monday.setDate(diff);
  monday.setHours(0, 0, 0, 0);
  return monday.toISOString().slice(0, 10);
}

import timelineData from "./data/timeline.json";
import associationsData from "./data/associations.json";

export type TimelineEvent = {
  event: string;
  year: number;
  description?: string;
  epoch?: string;
  /** Klasy SP (4–8), dla których wydarzenie jest w zakresie programowym. */
  grades?: number[];
};

export type AssociationItem = {
  answer: string;
  hints: string[];
  /** Klasy SP (4–8), dla których postać jest w zakresie programowym. */
  grades?: number[];
};

type AssociationRow = AssociationItem & { grades?: number[] };

type TimelineRow = TimelineEvent & { grades?: number[] };

/** Wydarzenia dla danej klasy – filtrowane wg zakresu programowego. Opcjonalnie po epoce (w UI). Gdy grade brak – wszystkie (np. eksport). */
export function getTimelineEvents(grade?: number, epochFilter?: string): TimelineEvent[] {
  const data = timelineData as TimelineRow[];
  let out =
    grade == null
      ? [...data]
      : data.filter((e) => !e.grades || e.grades.length === 0 || e.grades.includes(grade));
  if (epochFilter && epochFilter !== "all") out = out.filter((e) => e.epoch === epochFilter);
  return out.map(({ event, year, description, epoch }) => ({ event, year, description, epoch }));
}

/** Skojarzenia dla danej klasy – filtrowane wg zakresu programowego. */
export function getAssociations(grade: number): AssociationItem[] {
  const data = associationsData as AssociationRow[];
  return data
    .filter((item) => !item.grades || item.grades.length === 0 || item.grades.includes(grade))
    .map(({ answer, hints }) => ({ answer, hints }));
}

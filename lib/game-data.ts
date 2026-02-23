import timelineData from "./data/timeline.json";
import associationsData from "./data/associations.json";

export type TimelineEvent = {
  event: string;
  year: number;
  description?: string;
  epoch?: string;
};

export type AssociationItem = {
  answer: string;
  hints: string[];
  /** Klasy SP (4–8), dla których postać jest w zakresie programowym. */
  grades?: number[];
};

type AssociationRow = AssociationItem & { grades?: number[] };

export function getTimelineEvents(epochFilter?: string): TimelineEvent[] {
  const data = timelineData as TimelineEvent[];
  if (!epochFilter || epochFilter === "all") return data;
  return data.filter((e) => e.epoch === epochFilter);
}

/** Skojarzenia dla danej klasy – filtrowane wg zakresu programowego. */
export function getAssociations(grade: number): AssociationItem[] {
  const data = associationsData as AssociationRow[];
  return data
    .filter((item) => !item.grades || item.grades.length === 0 || item.grades.includes(grade))
    .map(({ answer, hints }) => ({ answer, hints }));
}

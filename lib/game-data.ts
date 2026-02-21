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
};

export function getTimelineEvents(epochFilter?: string): TimelineEvent[] {
  const data = timelineData as TimelineEvent[];
  if (!epochFilter || epochFilter === "all") return data;
  return data.filter((e) => e.epoch === epochFilter);
}

export function getAssociations(): AssociationItem[] {
  return associationsData as AssociationItem[];
}

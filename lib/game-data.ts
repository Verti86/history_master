import timelineData from "./data/timeline.json";
import associationsData from "./data/associations.json";

export type TimelineEvent = {
  event: string;
  year: number;
};

export type AssociationItem = {
  answer: string;
  hints: string[];
};

export function getTimelineEvents(): TimelineEvent[] {
  return timelineData as TimelineEvent[];
}

export function getAssociations(): AssociationItem[] {
  return associationsData as AssociationItem[];
}

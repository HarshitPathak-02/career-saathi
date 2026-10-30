import type { DiscoveryStage } from "../types/discovery.types";

export const DISCOVERY_STAGE_LABELS: Record<DiscoveryStage, string> = {
  intro: "Getting started",
  counseling: "Career counseling",
  current_studies: "Current studies",
  work_preferences: "Work preferences",
  strengths_interests: "Strengths and interests",
  values_constraints: "Values and constraints",
  generating: "Preparing recommendations",
  completed: "Discovery complete",
};

export const DISCOVERY_MIN_ANSWERS = 6;

export const DISCOVERY_MAX_ANSWERS = 12;

export const DISCOVERY_QUICK_REPLIES: Partial<
  Record<DiscoveryStage, string[]>
> = {
  current_studies: [
    "I am a student",
    "I am working",
    "I am exploring",
  ],
  work_preferences: [
    "Remote work",
    "Hybrid work",
    "On-site work",
    "Not sure yet",
  ],
  strengths_interests: [
    "Problem solving",
    "Creativity",
    "Communication",
    "Technology",
  ],
  values_constraints: [
    "Work-life balance",
    "Career growth",
    "Job stability",
    "Flexibility",
  ],
};

export const isDiscoveryWrapUp = (
  stage: DiscoveryStage
): boolean =>
  stage === "generating" ||
  stage === "completed";

export const getDiscoveryProgress = (
  answerCount: number,
  isWrapUp: boolean
): number => {
  if (isWrapUp) {
    return 100;
  }

  return Math.min(
    Math.round((answerCount / DISCOVERY_MIN_ANSWERS) * 100),
    90
  );
};

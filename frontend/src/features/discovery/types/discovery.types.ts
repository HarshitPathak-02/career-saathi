export type DiscoveryStatus = "in_progress" | "completed" | "cancelled";

export type DiscoveryStage =
  | "intro"
  | "counseling"
  | "current_studies"
  | "work_preferences"
  | "strengths_interests"
  | "values_constraints"
  | "generating"
  | "completed";

export type DiscoveryMessageRole = "assistant" | "user";

export type DiscoveryMessageType =
  "intro" | "question" | "answer" | "quick_reply" | "free_text";

export type DiscoveryAnswerType = "free_text" | "quick_reply";

export type DiscoveryCandidateSource =
  "discovery" | "resume" | "assessment" | "preference";

export type DiscoveryCandidateStatus = "proposed" | "selected" | "rejected";

export interface DiscoverySession {
  id: string;

  userId: string;

  careerJourneyId: string | null;

  status: DiscoveryStatus;

  currentStage: DiscoveryStage;

  createdAt: string;

  updatedAt: string;

  completedAt: string | null;
}

export interface DiscoveryMessage {
  id: string;

  discoverySessionId: string;

  senderRole: DiscoveryMessageRole;

  content: string;

  messageType: DiscoveryMessageType;

  metadata?: Record<string, unknown>;

  createdAt: string;
}

export interface DiscoveryAnswer {
  id: string;

  discoverySessionId: string;

  userId: string;

  questionKey: string;

  answer: string;

  answerType: DiscoveryAnswerType;

  metadata?: Record<string, unknown>;

  createdAt: string;
}

export interface DiscoveryCandidate {
  id: string;

  discoverySessionId: string;

  careerDomainId: string;

  careerDomainName: string;

  careerRoleId: string;

  careerRoleName: string;

  rationale?: string;

  source: DiscoveryCandidateSource;

  rank: number;

  status: DiscoveryCandidateStatus;

  createdAt: string;

  updatedAt: string;
}

export interface CreateDiscoverySessionRequest {
  careerJourneyId?: string;
}

export interface CreateDiscoveryAnswerRequest {
  questionKey: string;

  answer: string;

  answerType: DiscoveryAnswerType;
}

export interface AddDiscoveryAnswerRequest extends CreateDiscoveryAnswerRequest {
  discoveryId: string;
}

export interface SelectDiscoveryCandidateRequest {
  discoveryId: string;

  candidateId: string;
}

export interface SelectDiscoveryCandidateResponse {
  candidate: DiscoveryCandidate;

  careerJourneyId: string;
}

import { Types } from 'mongoose';

import {
  DiscoveryAnswerType,
  DiscoveryCandidateSource,
  DiscoveryCandidateStatus,
  DiscoveryMessageRole,
  DiscoveryMessageType,
  DiscoveryStage,
  DiscoveryStatus,
} from './discovery.enums.js';

export interface CreateDiscoverySessionDto {
  careerJourneyId?: string;
}

export interface CreateDiscoverySessionInput {
  userId: Types.ObjectId;
  careerJourneyId?: Types.ObjectId;
  status: DiscoveryStatus;
  currentStage: DiscoveryStage;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateDiscoveryMessageInput {
  discoverySessionId: Types.ObjectId;
  senderRole: DiscoveryMessageRole;
  content: string;
  messageType: DiscoveryMessageType;
  metadata?: Record<string, unknown>;
}

export interface DiscoveryAssistantMessageOutput {
  message: string;
}

export interface DiscoveryCounselorOutput extends DiscoveryAssistantMessageOutput {
  isReadyForRecommendations: boolean;
  coveredTopics: string[];
}

export interface DiscoveryCandidateSuggestion {
  roleSlug: string;
  rationale: string;
  rank: number;
}

export interface DiscoveryCandidateGenerationOutput {
  candidates: DiscoveryCandidateSuggestion[];
}

export interface DiscoveryMessageResponse {
  id: string;
  discoverySessionId: string;
  senderRole: string;
  content: string;
  messageType: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

export interface DiscoverySessionResponse {
  id: string;
  userId: string;
  careerJourneyId: string | null;
  status: DiscoveryStatus;
  currentStage: DiscoveryStage;
  createdAt: Date;
  updatedAt: Date;
  completedAt: Date | null;
}

export interface CreateDiscoveryAnswerDto {
  questionKey: string;
  answer: string;
  answerType: DiscoveryAnswerType;
  metadata?: Record<string, unknown>;
}

export interface CreateDiscoveryAnswerInput {
  discoverySessionId: Types.ObjectId;
  userId: Types.ObjectId;
  questionKey: string;
  answer: string;
  answerType: DiscoveryAnswerType;
  metadata?: Record<string, unknown>;
}

export interface DiscoveryAnswerResponse {
  id: string;
  discoverySessionId: string;
  userId: string;
  questionKey: string;
  answer: string;
  answerType: DiscoveryAnswerType;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

export interface CreateDiscoveryCandidateDto {
  discoverySessionId: Types.ObjectId;
  careerDomainId: Types.ObjectId;
  careerRoleId: Types.ObjectId;
  rationale?: string;
  source: DiscoveryCandidateSource;
  rank: number;
  status?: DiscoveryCandidateStatus;
}

export interface DiscoveryCandidateResponse {
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
  createdAt: Date;
  updatedAt: Date;
}

export interface SelectDiscoveryCandidateResponse {
  candidate: DiscoveryCandidateResponse;
  careerJourneyId: string;
}

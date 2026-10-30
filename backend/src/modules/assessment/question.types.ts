import type {
  QuestionDifficulty,
  QuestionSource,
  QuestionStatus,
  QuestionType,
} from "./assessment-engine.enums.js";

export interface QuestionOption {
  key: string;
  text: string;
}

export interface QuestionNumericAnswer {
  value: number;
  tolerance: number;
  unit?: string;
}

export interface QuestionMatchingItem {
  key: string;
  text: string;
}

export interface QuestionMatchingPair {
  leftKey: string;
  rightKey: string;
}

export interface QuestionMatching {
  leftItems: QuestionMatchingItem[];
  rightItems: QuestionMatchingItem[];
  correctPairs: QuestionMatchingPair[];
}

export interface QuestionGeneratedBy {
  provider: string;
  model: string;
  promptVersion: string;
}

export interface QuestionContentInput {
  type: QuestionType;
  stem: string;
  options?: QuestionOption[];
  correctOptionKeys?: string[];
  numericAnswer?: QuestionNumericAnswer;
  matching?: QuestionMatching;
  explanation: string;
  estimatedTimeSeconds: number;
}

export interface CreateQuestionDTO extends QuestionContentInput {
  skillCatalogId: string;
  topicId: string;
  difficulty: QuestionDifficulty;
  status?: QuestionStatus;
  source?: QuestionSource;
  generatedBy?: QuestionGeneratedBy;
}

export interface QuestionAnswerKey {
  correctOptionKeys?: string[];
  numericAnswer?: QuestionNumericAnswer;
  matching?: QuestionMatching;
}

export interface PublicQuestion {
  id: string;
  skillCatalogId: string;
  topicId: string;
  type: QuestionType;
  difficulty: QuestionDifficulty;
  stem: string;
  options: QuestionOption[];
  estimatedTimeSeconds: number;
}

export interface QuestionAdminView extends PublicQuestion {
  status: QuestionStatus;
  source: QuestionSource;
  explanation: string;
  version: number;
  usageCount: number;
  contentHash: string;
  reviewedAt: Date | null;
  reviewNotes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

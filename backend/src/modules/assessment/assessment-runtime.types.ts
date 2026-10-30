import type {
  AssessmentAttemptStatus,
  AssessmentSectionStatus,
  QuestionDifficulty,
  QuestionType,
} from "./assessment-engine.enums.js";
import type {
  AssessmentStatus,
  AssessmentType,
} from "./assessment.enums.js";
import type {
  QuestionMatchingItem,
  QuestionOption,
} from "./question.types.js";

export interface InitialCampaignSection {
  sectionId: string;
  skillCatalogId: string;
  skillName: string;
  displayOrder: number;
  status: AssessmentSectionStatus;
  questionCount: number;
  timeLimitSeconds: number;
}

export interface AssessmentSectionView
  extends InitialCampaignSection {
  score: number | null;
  maxScore: number;
  startedAt: Date | null;
  completedAt: Date | null;
}

export interface StartInitialCampaignResponse {
  assessmentId: string;
  careerJourneyId: string;
  type: AssessmentType;
  status: AssessmentStatus;
  sectionCount: number;
  firstSectionId: string;
  sections: InitialCampaignSection[];
}

export interface AttemptQuestionView {
  assessmentQuestionId: string;
  type: QuestionType;
  difficulty: QuestionDifficulty;
  stem: string;
  options: QuestionOption[];
  matching?: {
    leftItems: QuestionMatchingItem[];
    rightItems: QuestionMatchingItem[];
  };
  estimatedTimeSeconds: number;
  points: number;
}

export interface AttemptAnswerView {
  assessmentQuestionId: string;
  selectedOptionKeys: string[];
  numericValue: number | null;
  matchingPairs: Array<{
    leftKey: string;
    rightKey: string;
  }>;
}

export interface StartSectionAttemptResponse {
  attemptId: string;
  sectionId: string;
  attemptNumber: number;
  status: AssessmentAttemptStatus;
  startedAt: Date;
  expiresAt: Date;
  resumed: boolean;
  questions: AttemptQuestionView[];
  answers: AttemptAnswerView[];
}

export interface AttemptStateResponse {
  attemptId: string;
  sectionId: string;
  attemptNumber: number;
  status: AssessmentAttemptStatus;
  startedAt: Date;
  expiresAt: Date;
  questions: AttemptQuestionView[];
  answers: AttemptAnswerView[];
}

export interface AutosaveAnswerInput {
  assessmentQuestionId: string;
  selectedOptionKeys?: string[];
  numericValue?: number | null;
  matchingPairs?: Array<{
    leftKey: string;
    rightKey: string;
  }>;
  timeSpentSeconds?: number;
}

export interface AutosaveAttemptInput {
  attemptId: string;
  userId: string;
  answers: AutosaveAnswerInput[];
}

export interface SubmitAttemptInput {
  attemptId: string;
  userId: string;
  answers?: AutosaveAnswerInput[];
}

export interface AttemptTopicResult {
  topicId: string;
  topicName: string;
  masteryScore: number;
  accuracy: number;
  questionsAnswered: number;
  correctCount: number;
  weak: boolean;
}

export interface AttemptQuestionResult {
  assessmentQuestionId: string;
  isCorrect: boolean;
  pointsAwarded: number;
  explanation: string;
}

export interface SubmitAttemptResponse {
  attemptId: string;
  sectionId: string;
  skillCatalogId: string;
  status: AssessmentAttemptStatus;
  score: number;
  maxScore: number;
  percentage: number;
  correctCount: number;
  questionCount: number;
  durationSeconds: number;
  questions: AttemptQuestionResult[];
  topics: AttemptTopicResult[];
  weakTopics: AttemptTopicResult[];
  assessmentCompleted: boolean;
  careerJourneyActivated: boolean;
}

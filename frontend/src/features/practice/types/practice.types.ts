export type ChallengeDifficulty = "EASY" | "MEDIUM" | "HARD";
export type ChallengeSource = "SEEDED" | "AI_GENERATED";
export type CodingAttemptStatus = "PENDING" | "EVALUATED" | "FAILED";

export interface CodingTestCase {
  id: string;
  name: string;
  inputCode: string;
  expectedOutput: string;
  explanation?: string;
}

export interface TestExecutionResult {
  id: string;
  name: string;
  passed: boolean;
  actualOutput: string;
  expectedOutput: string;
  error?: string;
  logs: string[];
  executionTimeMs: number;
}

export interface TestSuiteResult {
  total: number;
  passed: number;
  failed: number;
  executionTimeMs: number;
  results: TestExecutionResult[];
}

export interface CodingEvaluation {
  correctnessScore: number;
  codeQualityScore: number;
  observedStrengths: string[];
  observedStruggles: string[];
  antiPatterns: string[];
  mentorFeedback: string;
}

export interface ChallengeSummary {
  id: string;
  title: string;
  slug: string;
  skillCatalogId: string;
  topicId: string;
  difficulty: ChallengeDifficulty;
  estimatedMinutes: number;
}

export interface PracticeSkill {
  id: string;
  name: string;
  slug: string;
  category: string;
}

export interface RecommendedTopic {
  topicId: string;
  skillCatalogId: string;
  name: string;
  slug: string;
  masteryScore: number;
}

export interface RecentAttemptSummary {
  id: string;
  challengeId: string;
  status: CodingAttemptStatus;
  optedInToJourney: boolean;
  correctnessScore: number | null;
  codeQualityScore: number | null;
  evaluatedAt: string | null;
}

export interface PracticeHubResponse {
  skills: PracticeSkill[];
  recommendedTopics: RecommendedTopic[];
  challenges: ChallengeSummary[];
  recentAttempts: RecentAttemptSummary[];
}

export interface ChallengeDetailResponse {
  id: string;
  title: string;
  slug: string;
  skill: {
    id: string;
    name: string;
    slug: string;
  };
  topic: {
    id: string;
    name: string;
    slug: string;
  };
  difficulty: ChallengeDifficulty;
  estimatedMinutes: number;
  description: string;
  starterCode: string;
  testCases: CodingTestCase[];
  latestAttempt: {
    id: string;
    submittedCode: string;
    status: CodingAttemptStatus;
    optedInToJourney: boolean;
    evaluation: CodingEvaluation | null;
    evaluatedAt: string | null;
  } | null;
}

export interface EvaluateChallengeRequest {
  careerJourneyId: string;
  submittedCode: string;
  testResults: {
    total: number;
    passed: number;
    failed: number;
    executionTimeMs: number;
  };
  durationSeconds: number;
  runCount: number;
}

export interface EvaluateChallengeResponse {
  attemptId: string;
  challengeSlug: string;
  evaluation: CodingEvaluation;
  optedInToJourney: boolean;
  evaluatedAt: string;
}

export interface OptInAttemptRequest {
  attemptId: string;
  optIn: boolean;
}

export interface OptInAttemptResponse {
  attemptId: string;
  optedInToJourney: boolean;
}

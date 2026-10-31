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

export interface RecentInterviewSummary {
  id: string;
  skillCatalogId: string;
  skillName: string;
  status: "IN_PROGRESS" | "COMPLETED" | "ABANDONED";
  currentQuestionIndex: number;
  optedInToJourney: boolean;
  overallScore: number | null;
  conceptualDepthScore: number | null;
  communicationScore: number | null;
  startedAt: string;
  completedAt: string | null;
}

export interface PracticeHubResponse {
  skills: PracticeSkill[];
  recommendedTopics: RecommendedTopic[];
  challenges: ChallengeSummary[];
  recentAttempts: RecentAttemptSummary[];
  recentInterviews?: RecentInterviewSummary[];
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

export type InterviewTurnType = "SCENARIO" | "FOLLOW_UP";
export type InterviewSessionStatus = "IN_PROGRESS" | "COMPLETED" | "ABANDONED";

export interface InterviewTurn {
  turnIndex: number;
  questionIndex: number;
  turnType: InterviewTurnType;
  questionText: string;
  candidateAnswer: string | null;
  answeredAt: string | null;
}

export interface InterviewEvaluation {
  conceptualDepthScore: number;
  communicationScore: number;
  overallScore: number;
  observedStrengths: string[];
  observedGaps: string[];
  antiPatterns: string[];
  mentorFeedback: string;
}

export interface InterviewSessionDto {
  id: string;
  skillCatalogId: string | null;
  skillName: string;
  isOfficialReadinessMock?: boolean;
  mockInterviewNumber?: number | null;
  mockInterviewType?: string | null;
  roleTitle?: string | null;
  status: InterviewSessionStatus;
  currentQuestionIndex: number;
  isAwaitingFollowUp: boolean;
  turns: InterviewTurn[];
  evaluation: InterviewEvaluation | null;
  optedInToJourney: boolean;
  startedAt: string;
  completedAt: string | null;
}

export interface StartInterviewRequest {
  careerJourneyId: string;
  skillCatalogId: string;
}

export interface SubmitInterviewAnswerRequest {
  careerJourneyId: string;
  candidateAnswer: string;
}

export interface OptInInterviewRequest {
  sessionId: string;
  optIn: boolean;
}

export interface OptInInterviewResponse {
  sessionId: string;
  optedInToJourney: boolean;
}

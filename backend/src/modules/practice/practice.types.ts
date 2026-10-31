export interface CodingTestCase {
  id: string;
  name: string;
  inputCode: string;
  expectedOutput: string;
  isHidden?: boolean;
  explanation?: string;
}

export interface CodingEvaluation {
  correctnessScore: number;
  codeQualityScore: number;
  observedStrengths: string[];
  observedStruggles: string[];
  antiPatterns: string[];
  mentorFeedback: string;
}

export interface TestExecutionResults {
  total: number;
  passed: number;
  failed: number;
  executionTimeMs: number;
}

export interface EvaluateChallengeInput {
  submittedCode: string;
  testResults: TestExecutionResults;
  durationSeconds: number;
  runCount: number;
}

export interface OptInJourneyInput {
  optIn: boolean;
}

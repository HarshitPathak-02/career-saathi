export interface UserSkill {
    _id: string;

    careerJourneyId: string;

    skillCatalogId: string;

    selectedByUser: boolean;

    currentScore: number;

    currentLevel: string;

    lastAssessmentAt?: string;

    isActive: boolean;

    createdAt: string;

    updatedAt: string;
}

export interface InitializeUserSkillsRequest {
    careerJourneyId: string;

    selectedSkillCatalogIds: string[];
}

export interface StartInitialAssessmentRequest {
    careerJourneyId: string;
}

export type AssessmentStatus =
    | "PENDING"
    | "IN_PROGRESS"
    | "COMPLETED"
    | "CANCELLED";

export type AssessmentSectionStatus =
    | "PENDING"
    | "IN_PROGRESS"
    | "COMPLETED"
    | "CANCELLED";

export type AssessmentAttemptStatus =
    | "IN_PROGRESS"
    | "SUBMITTED"
    | "EXPIRED"
    | "ABANDONED";

export type QuestionType =
    | "SINGLE_CHOICE"
    | "MULTI_SELECT"
    | "NUMERIC"
    | "MATCHING";

export type QuestionDifficulty =
    | "EASY"
    | "MEDIUM"
    | "HARD";

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

    startedAt: string | null;

    completedAt: string | null;
}

export interface StartInitialAssessmentResponse {
    assessmentId: string;

    careerJourneyId: string;

    type: "INITIAL" | "WEEKLY" | "RESUME";

    status: AssessmentStatus;

    sectionCount: number;

    firstSectionId: string;

    sections: InitialCampaignSection[];
}

export interface QuestionOption {
    key: string;

    text: string;
}

export interface QuestionMatchingItem {
    key: string;

    text: string;
}

export interface AttemptQuestion {
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

    startedAt: string;

    expiresAt: string;

    resumed: boolean;

    questions: AttemptQuestion[];

    answers: AttemptAnswerView[];
}

export interface AssessmentAnswerPayload {
    assessmentQuestionId: string;

    selectedOptionKeys?: string[];

    numericValue?: number | null;

    matchingPairs?: Array<{
        leftKey: string;

        rightKey: string;
    }>;
}

export interface AutosaveAttemptRequest {
    attemptId: string;

    answers: AssessmentAnswerPayload[];
}

export interface SubmitAttemptRequest {
    attemptId: string;

    answers: AssessmentAnswerPayload[];
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
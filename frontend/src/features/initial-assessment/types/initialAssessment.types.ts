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

export interface Assessment {
    _id: string;

    careerJourneyId: string;

    type: "INITIAL" | "WEEKLY";

    weekNumber: number;

    title: string;

    description?: string;

    status:
    | "PENDING"
    | "COMPLETED"
    | "CANCELLED";

    completedAt: string | null;

    createdAt: string;

    updatedAt: string;
}

export type AssessmentMethod =
    | "PLATFORM"
    | "MANUAL";

export interface SubmitAssessmentSkill {
    userSkillId: string;

    obtainedMarks: number;

    totalMarks: number;

    assessmentMethod: AssessmentMethod;

    assessmentPlatform?: string;

    assessmentName?: string;

    remarks?: string;
}

export interface SubmitInitialAssessmentRequest {
    assessmentId: string;

    skills: SubmitAssessmentSkill[];
}
export type AssessmentType =
    | "INITIAL"
    | "WEEKLY";

export type AssessmentStatus =
    | "PENDING"
    | "COMPLETED"
    | "CANCELLED";

export type AssessmentMethod =
    | "PLATFORM"
    | "MANUAL";

/*
|--------------------------------------------------------------------------
| Assessment History
|--------------------------------------------------------------------------
*/

export interface AssessmentHistoryItem {
    id: string;

    type: AssessmentType;

    weekNumber: number;

    title: string;

    description?: string | null;

    status: AssessmentStatus;

    completedAt: string | null;

    createdAt: string;
}

/*
|--------------------------------------------------------------------------
| Assessment Skill Detail
|--------------------------------------------------------------------------
*/

export interface AssessmentSkillDetail {
    id: string;

    userSkillId: string;

    skillCatalogId: string;

    skillName: string;

    obtainedMarks: number;

    totalMarks: number;

    percentage: number;

    improvementPercentage: number | null;

    assessmentMethod: AssessmentMethod;

    assessmentPlatform?: string | null;

    assessmentName?: string | null;

    remarks?: string | null;
}

/*
|--------------------------------------------------------------------------
| Assessment Detail
|--------------------------------------------------------------------------
*/

export interface AssessmentDetail {
    assessment: {
        id: string;

        careerJourneyId: string;

        type: AssessmentType;

        weekNumber: number;

        title: string;

        description?: string | null;

        status: AssessmentStatus;

        completedAt: string | null;

        createdAt: string;
    };

    skills: AssessmentSkillDetail[];

    summary: {
        totalSkills: number;

        averagePercentage: number;
    };
}
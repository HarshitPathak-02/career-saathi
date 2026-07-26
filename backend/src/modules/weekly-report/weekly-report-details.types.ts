export interface WeeklyReportSkillDetailDTO {

    userSkillId: string;

    skillCatalogId: string;

    skillName: string;

    obtainedMarks: number;

    totalMarks: number;

    percentage: number;

    improvementPercentage: number | null;

}

export interface WeeklyReportAssessmentDetailDTO {

    id: string;

    title: string;

    type: string;

    weekNumber: number;

    status: string;

    completedAt: Date | null;

}

export interface WeeklyReportReflectionDetailDTO {

    weekNumber: number;

    learningReflection: {

        completedAllTasks: boolean;

        reason?: string | null;

        difficultyType?: string | null;

        confidenceRating: number;

    };

    mentorCheckIn: {

        overallWeek: string;

        motivationLevel: string;

        externalFactors?: string | null;

        careerConcern?: string | null;

        helpNeeded?: string | null;

    };

    additionalComments?: string | null;

}

export interface WeeklyReportDetailsDTO {

    id: string;

    careerJourneyId: string;

    missionId: string;

    generatedAt: Date;

    status: string;

    summary: {

        summary: string;

        achievements: string[];

        improvements: string[];

    };

    mentorFeedback: {

        advice: string;

        motivationMessage: string;

    };

    recommendation: {

        weakSkills: string[];

        revisionTopics: string[];

        recommendedDifficulty: string;

        recommendedStudyHours: number;

        prioritizeRevision: boolean;

        skipCompletedTopics: boolean;

    };

    assessment:
    WeeklyReportAssessmentDetailDTO;

    reflection:
    WeeklyReportReflectionDetailDTO;

    skills:
    WeeklyReportSkillDetailDTO[];

}
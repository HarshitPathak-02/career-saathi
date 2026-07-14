export interface AssessmentQuestionPayload {

    id: string;

    skillCode: string;

    question: string;

    type: string;

    difficulty: string;

    options: string[];
}

export interface StartAssessmentResponse {

    assessmentId: string;

    questions: AssessmentQuestionPayload[];
}

export interface SubmitAssessmentAnswer {

    questionId: string;

    selectedAnswer: string;
}

export interface SubmitAssessmentRequest {

    answers: SubmitAssessmentAnswer[];
}

export interface SubmitAssessmentResponse {

    overallScore: number;

    overallLevel: string;

    skillResults: {
        skillCode: string;

        score: number;

        level: string;

        correctAnswers: number;

        totalQuestions: number;
    }[];
}
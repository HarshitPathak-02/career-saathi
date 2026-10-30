export const ASSESSMENT_ENGINE = {
    MAX_SKILLS_PER_INITIAL_ASSESSMENT: 10,

    QUESTIONS_PER_SKILL: 5,

    SECTION_TIME_LIMIT_SECONDS: 10 * 60,

    ATTEMPT_EXPIRY_SECONDS: 2 * 60 * 60,

    DIFFICULTY_DISTRIBUTION: {
        EASY: 0.4,
        MEDIUM: 0.4,
        HARD: 0.2,
    },

    DIFFICULTY_WEIGHTS: {
        EASY: 1,
        MEDIUM: 1.5,
        HARD: 2,
    },

    MIN_TOPIC_SAMPLE_SIZE: 3,

    DEFAULT_ESTIMATED_TIME_SECONDS: 60,
} as const;

export const ASSESSMENT_SECTION_MODEL =
    "AssessmentSection";
export const ASSESSMENT_SECTION_COLLECTION =
    "assessment_sections";

export const ASSESSMENT_ATTEMPT_MODEL =
    "AssessmentAttempt";
export const ASSESSMENT_ATTEMPT_COLLECTION =
    "assessment_attempts";

export const ASSESSMENT_QUESTION_MODEL =
    "AssessmentQuestion";
export const ASSESSMENT_QUESTION_COLLECTION =
    "assessment_questions";

export const ASSESSMENT_ANSWER_MODEL =
    "AssessmentAnswer";
export const ASSESSMENT_ANSWER_COLLECTION =
    "assessment_answers";

export const SKILL_TOPIC_PROGRESS_MODEL =
    "SkillTopicProgress";
export const SKILL_TOPIC_PROGRESS_COLLECTION =
    "skill_topic_progress";

export const SKILL_EVIDENCE_MODEL =
    "SkillEvidence";
export const SKILL_EVIDENCE_COLLECTION =
    "skill_evidence";

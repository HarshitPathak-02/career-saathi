import {
    useState,
} from "react";

import {
    AlertCircle,
    ClipboardCheck,
} from "lucide-react";

import Button from "../../../components/ui/Button/Button";

import {
    getApiErrorMessage,
} from "../../../shared/lib/getApiErrorMessage";

import SkillScoreField from "../../initial-assessment/components/SkillScoreField";

import {
    useGetUserSkillsQuery,
    useStartResumeAssessmentMutation,
    useSubmitResumeAssessmentMutation,
} from "../../initial-assessment/api/initialAssessmentApi";

import type {
    ResumeSkill,
} from "../types/resume.types";

interface ResumeSkillAssessmentPanelProps {
    careerJourneyId: string;

    skillCatalogIds: string[];

    skills: ResumeSkill[];

    onCompleted?: () => void;
}

interface ScoreInput {
    obtainedMarks: number | "";

    totalMarks: number | "";
}

const ResumeSkillAssessmentPanel = ({
    careerJourneyId,
    skillCatalogIds,
    skills,
    onCompleted,
}: ResumeSkillAssessmentPanelProps) => {
    const [
        assessmentId,
        setAssessmentId,
    ] = useState<string | null>(null);

    const [
        scoreInputs,
        setScoreInputs,
    ] = useState<
        Record<string, ScoreInput>
    >({});

    const [
        actionError,
        setActionError,
    ] = useState<string | null>(null);

    const {
        data: userSkillsResponse,
        isLoading: userSkillsLoading,
    } = useGetUserSkillsQuery(
        careerJourneyId
    );

    const [
        startResumeAssessment,
        {
            isLoading: isStarting,
        },
    ] = useStartResumeAssessmentMutation();

    const [
        submitResumeAssessment,
        {
            isLoading: isSubmitting,
        },
    ] = useSubmitResumeAssessmentMutation();

    const userSkills =
        userSkillsResponse?.data ?? [];

    const assessmentSkills =
        skillCatalogIds.flatMap(
            (skillCatalogId) => {
                const userSkill =
                    userSkills.find(
                        (skill) =>
                            skill
                                .skillCatalogId ===
                            skillCatalogId
                    );

                if (!userSkill) {
                    return [];
                }

                const skill =
                    skills.find(
                        (item) =>
                            item
                                .skillCatalogId ===
                            skillCatalogId
                    );

                return [
                    {
                        userSkillId:
                            userSkill._id,

                        skillCatalogId,

                        skillName:
                            skill?.name ??
                            "Skill",
                    },
                ];
            }
        );

    const isFormValid =
        assessmentSkills.length > 0 &&
        assessmentSkills.every(
            (skill) => {
                const input =
                    scoreInputs[
                        skill.userSkillId
                    ];

                return (
                    typeof input
                        ?.obtainedMarks ===
                    "number" &&
                    typeof input
                        ?.totalMarks ===
                    "number" &&
                    input.obtainedMarks >= 0 &&
                    input.totalMarks > 0 &&
                    input.obtainedMarks <=
                    input.totalMarks
                );
            }
        );

    const handleStart = async () => {
        setActionError(null);

        try {
            const response =
                await startResumeAssessment({
                    careerJourneyId,

                    skillCatalogIds:
                        assessmentSkills.map(
                            (skill) =>
                                skill
                                    .skillCatalogId
                        ),
                }).unwrap();

            setAssessmentId(
                response.data.id
            );
        } catch (error) {
            setActionError(
                getApiErrorMessage(error)
            );
        }
    };

    const updateScore = (
        userSkillId: string,
        field:
            | "obtainedMarks"
            | "totalMarks",
        value: number | ""
    ) => {
        setScoreInputs(
            (current) => ({
                ...current,

                [userSkillId]: {
                    obtainedMarks:
                        current[
                            userSkillId
                        ]
                            ?.obtainedMarks ??
                        "",

                    totalMarks:
                        current[
                            userSkillId
                        ]
                            ?.totalMarks ??
                        "",

                    [field]: value,
                },
            })
        );
    };

    const handleSubmit = async () => {
        if (
            !assessmentId ||
            !isFormValid
        ) {
            return;
        }

        setActionError(null);

        try {
            await submitResumeAssessment({
                assessmentId,

                skills:
                    assessmentSkills.map(
                        (skill) => ({
                            userSkillId:
                                skill.userSkillId,

                            obtainedMarks:
                                Number(
                                    scoreInputs[
                                        skill
                                            .userSkillId
                                    ]
                                        ?.obtainedMarks
                                ),

                            totalMarks:
                                Number(
                                    scoreInputs[
                                        skill
                                            .userSkillId
                                    ]
                                        ?.totalMarks
                                ),

                            assessmentMethod:
                                "PLATFORM",
                        })
                    ),
            }).unwrap();

            setAssessmentId(null);
            setScoreInputs({});

            onCompleted?.();
        } catch (error) {
            setActionError(
                getApiErrorMessage(error)
            );
        }
    };

    if (
        skillCatalogIds.length === 0 ||
        userSkillsLoading
    ) {
        return null;
    }

    if (assessmentSkills.length === 0) {
        return null;
    }

    return (
        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 sm:p-6">
            <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-amber-700">
                    <ClipboardCheck size={20} />
                </div>

                <div>
                    <h3 className="font-semibold text-amber-950">
                        Assess your new resume skills
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-amber-900">
                        We found{" "}
                        {assessmentSkills.length}{" "}
                        skill
                        {assessmentSkills.length ===
                        1
                            ? ""
                            : "s"}{" "}
                        that still need a score.
                        Completing this assessment updates
                        your profile and future missions.
                    </p>
                </div>
            </div>

            {actionError && (
                <div
                    role="alert"
                    className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                >
                    <AlertCircle
                        size={17}
                        className="mt-0.5 shrink-0"
                    />

                    <p>{actionError}</p>
                </div>
            )}

            {!assessmentId ? (
                <Button
                    className="mt-5"
                    loading={isStarting}
                    onClick={handleStart}
                >
                    Start skill assessment
                </Button>
            ) : (
                <div className="mt-5 space-y-4">
                    {assessmentSkills.map(
                        (skill) => {
                            const input =
                                scoreInputs[
                                    skill
                                        .userSkillId
                                ];

                            return (
                                <SkillScoreField
                                    key={
                                        skill.userSkillId
                                    }
                                    skillName={
                                        skill.skillName
                                    }
                                    obtainedMarks={
                                        input
                                            ?.obtainedMarks ??
                                        ""
                                    }
                                    totalMarks={
                                        input
                                            ?.totalMarks ??
                                        ""
                                    }
                                    onObtainedMarksChange={(
                                        value
                                    ) =>
                                        updateScore(
                                            skill.userSkillId,
                                            "obtainedMarks",
                                            value
                                        )
                                    }
                                    onTotalMarksChange={(
                                        value
                                    ) =>
                                        updateScore(
                                            skill.userSkillId,
                                            "totalMarks",
                                            value
                                        )
                                    }
                                />
                            );
                        }
                    )}

                    <Button
                        loading={isSubmitting}
                        disabled={!isFormValid}
                        onClick={handleSubmit}
                    >
                        Submit skill scores
                    </Button>
                </div>
            )}
        </section>
    );
};

export default ResumeSkillAssessmentPanel;

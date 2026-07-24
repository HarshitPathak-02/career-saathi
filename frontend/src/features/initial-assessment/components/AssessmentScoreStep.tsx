import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import {
    Trophy,
} from "lucide-react";

import Button from "../../../components/ui/Button/Button";

import {
    useAppDispatch,
    useAppSelector,
} from "../../../app/hooks";

import {
    resetInitialAssessment,
    setAssessmentStep,
} from "../slice/initialAssessmentSlice";

import {
    useGetUserSkillsQuery,
    useSubmitInitialAssessmentMutation,
} from "../api/initialAssessmentApi";

import {
    useGetCareerRoleSkillsQuery,
} from "../../career-setup/api/careerSetupApi";

import SkillScoreField from "./SkillScoreField";

interface AssessmentScoreStepProps {
    careerJourneyId: string;
    roleId: string;
}

interface ScoreState {
    userSkillId: string;

    skillCatalogId: string;

    skillName: string;

    obtainedMarks: number | "";

    totalMarks: number | "";
}

const AssessmentScoreStep = ({
    careerJourneyId,
    roleId,
}: AssessmentScoreStepProps) => {
    const navigate =
        useNavigate();

    const dispatch =
        useAppDispatch();

    const assessmentId =
        useAppSelector(
            (state) =>
                state.initialAssessment
                    .assessmentId
        );

    /*
     * Skill metadata belonging to
     * the selected career role.
     */
    const {
        data: roleSkillsResponse,
        isLoading: roleSkillsLoading,
        isError: roleSkillsError,
        refetch: refetchRoleSkills,
    } = useGetCareerRoleSkillsQuery(
        roleId
    );

    /*
     * UserSkill documents initialized
     * during Step 1.
     */
    const {
        data: userSkillsResponse,
        isLoading: userSkillsLoading,
        isError: userSkillsError,
        refetch: refetchUserSkills,
    } = useGetUserSkillsQuery(
        careerJourneyId
    );

    const [
        submitInitialAssessment,
        {
            isLoading: isSubmitting,
            error: submitError,
        },
    ] =
        useSubmitInitialAssessmentMutation();

    const roleSkills =
        roleSkillsResponse?.data ?? [];

    const userSkills =
        userSkillsResponse?.data ?? [];

    /*
     * Build the skills that actually need
     * scores.
     *
     * UserSkill.skillCatalogId
     * matches
     * CareerRoleSkill.skillId.
     */
    const selectedSkills =
        useMemo(
            () =>
                userSkills
                    .filter(
                        (skill) =>
                            skill.selectedByUser
                    )
                    .map(
                        (userSkill) => {
                            const roleSkill =
                                roleSkills.find(
                                    (
                                        skill
                                    ) =>
                                        skill.skillId ===
                                        userSkill
                                            .skillCatalogId
                                );

                            return {
                                userSkillId:
                                    userSkill._id,

                                skillCatalogId:
                                    userSkill
                                        .skillCatalogId,

                                skillName:
                                    roleSkill
                                        ?.name ??
                                    "Skill",
                            };
                        }
                    ),
            [
                userSkills,
                roleSkills,
            ]
        );

    const [
        scores,
        setScores,
    ] = useState<
        ScoreState[]
    >([]);

    useEffect(() => {
        if (
            selectedSkills.length >
            0 &&
            scores.length === 0
        ) {
            setScores(
                selectedSkills.map(
                    (skill) => ({
                        ...skill,

                        obtainedMarks:
                            "",

                        totalMarks:
                            "",
                    })
                )
            );
        }
    }, [
        selectedSkills,
        scores.length,
    ]);

    const updateScore = (
        userSkillId: string,
        field:
            | "obtainedMarks"
            | "totalMarks",
        value: number | ""
    ) => {
        setScores(
            (current) =>
                current.map(
                    (score) =>
                        score.userSkillId ===
                            userSkillId
                            ? {
                                ...score,

                                [field]:
                                    value,
                            }
                            : score
                )
        );
    };

    const isFormValid =
        scores.length > 0 &&
        scores.every(
            (score) =>
                typeof score.obtainedMarks ===
                "number" &&
                typeof score.totalMarks ===
                "number" &&
                score.obtainedMarks >=
                0 &&
                score.totalMarks >
                0 &&
                score.obtainedMarks <=
                score.totalMarks
        );

    const handleSubmit =
        async () => {
            if (
                !assessmentId ||
                !isFormValid
            ) {
                return;
            }

            try {
                await submitInitialAssessment(
                    {
                        assessmentId,

                        skills:
                            scores.map(
                                (
                                    score
                                ) => ({
                                    userSkillId:
                                        score.userSkillId,

                                    obtainedMarks:
                                        Number(
                                            score.obtainedMarks
                                        ),

                                    totalMarks:
                                        Number(
                                            score.totalMarks
                                        ),

                                    assessmentMethod:
                                        "PLATFORM",
                                })
                            ),
                    }
                ).unwrap();

                dispatch(
                    resetInitialAssessment()
                );

                navigate(
                    "/workspace",
                    {
                        replace:
                            true,
                    }
                );
            } catch {
                // RTK Query error is rendered below.
            }
        };

    const handleRetry = () => {
        void refetchRoleSkills();
        void refetchUserSkills();
    };

    if (
        roleSkillsLoading ||
        userSkillsLoading
    ) {
        return (
            <div className="py-16 text-center text-slate-600">
                Loading assessment...
            </div>
        );
    }

    if (
        roleSkillsError ||
        userSkillsError
    ) {
        return (
            <div className="py-16 text-center">
                <p className="text-red-500">
                    We couldn't load your
                    assessment skills.
                </p>

                <Button
                    className="mt-5"
                    onClick={
                        handleRetry
                    }
                >
                    Retry
                </Button>
            </div>
        );
    }

    if (!assessmentId) {
        return (
            <div className="py-16 text-center">
                <p className="text-slate-600">
                    Your assessment session
                    has not been started.
                </p>

                <Button
                    className="mt-5"
                    onClick={() =>
                        dispatch(
                            setAssessmentStep(
                                2
                            )
                        )
                    }
                >
                    Go Back
                </Button>
            </div>
        );
    }

    if (
        selectedSkills.length === 0
    ) {
        return (
            <div className="py-16 text-center">
                <p className="text-slate-600">
                    No skills were selected
                    for this assessment.
                </p>

                <Button
                    className="mt-5"
                    onClick={() =>
                        dispatch(
                            setAssessmentStep(
                                1
                            )
                        )
                    }
                >
                    Select Skills
                </Button>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8 flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <Trophy
                        size={22}
                    />
                </div>

                <div>
                    <h2 className="text-xl font-semibold text-slate-900">
                        Enter your assessment
                        results
                    </h2>

                    <p className="mt-1 text-sm text-slate-600">
                        Enter the exact marks
                        you received for each
                        selected skill.
                    </p>
                </div>
            </div>

            <div className="space-y-4">
                {scores.map(
                    (score) => (
                        <SkillScoreField
                            key={
                                score.userSkillId
                            }
                            skillName={
                                score.skillName
                            }
                            obtainedMarks={
                                score.obtainedMarks
                            }
                            totalMarks={
                                score.totalMarks
                            }
                            onObtainedMarksChange={(
                                value
                            ) =>
                                updateScore(
                                    score.userSkillId,
                                    "obtainedMarks",
                                    value
                                )
                            }
                            onTotalMarksChange={(
                                value
                            ) =>
                                updateScore(
                                    score.userSkillId,
                                    "totalMarks",
                                    value
                                )
                            }
                        />
                    )
                )}
            </div>

            <div className="mt-8 flex justify-between border-t border-slate-200 pt-6">
                <Button
                    variant="outline"
                    onClick={() =>
                        dispatch(
                            setAssessmentStep(
                                2
                            )
                        )
                    }
                >
                    Back
                </Button>

                <Button
                    loading={
                        isSubmitting
                    }
                    disabled={
                        !isFormValid
                    }
                    onClick={
                        handleSubmit
                    }
                >
                    Submit Initial
                    Assessment
                </Button>
            </div>

            {submitError && (
                <p className="mt-4 text-right text-sm text-red-500">
                    Assessment submission
                    failed. Please verify
                    your scores and try
                    again.
                </p>
            )}
        </div>
    );
};

export default AssessmentScoreStep;
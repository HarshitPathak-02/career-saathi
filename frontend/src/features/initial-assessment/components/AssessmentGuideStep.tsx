import {
    ClipboardCheck,
    ExternalLink,
} from "lucide-react";

import Button from "../../../components/ui/Button/Button";

import {
    useAppDispatch,
} from "../../../app/hooks";

import {
    setAssessmentId,
    setAssessmentStep,
} from "../slice/initialAssessmentSlice";

import {
    useGetUserSkillsQuery,
    useStartInitialAssessmentMutation,
} from "../api/initialAssessmentApi";

import {
    useGetCareerRoleSkillsQuery,
} from "../../career-setup/api/careerSetupApi";

interface AssessmentGuideStepProps {
    careerJourneyId: string;
    roleId: string;
}

const AssessmentGuideStep = ({
    careerJourneyId,
    roleId,
}: AssessmentGuideStepProps) => {
    const dispatch = useAppDispatch();

    /*
     * Fetch the complete skill information
     * required by the selected career role.
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
     * Fetch UserSkill documents created
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
        startInitialAssessment,
        {
            isLoading: isStarting,
            error: startError,
        },
    ] = useStartInitialAssessmentMutation();

    const roleSkills =
        roleSkillsResponse?.data ?? [];

    const userSkills =
        userSkillsResponse?.data ?? [];

    /*
     * Only skills selected by the user
     * should participate in the initial
     * assessment.
     */
    const selectedUserSkills =
        userSkills.filter(
            (skill) =>
                skill.selectedByUser
        );

    /*
     * UserSkill stores SkillCatalog._id as
     * skillCatalogId.
     *
     * CareerRoleSkill exposes that same ID
     * as skillId.
     */
    const getSkillName = (
        skillCatalogId: string
    ) => {
        return (
            roleSkills.find(
                (skill) =>
                    skill.skillId ===
                    skillCatalogId
            )?.name ?? "Skill"
        );
    };

    const handleContinue = async () => {
        try {
            const response =
                await startInitialAssessment({
                    careerJourneyId,
                }).unwrap();

            dispatch(
                setAssessmentId(
                    response.data._id
                )
            );

            dispatch(
                setAssessmentStep(3)
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
                Preparing your assessment...
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
                    We couldn't prepare your assessment.
                </p>

                <Button
                    className="mt-5"
                    onClick={handleRetry}
                >
                    Retry
                </Button>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8">
                <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                        <ClipboardCheck
                            size={22}
                        />
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-slate-900">
                            Assess your selected skills
                        </h2>

                        <p className="mt-1 text-sm text-slate-600">
                            Complete an assessment for
                            each skill before entering
                            your scores.
                        </p>
                    </div>
                </div>
            </div>

            <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
                <h3 className="font-medium text-amber-950">
                    How this works
                </h3>

                <p className="mt-2 text-sm leading-6 text-amber-900">
                    Take a genuine skill assessment on
                    an appropriate testing platform.
                    Keep your obtained marks and total
                    marks ready. You'll enter them in
                    the next step.
                </p>
            </div>

            <div className="mt-6 space-y-4">
                {selectedUserSkills.map(
                    (
                        userSkill,
                        index
                    ) => {
                        const skillName =
                            getSkillName(
                                userSkill
                                    .skillCatalogId
                            );

                        return (
                            <div
                                key={
                                    userSkill._id
                                }
                                className="flex items-center justify-between gap-5 rounded-xl border border-slate-200 bg-white p-5"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm font-semibold text-slate-700">
                                        {index + 1}
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-slate-900">
                                            {
                                                skillName
                                            }
                                        </h3>

                                        <p className="mt-1 text-sm text-slate-500">
                                            Complete a
                                            skill-level
                                            assessment and
                                            record your
                                            result.
                                        </p>
                                    </div>
                                </div>

                                <ExternalLink
                                    size={18}
                                    className="shrink-0 text-slate-400"
                                />
                            </div>
                        );
                    }
                )}
            </div>

            {selectedUserSkills.length ===
                0 && (
                    <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-6 text-center">
                        <p className="text-sm text-slate-600">
                            No skills have been selected
                            for assessment.
                        </p>
                    </div>
                )}

            <div className="mt-8 flex justify-between border-t border-slate-200 pt-6">
                <Button
                    variant="outline"
                    onClick={() =>
                        dispatch(
                            setAssessmentStep(
                                1
                            )
                        )
                    }
                >
                    Back
                </Button>

                <Button
                    loading={isStarting}
                    disabled={
                        selectedUserSkills.length ===
                        0
                    }
                    onClick={
                        handleContinue
                    }
                >
                    I Have Completed the
                    Assessments
                </Button>
            </div>

            {startError && (
                <p className="mt-4 text-right text-sm text-red-500">
                    We couldn't start your
                    assessment. Please try again.
                </p>
            )}
        </div>
    );
};

export default AssessmentGuideStep;
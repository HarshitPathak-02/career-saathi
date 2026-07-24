import {
    AlertCircle,
    Brain,
} from "lucide-react";

import Button from "../../../components/ui/Button/Button";

import {
    useAppDispatch,
    useAppSelector,
} from "../../../app/hooks";

import {
    setAssessmentStep,
    toggleSelectedSkill,
} from "../slice/initialAssessmentSlice";

import {
    useInitializeUserSkillsMutation,
} from "../api/initialAssessmentApi";

import {
    useGetCareerRoleSkillsQuery,
} from "../../career-setup/api/careerSetupApi";

import SkillSelectionCard from "./SkillSelectionCard";

interface SkillSelectionStepProps {
    careerJourneyId: string;
    roleId: string;
}

const SkillSelectionStep = ({
    careerJourneyId,
    roleId,
}: SkillSelectionStepProps) => {
    const dispatch = useAppDispatch();

    const selectedSkillCatalogIds =
        useAppSelector(
            (state) =>
                state.initialAssessment
                    .selectedSkillCatalogIds
        );

    /*
     * Reuse existing Career Setup lookup API.
     *
     * GET /lookup/career-roles/:roleId/skills
     */
    const {
        data,
        isLoading,
        isError,
        refetch,
    } = useGetCareerRoleSkillsQuery(
        roleId,
    );

    const [
        initializeUserSkills,
        {
            isLoading: isInitializing,
            error: initializeError,
        },
    ] = useInitializeUserSkillsMutation();

    const skills =
        data?.data ?? [];

    const handleContinue = async () => {
        if (
            selectedSkillCatalogIds.length === 0
        ) {
            return;
        }

        try {
            /*
             * These IDs are SkillCatalog IDs.
             *
             * CareerRoleSkill.skillId points
             * to SkillCatalog.
             */
            await initializeUserSkills({
                careerJourneyId,
                selectedSkillCatalogIds,
            }).unwrap();

            dispatch(
                setAssessmentStep(2)
            );
        } catch {
            // RTK Query exposes the error below.
        }
    };

    if (isLoading) {
        return (
            <div className="py-16 text-center text-slate-600">
                Loading required skills...
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center py-16 text-center">
                <AlertCircle
                    size={36}
                    className="text-red-500"
                />

                <h3 className="mt-4 font-semibold text-slate-900">
                    Unable to load skills
                </h3>

                <p className="mt-2 text-sm text-slate-600">
                    We couldn't load the skills required
                    for your target role.
                </p>

                <Button
                    className="mt-5"
                    onClick={() => refetch()}
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
                        <Brain size={22} />
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-slate-900">
                            Which skills do you already know?
                        </h2>

                        <p className="mt-1 text-sm text-slate-600">
                            Select only the skills you have
                            already learned or practiced.
                        </p>
                    </div>
                </div>
            </div>

            <div className="mb-5 rounded-xl border border-blue-100 bg-blue-50 p-4">
                <p className="text-sm leading-6 text-blue-900">
                    These skills are required for your
                    target role. Select the skills you
                    already know. Your assessment will
                    evaluate your current level in those
                    skills.
                </p>
            </div>

            {skills.length === 0 ? (
                <div className="rounded-xl border border-slate-200 p-8 text-center text-slate-600">
                    No skills are configured for this role.
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2">
                    {skills.map((skill) => (
                        <SkillSelectionCard
                            key={skill.skillId}
                            skill={skill}
                            selected={
                                selectedSkillCatalogIds.includes(
                                    skill.skillId
                                )
                            }
                            onToggle={(skillId) =>
                                dispatch(
                                    toggleSelectedSkill(
                                        skillId
                                    )
                                )
                            }
                        />
                    ))}
                </div>
            )}

            <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-6">
                <p className="text-sm text-slate-600">
                    <span className="font-semibold text-slate-900">
                        {
                            selectedSkillCatalogIds.length
                        }
                    </span>{" "}
                    skills selected
                </p>

                <Button
                    disabled={
                        selectedSkillCatalogIds.length ===
                        0
                    }
                    loading={isInitializing}
                    onClick={handleContinue}
                >
                    Continue
                </Button>
            </div>

            {initializeError && (
                <p className="mt-4 text-right text-sm text-red-500">
                    We couldn't save your skill selection.
                    Please try again.
                </p>
            )}
        </div>
    );
};

export default SkillSelectionStep;
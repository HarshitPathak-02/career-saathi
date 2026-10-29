import {
    Navigate,
} from "react-router-dom";

import Button from "../../../components/ui/Button/Button";

import {
    useAppDispatch,
    useAppSelector,
} from "../../../app/hooks";

import {
    setAssessmentStep,
} from "../slice/initialAssessmentSlice";

import {
    useGetWorkspaceQuery,
} from "../../workspace/api/workspaceApi";

import AssessmentStepIndicator from "../components/AssessmentStepIndicator";
import ResumeOnboardingStep from "../components/ResumeOnboardingStep";
import SkillSelectionStep from "../components/SkillSelectionStep";
import AssessmentGuideStep from "../components/AssessmentGuideStep";
import AssessmentScoreStep from "../components/AssessmentScoreStep";

const InitialAssessmentPage = () => {

    const currentStep =
        useAppSelector(
            (state) =>
                state.initialAssessment.currentStep
        );

    const dispatch =
        useAppDispatch();

    const handleGoBackToResume = () => {
        dispatch(
            setAssessmentStep(0)
        );
    };

    const {
        data,
        isLoading,
        isError,
        refetch,
    } = useGetWorkspaceQuery();

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <p className="text-slate-600">
                    Preparing your assessment...
                </p>
            </div>
        );
    }

    if (
        isError ||
        !data?.data
    ) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
                <div className="text-center">
                    <h2 className="text-lg font-semibold text-slate-900">
                        Unable to prepare assessment
                    </h2>

                    <p className="mt-2 text-sm text-slate-600">
                        We couldn't load your career
                        journey.
                    </p>

                    <button
                        type="button"
                        onClick={() => refetch()}
                        className="mt-5 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const workspace = data.data;

    /*
     * The initial assessment should only
     * be available while the workspace
     * expects an initial assessment.
     */
    if (
        workspace.workspaceState !==
        "initial_assessment"
    ) {
        return (
            <Navigate
                to="/workspace"
                replace
            />
        );
    }

    const careerJourneyId =
        workspace.careerJourney.id;

    const roleId =
        workspace.careerJourney.roleId;


    return (
        <div className="min-h-screen bg-slate-50">
            <div className="mx-auto max-w-5xl px-6 py-10">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
                    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <span className="text-sm font-semibold text-indigo-600">
                                Initial Assessment
                            </span>

                            <h1 className="mt-2 text-2xl font-bold text-slate-900 md:text-3xl">
                                Let's understand your current
                                skills
                            </h1>

                            <p className="mt-2 max-w-2xl leading-7 text-slate-600">
                                Your assessment helps CareerSaathi
                                understand your strengths and
                                identify what should be prioritized
                                in your personalized roadmap.
                            </p>
                        </div>

                        {currentStep > 0 && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={
                                    handleGoBackToResume
                                }
                            >
                                Back to resume
                            </Button>
                        )}
                    </div>

                    <AssessmentStepIndicator
                        currentStep={currentStep}
                    />

                    {currentStep === 0 && (
                        <ResumeOnboardingStep
                            careerJourneyId={
                                careerJourneyId
                            }
                        />
                    )}

                    {currentStep === 1 && (
                        <SkillSelectionStep
                            careerJourneyId={
                                careerJourneyId
                            }
                            roleId={
                                roleId
                            }
                        />
                    )}

                    {currentStep === 2 && (
                        <AssessmentGuideStep
                            careerJourneyId={careerJourneyId}
                            roleId={roleId}
                        />
                    )}

                    {currentStep === 3 && (
                        <AssessmentScoreStep
                            careerJourneyId={careerJourneyId}
                            roleId={roleId}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default InitialAssessmentPage;
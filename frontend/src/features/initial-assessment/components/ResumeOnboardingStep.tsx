import {
    ArrowRight,
    FileText,
} from "lucide-react";

import Button from "../../../components/ui/Button/Button";

import {
    useAppDispatch,
} from "../../../app/hooks";

import { ResumeSkillsCard } from "../../resume";

import type { Resume } from "../../resume/types/resume.types";

import {
    setAssessmentStep,
    setSelectedSkills,
} from "../slice/initialAssessmentSlice";

interface ResumeOnboardingStepProps {
    careerJourneyId: string;
}

const ResumeOnboardingStep = ({
    careerJourneyId,
}: ResumeOnboardingStepProps) => {
    const dispatch =
        useAppDispatch();

    const handleConfirmed = (
        resume: Resume
    ) => {
        dispatch(
            setSelectedSkills(
                resume.confirmation?.skillCatalogIds ?? []
            )
        );

        dispatch(
            setAssessmentStep(2)
        );
    };

    return (
        <div>
            <div className="mb-6 flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <FileText size={22} />
                </div>

                <div>
                    <h2 className="text-xl font-semibold text-slate-900">
                        Start with your resume
                    </h2>

                    <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">
                        We can use your resume to prefill
                        the skills for your initial
                        assessment. Upload it now, or skip
                        and select your skills manually.
                    </p>
                </div>
            </div>

            <ResumeSkillsCard
                careerJourneyId={
                    careerJourneyId
                }
                mode="onboarding"
                onConfirmed={
                    handleConfirmed
                }
            />

            <div className="mt-6 flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm leading-6 text-slate-600">
                    No resume handy? You can choose the
                    skills you already know on the next
                    step.
                </p>

                <Button
                    variant="outline"
                    onClick={() =>
                        dispatch(
                            setAssessmentStep(1)
                        )
                    }
                    className="shrink-0"
                >
                    <span className="inline-flex items-center gap-2">
                        Select skills manually
                        <ArrowRight size={16} />
                    </span>
                </Button>
            </div>
        </div>
    );
};

export default ResumeOnboardingStep;

import { Check } from "lucide-react";

import type {
    InitialAssessmentStep,
} from "../slice/initialAssessmentSlice";

interface AssessmentStepIndicatorProps {
    currentStep: InitialAssessmentStep;
}

const steps = [
    {
        step: 0,
        label: "Resume",
    },
    {
        step: 1,
        label: "Select Skills",
    },
    {
        step: 2,
        label: "Take Assessment",
    },
    {
        step: 3,
        label: "Assessment",
    },
] as const;

const AssessmentStepIndicator = ({
    currentStep,
}: AssessmentStepIndicatorProps) => {
    return (
        <div className="mb-10">
            <div className="flex items-start">
                {steps.map(
                    ({ step, label }, index) => {
                        const completed =
                            step < currentStep;

                        const active =
                            step === currentStep;

                        return (
                            <div
                                key={step}
                                className="flex flex-1 items-start"
                            >
                                <div className="flex flex-col items-center">
                                    <div
                                        className={`
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-full
                      text-sm
                      font-semibold
                      transition

                      ${completed
                                                ? "bg-indigo-600 text-white"
                                                : active
                                                    ? "border-2 border-indigo-600 bg-indigo-50 text-indigo-700"
                                                    : "border border-slate-300 bg-white text-slate-500"
                                            }
                    `}
                                    >
                                        {completed ? (
                                            <Check size={17} />
                                        ) : (
                                            index + 1
                                        )}
                                    </div>

                                    <span
                                        className={`
                      mt-2
                      text-center
                      text-xs
                      font-medium

                      ${active
                                                ? "text-indigo-700"
                                                : completed
                                                    ? "text-slate-800"
                                                    : "text-slate-400"
                                            }
                    `}
                                    >
                                        {label}
                                    </span>
                                </div>

                                {index <
                                    steps.length - 1 && (
                                        <div
                                            className={`
                      mt-4
                      h-px
                      flex-1

                      ${step <
                                                    currentStep
                                                    ? "bg-indigo-500"
                                                    : "bg-slate-200"
                                                }
                    `}
                                        />
                                    )}
                            </div>
                        );
                    }
                )}
            </div>
        </div>
    );
};

export default AssessmentStepIndicator;

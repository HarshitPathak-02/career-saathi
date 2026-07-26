import {
    Check,
} from "lucide-react";

interface WeeklyReviewStepperProps {
    currentStep: number;
}

const steps = [
    {
        number: 1,
        label: "Review",
    },
    {
        number: 2,
        label: "Assessment",
    },
    {
        number: 3,
        label: "Reflection",
    },
];

export default function WeeklyReviewStepper({
    currentStep,
}: WeeklyReviewStepperProps) {

    return (

        <div className="flex items-center">

            {steps.map(
                (step, index) => {

                    const completed =
                        currentStep >
                        step.number;

                    const active =
                        currentStep ===
                        step.number;

                    return (

                        <div
                            key={step.number}
                            className="flex flex-1 items-center"
                        >

                            <div className="flex flex-col items-center">

                                <div
                                    className={`
                                        flex
                                        h-10
                                        w-10
                                        items-center
                                        justify-center
                                        rounded-full
                                        text-sm
                                        font-semibold
                                        transition
                                        ${completed ||
                                            active
                                            ? "bg-slate-900 text-white"
                                            : "bg-slate-100 text-slate-500"
                                        }
                                    `}
                                >

                                    {completed ? (

                                        <Check size={18} />

                                    ) : (

                                        step.number

                                    )}

                                </div>

                                <span
                                    className={`
                                        mt-2
                                        text-xs
                                        font-medium
                                        ${active
                                            ? "text-slate-900"
                                            : "text-slate-500"
                                        }
                                    `}
                                >

                                    {step.label}

                                </span>

                            </div>

                            {index <
                                steps.length - 1 && (

                                    <div
                                        className={`
                                        mx-3
                                        h-0.5
                                        flex-1
                                        ${currentStep >
                                                step.number
                                                ? "bg-slate-900"
                                                : "bg-slate-200"
                                            }
                                    `}
                                    />

                                )}

                        </div>

                    );

                },
            )}

        </div>

    );

} 
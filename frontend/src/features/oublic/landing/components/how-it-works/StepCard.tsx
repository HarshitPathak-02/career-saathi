import { ArrowRight } from "lucide-react";
import { type Step } from "./steps";

interface StepCardProps {
  step: Step;
  isLast?: boolean;
}

const StepCard = ({ step, isLast }: StepCardProps) => {
  const Icon = step.icon;

  return (
    <div className="relative flex flex-col items-center">
      <div className="group rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50">
          <Icon className="h-7 w-7 text-blue-600" />
        </div>

        <span className="text-sm font-semibold text-blue-600">
          Step {step.id}
        </span>

        <h3 className="mt-2 text-xl font-bold text-slate-900">
          {step.title}
        </h3>

        <p className="mt-4 leading-7 text-slate-600">
          {step.description}
        </p>
      </div>

      {!isLast && (
        <ArrowRight
          className="absolute -right-10 top-1/2 hidden h-6 w-6 -translate-y-1/2 text-slate-400 lg:block"
        />
      )}
    </div>
  );
};

export default StepCard;
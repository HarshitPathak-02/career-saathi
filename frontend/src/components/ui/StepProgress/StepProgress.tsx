// components/progress/StepProgress.tsx

interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
}

const StepProgress = ({
  currentStep,
  totalSteps,
}: StepProgressProps) => {

  const progress =
    (currentStep / totalSteps) * 100;

  return (
    <div>

      <div className="flex justify-between mb-2">

        <span className="text-sm font-medium text-slate-600">
          Step {currentStep} of {totalSteps}
        </span>

        <span className="text-sm font-medium text-indigo-600">
          {Math.round(progress)}%
        </span>

      </div>

      <div className="h-2 rounded-full bg-slate-200 overflow-hidden">

        <div
          className="h-full rounded-full bg-indigo-600 transition-all duration-300"
          style={{
            width: `${progress}%`,
          }}
        />

      </div>

    </div>
  );
};

export default StepProgress;
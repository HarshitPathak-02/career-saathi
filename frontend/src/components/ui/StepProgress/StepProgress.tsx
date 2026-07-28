// components/ui/StepProgress/StepProgress.tsx

interface StepProgressProps {

  currentStep: number;

  totalSteps: number;

}

const StepProgress = ({

  currentStep,

  totalSteps,

}: StepProgressProps) => {

  /*
  |--------------------------------------------------------------------------
  | Progress
  |--------------------------------------------------------------------------
  */

  const safeCurrentStep =
    Math.min(
      Math.max(
        currentStep,
        1
      ),
      totalSteps
    );

  const progress =
    (
      safeCurrentStep /
      totalSteps
    ) * 100;


  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

  return (

    <div className="w-full">

      {/* Meta */}

      <div
        className="
                    mb-3
                    flex
                    items-center
                    justify-between
                    gap-4
                "
      >

        <div>

          <p
            className="
                            text-sm
                            font-semibold
                            text-slate-700
                        "
          >

            Step {safeCurrentStep} of {totalSteps}

          </p>

          <p
            className="
                            mt-0.5
                            hidden
                            text-xs
                            text-slate-500
                            sm:block
                        "
          >

            Complete your career profile

          </p>

        </div>


        <span
          className="
                        rounded-full
                        bg-indigo-50
                        px-3
                        py-1
                        text-xs
                        font-semibold
                        text-indigo-700
                    "
        >

          {Math.round(
            progress
          )}% complete

        </span>

      </div>


      {/* Progress Track */}

      <div
        className="
                    h-2
                    w-full
                    overflow-hidden
                    rounded-full
                    bg-slate-200
                "
        role="progressbar"
        aria-valuenow={
          Math.round(progress)
        }
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Career setup progress"
      >

        <div
          className="
                        h-full
                        rounded-full
                        bg-indigo-600
                        transition-[width]
                        duration-500
                        ease-out
                    "
          style={{
            width:
              `${progress}%`,
          }}
        />

      </div>

    </div>

  );

};

export default StepProgress;
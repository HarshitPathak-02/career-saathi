// components/buttons/NavigationButtons.tsx

interface NavigationButtonsProps {
  onBack?: () => void;
  onNext?: () => void;

  disableNext?: boolean;

  backLabel?: string;
  nextLabel?: string;
}

const NavigationButtons = ({
  onBack,
  onNext,
  disableNext = false,
  backLabel = "Back",
  nextLabel = "Continue",
}: NavigationButtonsProps) => {

  return (
    <div className="mt-10 flex justify-between">

      <button
        onClick={onBack}
        className="rounded-lg border px-6 py-3 hover:bg-slate-100"
      >
        {backLabel}
      </button>

      <button
        disabled={disableNext}
        onClick={onNext}
        className="rounded-lg bg-indigo-600 px-6 py-3 text-white disabled:opacity-50"
      >
        {nextLabel}
      </button>

    </div>
  );
};

export default NavigationButtons;
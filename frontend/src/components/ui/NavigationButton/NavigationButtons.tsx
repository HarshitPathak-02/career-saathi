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

    <div
      className="
                mt-10
                flex
                flex-col-reverse
                gap-3
                border-t
                border-slate-100
                pt-6
                sm:flex-row
                sm:items-center
                sm:justify-between
            "
    >

      {/* Back */}

      <button

        type="button"

        onClick={
          onBack
        }

        className="
                    inline-flex
                    min-h-11
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-slate-300
                    bg-white
                    px-6
                    py-2.5
                    text-sm
                    font-semibold
                    text-slate-700
                    transition-all
                    duration-200
                    hover:border-slate-400
                    hover:bg-slate-50
                    focus:outline-none
                    focus:ring-2
                    focus:ring-slate-300
                    focus:ring-offset-2
                "
      >

        {backLabel}

      </button>


      {/* Continue */}

      <button

        type="button"

        disabled={
          disableNext
        }

        onClick={
          onNext
        }

        className="
                    inline-flex
                    min-h-11
                    items-center
                    justify-center
                    rounded-xl
                    bg-indigo-600
                    px-7
                    py-2.5
                    text-sm
                    font-semibold
                    text-white
                    shadow-sm
                    transition-all
                    duration-200
                    hover:bg-indigo-700
                    focus:outline-none
                    focus:ring-2
                    focus:ring-indigo-500
                    focus:ring-offset-2
                    disabled:cursor-not-allowed
                    disabled:bg-slate-200
                    disabled:text-slate-400
                    disabled:shadow-none
                    disabled:hover:bg-slate-200
                "
      >

        {nextLabel}

      </button>

    </div>

  );

};

export default NavigationButtons;
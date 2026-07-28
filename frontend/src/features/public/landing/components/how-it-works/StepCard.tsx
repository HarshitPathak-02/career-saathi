import type {
  Step,
} from "./steps";

interface StepCardProps {

  step: Step;

}

const StepCard = ({

  step,

}: StepCardProps) => {

  const Icon =
    step.icon;

  return (

    <article
      className="
                group
                relative
                z-10
                flex
                h-full
                flex-col
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-6
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-indigo-200
                hover:shadow-xl
                hover:shadow-slate-200/60
            "
    >

      {/* Step + Icon */}

      <div
        className="
                    flex
                    items-center
                    justify-between
                "
      >

        <div
          className="
                        flex
                        h-12
                        w-12
                        items-center
                        justify-center
                        rounded-xl
                        bg-indigo-50
                        text-indigo-600
                        transition
                        group-hover:bg-indigo-600
                        group-hover:text-white
                    "
        >

          <Icon
            size={23}
            strokeWidth={1.8}
          />

        </div>

        <span
          className="
                        text-sm
                        font-semibold
                        text-slate-400
                    "
        >

          0{step.id}

        </span>

      </div>

      {/* Content */}

      <div className="mt-6">

        <p
          className="
                        text-xs
                        font-semibold
                        uppercase
                        tracking-[0.14em]
                        text-indigo-600
                    "
        >

          Step {step.id}

        </p>

        <h3
          className="
                        mt-2
                        text-lg
                        font-bold
                        leading-7
                        text-slate-950
                    "
        >

          {step.title}

        </h3>

        <p
          className="
                        mt-3
                        text-sm
                        leading-6
                        text-slate-600
                    "
        >

          {step.description}

        </p>

      </div>

    </article>

  );

};

export default StepCard;
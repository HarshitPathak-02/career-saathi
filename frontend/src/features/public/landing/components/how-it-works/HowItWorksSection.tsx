import StepCard
  from "./StepCard";

import {
  STEPS,
} from "./steps";

const HowItWorksSection = () => {

  const primarySteps =
    STEPS.slice(
      0,
      3
    );

  const adaptiveSteps =
    STEPS.slice(
      3
    );

  return (

    <section
      id="how-it-works"
      className="
                relative
                overflow-hidden
                bg-slate-50
                py-24
                lg:py-32
            "
    >

      <div
        className="
                    mx-auto
                    max-w-360
                    px-6
                    xl:px-10
                "
      >

        {/* Section Header */}

        <div
          className="
                        mx-auto
                        max-w-3xl
                        text-center
                    "
        >

          <span
            className="
                            inline-flex
                            rounded-full
                            border
                            border-indigo-200
                            bg-indigo-50
                            px-4
                            py-2
                            text-sm
                            font-semibold
                            text-indigo-700
                        "
          >

            How CareerSaathi Works

          </span>

          <h2
            className="
                            mt-6
                            text-4xl
                            font-bold
                            tracking-tight
                            text-slate-950
                            sm:text-5xl
                        "
          >

            From career confusion to a

            <span className="text-indigo-600">
              {" "}clear weekly direction.
            </span>

          </h2>

          <p
            className="
                            mx-auto
                            mt-6
                            max-w-2xl
                            text-lg
                            leading-8
                            text-slate-600
                        "
          >

            CareerSaathi doesn't hand you a
            generic roadmap and leave you to
            figure out the rest. It turns your
            career goal into an ongoing system
            of planning, execution, assessment,
            reflection, and improvement.

          </p>

        </div>

        {/* First Three Steps */}

        <div
          className="
                        relative
                        mx-auto
                        mt-16
                        grid
                        max-w-5xl
                        gap-6
                        md:grid-cols-3
                    "
        >

          {/* Connecting Line */}

          <div
            className="
                            absolute
                            left-[16%]
                            right-[16%]
                            top-6
                            hidden
                            h-px
                            bg-slate-300
                            md:block
                        "
          />

          {primarySteps.map(
            step => (

              <StepCard
                key={step.id}
                step={step}
              />

            )
          )}

        </div>

        {/* Transition */}

        <div
          className="
                        mx-auto
                        my-10
                        flex
                        max-w-5xl
                        items-center
                        gap-4
                    "
        >

          <div
            className="
                            h-px
                            flex-1
                            bg-slate-200
                        "
          />

          <p
            className="
                            text-center
                            text-xs
                            font-semibold
                            uppercase
                            tracking-[0.16em]
                            text-slate-400
                        "
          >

            Then CareerSaathi learns from your week

          </p>

          <div
            className="
                            h-px
                            flex-1
                            bg-slate-200
                        "
          />

        </div>

        {/* Assessment + Adaptation */}

        <div
          className="
                        mx-auto
                        grid
                        max-w-3xl
                        gap-6
                        md:grid-cols-2
                    "
        >

          {adaptiveSteps.map(
            step => (

              <StepCard
                key={step.id}
                step={step}
              />

            )
          )}

        </div>

        {/* Closing Statement */}

        <div
          className="
                        mx-auto
                        mt-12
                        max-w-3xl
                        rounded-2xl
                        border
                        border-indigo-100
                        bg-indigo-50/70
                        px-6
                        py-5
                        text-center
                    "
        >

          <p
            className="
                            text-sm
                            font-medium
                            leading-6
                            text-slate-700
                        "
          >

            Every week becomes input for the
            next one — so your career plan
            evolves with your actual progress,
            not just the plan you started with.

          </p>

        </div>

      </div>

    </section>

  );

};

export default HowItWorksSection;
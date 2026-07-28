import {
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

const CTASection = () => {

  return (

    <section
      className="
                bg-white
                py-24
                lg:py-32
            "
    >

      <div
        className="
                    mx-auto
                    max-w-[1440px]
                    px-6
                    xl:px-10
                "
      >

        <div
          className="
                        relative
                        overflow-hidden
                        rounded-3xl
                        bg-slate-950
                        px-6
                        py-16
                        sm:px-10
                        lg:px-16
                        lg:py-20
                    "
        >

          {/* Subtle Background Decoration */}

          <div
            className="
                            pointer-events-none
                            absolute
                            -right-24
                            -top-24
                            h-80
                            w-80
                            rounded-full
                            bg-indigo-600/20
                            blur-3xl
                        "
          />

          <div
            className="
                            pointer-events-none
                            absolute
                            -bottom-32
                            -left-20
                            h-72
                            w-72
                            rounded-full
                            bg-indigo-500/10
                            blur-3xl
                        "
          />

          {/* Content */}

          <div
            className="
                            relative
                            z-10
                            mx-auto
                            max-w-4xl
                            text-center
                        "
          >

            <span
              className="
                                inline-flex
                                rounded-full
                                border
                                border-white/10
                                bg-white/5
                                px-4
                                py-2
                                text-sm
                                font-semibold
                                text-indigo-200
                            "
            >

              Your Career Deserves a Clear Plan

            </span>

            <h2
              className="
                                mx-auto
                                mt-6
                                max-w-3xl
                                text-4xl
                                font-bold
                                tracking-tight
                                text-white
                                sm:text-5xl
                                lg:text-6xl
                            "
            >

              Stop guessing what to do next.

              <span className="text-indigo-300">
                {" "}Start building toward where you want to go.
              </span>

            </h2>

            <p
              className="
                                mx-auto
                                mt-6
                                max-w-2xl
                                text-base
                                leading-7
                                text-slate-300
                                sm:text-lg
                                sm:leading-8
                            "
            >

              Tell CareerSaathi your goal.
              Get a personalized roadmap,
              follow focused weekly missions,
              measure your progress, and let
              every week shape what comes next.

            </p>

            {/* Supporting Points */}

            <div
              className="
                                mt-8
                                flex
                                flex-wrap
                                items-center
                                justify-center
                                gap-x-7
                                gap-y-3
                            "
            >

              <div
                className="
                                    flex
                                    items-center
                                    gap-2
                                    text-sm
                                    font-medium
                                    text-slate-300
                                "
              >

                <CheckCircle2
                  size={17}
                  className="text-indigo-300"
                />

                Personalized roadmap

              </div>

              <div
                className="
                                    flex
                                    items-center
                                    gap-2
                                    text-sm
                                    font-medium
                                    text-slate-300
                                "
              >

                <CheckCircle2
                  size={17}
                  className="text-indigo-300"
                />

                Weekly missions

              </div>

              <div
                className="
                                    flex
                                    items-center
                                    gap-2
                                    text-sm
                                    font-medium
                                    text-slate-300
                                "
              >

                <CheckCircle2
                  size={17}
                  className="text-indigo-300"
                />

                Adaptive progress

              </div>

            </div>

            {/* CTA */}

            <div
              className="
                                mt-10
                                flex
                                justify-center
                            "
            >

              <Link
                to="/register"
                className="
                                    group
                                    inline-flex
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-xl
                                    bg-white
                                    px-7
                                    py-3.5
                                    text-sm
                                    font-semibold
                                    text-slate-950
                                    shadow-sm
                                    transition
                                    hover:bg-slate-100
                                "
              >

                Start Your Journey

                <ArrowRight
                  size={18}
                  className="
                                        transition-transform
                                        group-hover:translate-x-1
                                    "
                />

              </Link>

            </div>

            <p
              className="
                                mt-5
                                text-xs
                                text-slate-500
                            "
            >

              Start by telling CareerSaathi
              where you want your career to go.

            </p>

          </div>

        </div>

      </div>

    </section>

  );

};

export default CTASection;
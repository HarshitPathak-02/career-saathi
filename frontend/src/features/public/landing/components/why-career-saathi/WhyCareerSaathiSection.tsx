import {
  CheckCircle2,
} from "lucide-react";

import FeatureCard
  from "./FeatureCard";

import {
  FEATURES,
} from "./features";

const WhyCareerSaathiSection = () => {

  return (

    <section
      id="product"
      className="
                relative
                bg-white
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

        {/* Header */}

        <div
          className="
                        grid
                        gap-10
                        lg:grid-cols-[1fr_0.8fr]
                        lg:items-end
                    "
        >

          <div>

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

              The CareerSaathi Experience

            </span>

            <h2
              className="
                                mt-6
                                max-w-3xl
                                text-4xl
                                font-bold
                                tracking-tight
                                text-slate-950
                                sm:text-5xl
                            "
            >

              More than a roadmap.

              <span className="text-indigo-600">
                {" "}A system that moves with you.
              </span>

            </h2>

          </div>

          <div>

            <p
              className="
                                text-lg
                                leading-8
                                text-slate-600
                            "
            >

              Career growth rarely follows a
              perfect plan. Your pace changes,
              some concepts take longer, and
              some weeks go better than others.
              CareerSaathi is designed around
              that reality.

            </p>

          </div>

        </div>

        {/* Product Principles */}

        <div
          className="
                        mt-10
                        flex
                        flex-wrap
                        gap-x-8
                        gap-y-3
                        border-y
                        border-slate-200
                        py-5
                    "
        >

          <div
            className="
                            flex
                            items-center
                            gap-2
                            text-sm
                            font-medium
                            text-slate-600
                        "
          >

            <CheckCircle2
              size={17}
              className="text-indigo-600"
            />

            Built around your career goal

          </div>

          <div
            className="
                            flex
                            items-center
                            gap-2
                            text-sm
                            font-medium
                            text-slate-600
                        "
          >

            <CheckCircle2
              size={17}
              className="text-indigo-600"
            />

            Structured around consistent action

          </div>

          <div
            className="
                            flex
                            items-center
                            gap-2
                            text-sm
                            font-medium
                            text-slate-600
                        "
          >

            <CheckCircle2
              size={17}
              className="text-indigo-600"
            />

            Adapted through real performance

          </div>

        </div>

        {/* Features */}

        <div
          className="
                        mt-14
                        grid
                        gap-6
                        md:grid-cols-2
                    "
        >

          {FEATURES.map(
            feature => (

              <FeatureCard
                key={
                  feature.title
                }
                feature={
                  feature
                }
              />

            )
          )}

        </div>

      </div>

    </section>

  );

};

export default WhyCareerSaathiSection;
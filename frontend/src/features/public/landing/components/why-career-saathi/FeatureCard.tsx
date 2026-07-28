import {
  ArrowUpRight,
} from "lucide-react";

import type {
  Feature,
} from "./features";

interface FeatureCardProps {

  feature: Feature;

}

const FeatureCard = ({

  feature,

}: FeatureCardProps) => {

  const Icon =
    feature.icon;

  return (

    <article
      className="
                group
                relative
                overflow-hidden
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-7
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-indigo-200
                hover:shadow-xl
                hover:shadow-slate-200/60
                sm:p-8
            "
    >

      {/* Top */}

      <div
        className="
                    flex
                    items-start
                    justify-between
                    gap-4
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
                        duration-300
                        group-hover:bg-indigo-600
                        group-hover:text-white
                    "
        >

          <Icon
            size={23}
            strokeWidth={1.8}
          />

        </div>

        <ArrowUpRight
          size={20}
          className="
                        text-slate-300
                        transition
                        duration-300
                        group-hover:-translate-y-0.5
                        group-hover:translate-x-0.5
                        group-hover:text-indigo-600
                    "
        />

      </div>

      {/* Content */}

      <div className="mt-7">

        <p
          className="
                        text-xs
                        font-semibold
                        uppercase
                        tracking-[0.14em]
                        text-indigo-600
                    "
        >

          {feature.highlight}

        </p>

        <h3
          className="
                        mt-2
                        text-xl
                        font-bold
                        tracking-tight
                        text-slate-950
                    "
        >

          {feature.title}

        </h3>

        <p
          className="
                        mt-4
                        max-w-xl
                        leading-7
                        text-slate-600
                    "
        >

          {feature.description}

        </p>

      </div>

      {/* Bottom Accent */}

      <div
        className="
                    absolute
                    bottom-0
                    left-0
                    h-1
                    w-0
                    bg-indigo-600
                    transition-all
                    duration-300
                    group-hover:w-full
                "
      />

    </article>

  );

};

export default FeatureCard;
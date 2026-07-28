// components/ui/SelectionCard/SelectionCard.tsx

import {
  type ReactNode,
} from "react";

interface SelectionCardProps {

  title: string;

  description?: string;

  badge?: string;

  icon?: ReactNode;

  selected?: boolean;

  disabled?: boolean;

  onClick?: () => void;

}

const SelectionCard = ({

  title,

  description,

  badge,

  icon,

  selected = false,

  disabled = false,

  onClick,

}: SelectionCardProps) => {

  return (

    <button

      type="button"

      disabled={
        disabled
      }

      onClick={
        onClick
      }

      aria-pressed={
        selected
      }

      className={`
                group
                relative
                w-full
                overflow-hidden
                rounded-2xl
                border
                p-6
                text-left
                transition-all
                duration-200
                sm:p-7

                ${selected
          ? `
                            border-indigo-500
                            bg-indigo-50/60
                            shadow-sm
                            ring-1
                            ring-indigo-500
                        `
          : `
                            border-slate-200
                            bg-white
                        `
        }

                ${disabled
          ? `
                            cursor-not-allowed
                            border-slate-200
                            bg-slate-50
                            opacity-70
                        `
          : `
                            cursor-pointer
                            hover:-translate-y-0.5
                            hover:border-indigo-300
                            hover:shadow-md
                            focus:outline-none
                            focus:ring-2
                            focus:ring-indigo-500
                            focus:ring-offset-2
                        `
        }
            `}
    >

      {/* Selected Indicator */}

      {selected && !disabled && (

        <div
          className="
                        absolute
                        right-5
                        top-5
                        flex
                        h-6
                        w-6
                        items-center
                        justify-center
                        rounded-full
                        bg-indigo-600
                        text-xs
                        font-bold
                        text-white
                    "
          aria-hidden="true"
        >

          ✓

        </div>

      )}


      {/* Icon */}

      {icon && (

        <div
          className={`
                        mb-5
                        flex
                        h-14
                        w-14
                        items-center
                        justify-center
                        rounded-xl
                        transition-colors

                        ${disabled
              ? `
                                    bg-slate-100
                                    text-slate-400
                                `
              : selected
                ? `
                                        bg-indigo-100
                                        text-indigo-600
                                    `
                : `
                                        bg-slate-50
                                        text-slate-600
                                        group-hover:bg-indigo-50
                                        group-hover:text-indigo-600
                                    `
            }
                    `}
        >

          {icon}

        </div>

      )}


      {/* Title */}

      <div className="flex flex-wrap items-center gap-3">

        <h3
          className={`
                        text-lg
                        font-semibold
                        tracking-tight
                        sm:text-xl

                        ${disabled
              ? "text-slate-500"
              : "text-slate-900"
            }
                    `}
        >

          {title}

        </h3>


        {/* Badge */}

        {badge && (

          <span
            className="
                            inline-flex
                            items-center
                            rounded-full
                            border
                            border-amber-200
                            bg-amber-50
                            px-2.5
                            py-1
                            text-xs
                            font-semibold
                            text-amber-700
                        "
          >

            {badge}

          </span>

        )}

      </div>


      {/* Description */}

      {description && (

        <p
          className={`
                        mt-3
                        text-sm
                        leading-6
                        sm:text-base
                        sm:leading-7

                        ${disabled
              ? "text-slate-400"
              : "text-slate-600"
            }
                    `}
        >

          {description}

        </p>

      )}

    </button>

  );

};

export default SelectionCard;
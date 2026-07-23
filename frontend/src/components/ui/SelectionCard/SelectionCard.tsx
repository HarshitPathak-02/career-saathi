// components/cards/SelectionCard.tsx

import { ReactNode } from "react";

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
      disabled={disabled}
      onClick={onClick}
      className={`
        w-full
        rounded-xl
        border-2
        p-6
        text-left
        transition-all

        ${
          selected
            ? "border-indigo-600 bg-indigo-50"
            : "border-slate-200 hover:border-indigo-400"
        }

        ${
          disabled
            ? "cursor-not-allowed opacity-50"
            : "cursor-pointer"
        }
      `}
    >

      {icon && (
        <div className="mb-4">
          {icon}
        </div>
      )}

      <h3 className="text-xl font-semibold">
        {title}
      </h3>

      {badge && (
  <span className="inline-block mt-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
    {badge}
  </span>
)}

      {description && (
        <p className="mt-2 text-slate-600">
          {description}
        </p>
      )}

    </button>
  );
};

export default SelectionCard;
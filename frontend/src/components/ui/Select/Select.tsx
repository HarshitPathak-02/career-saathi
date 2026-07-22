import { forwardRef } from "react";

import type { SelectProps } from "./Select.types";

const Select = forwardRef<
  HTMLSelectElement,
  SelectProps
>(
  (
    {
      className = "",
      error = false,
      options,
      ...props
    },
    ref
  ) => {
    return (
      <select
        ref={ref}
        className={`
          w-full
          rounded-lg
          border
          px-4
          py-2.5
          outline-none
          transition
          text-sm
          bg-white

          ${
            error
              ? "border-red-500"
              : "border-gray-300"
          }

          focus:ring-2
          focus:ring-blue-500

          ${className}
        `}
        {...props}
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
    );
  }
);

Select.displayName = "Select";

export default Select;
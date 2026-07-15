import { forwardRef } from "react";

import { type InputProps } from "./Input.types";

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", error = false, ...props }, ref) => {
    return (
      <input
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
      />
    );
  }
);

Input.displayName = "Input";

export default Input;
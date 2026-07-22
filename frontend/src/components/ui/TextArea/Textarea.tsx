import { forwardRef } from "react";

import { type TextareaProps } from "./Textarea.types";

const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaProps
>(({ className = "", error = false, ...props }, ref) => {
  return (
    <textarea
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
        resize-none

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
});

Textarea.displayName = "Textarea";

export default Textarea;
import { forwardRef } from "react";

import Select from "../Select/Select";

import type {
  SelectProps,
} from "../Select/Select.types";

interface FormSelectProps
  extends SelectProps {
  id: string;
  label: string;
  errorMessage?: string;
}

const FormSelect = forwardRef<
  HTMLSelectElement,
  FormSelectProps
>(
  (
    {
      id,
      label,
      errorMessage,
      ...props
    },
    ref
  ) => {
    return (
      <div className="space-y-1">
        <label
          htmlFor={id}
          className="block text-sm font-medium"
        >
          {label}
        </label>

        <Select
          id={id}
          ref={ref}
          error={!!errorMessage}
          {...props}
        />

        {errorMessage && (
          <p className="text-sm text-red-500">
            {errorMessage}
          </p>
        )}
      </div>
    );
  }
);

FormSelect.displayName = "FormSelect";

export default FormSelect;
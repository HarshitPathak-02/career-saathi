import { forwardRef } from "react";

import Select from "../Select/Select";

import type {
  SelectProps,
} from "../Select/Select.types";
import FormLabel from "./FormLabel";

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
        <FormLabel htmlFor={id}>
          {label}
        </FormLabel>

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
import {
  forwardRef,
} from "react";

import Select
  from "../Select/Select";

import FormLabel
  from "./FormLabel";

import FormError
  from "./FormError";

import type {
  SelectProps,
} from "../Select/Select.types";

interface FormSelectProps
  extends SelectProps {

  id: string;

  label: string;

  errorMessage?: string;

}

const FormSelect =
  forwardRef<
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

        <div>

          <FormLabel
            htmlFor={id}
          >

            {label}

          </FormLabel>

          <Select

            id={id}

            ref={ref}

            error={
              !!errorMessage
            }

            aria-invalid={
              !!errorMessage
            }

            aria-describedby={
              errorMessage
                ? `${id}-error`
                : undefined
            }

            {...props}

          />

          <FormError

            id={`${id}-error`}

            message={
              errorMessage
            }

          />

        </div>

      );

    }
  );

FormSelect.displayName =
  "FormSelect";

export default FormSelect;
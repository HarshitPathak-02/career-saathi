import Input from "../Input/Input";

import FormLabel from "./FormLabel";
import FormError from "./FormError";

import {
  type InputProps,
} from "../Input/Input.types";

interface FormFieldProps
  extends InputProps {

  label: string;

  errorMessage?: string;

}

const FormField = ({

  label,

  errorMessage,

  id,

  ...props

}: FormFieldProps) => {

  return (

    <div>

      <FormLabel
        htmlFor={id}
      >

        {label}

      </FormLabel>

      <Input

        id={id}

        error={
          !!errorMessage
        }

        aria-invalid={
          !!errorMessage
        }

        aria-describedby={
          errorMessage && id
            ? `${id}-error`
            : undefined
        }

        {...props}

      />

      <FormError

        id={
          id
            ? `${id}-error`
            : undefined
        }

        message={
          errorMessage
        }

      />

    </div>

  );

};

export default FormField;
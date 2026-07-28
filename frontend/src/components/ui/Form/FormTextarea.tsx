import Textarea
  from "../TextArea/Textarea";

import FormLabel
  from "./FormLabel";

import FormError
  from "./FormError";

import {
  type TextareaProps,
} from "../TextArea/Textarea.types";

interface FormTextareaProps
  extends TextareaProps {

  label: string;

  errorMessage?: string;

}

const FormTextarea = ({

  label,

  errorMessage,

  id,

  ...props

}: FormTextareaProps) => {

  return (

    <div>

      <FormLabel
        htmlFor={id}
      >

        {label}

      </FormLabel>

      <Textarea

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

export default FormTextarea;
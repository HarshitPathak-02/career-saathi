import Textarea from "../TextArea/Textarea";

import FormLabel from "./FormLabel";
import FormError from "./FormError";

import { type TextareaProps } from "../TextArea/Textarea.types";

interface Props extends TextareaProps {
  label: string;
  errorMessage?: string;
}

const FormTextarea = ({
  label,
  errorMessage,
  id,
  ...props
}: Props) => {
  return (
    <div className="mb-5">
      <FormLabel htmlFor={id}>
        {label}
      </FormLabel>

      <Textarea
        id={id}
        error={!!errorMessage}
        {...props}
      />

      <FormError
        message={errorMessage}
      />
    </div>
  );
};

export default FormTextarea;
import Input from "../Input/Input";

import FormLabel from "./FormLabel";

import FormError from "./FormError";

import { type InputProps } from "../Input/Input.types";

interface Props extends InputProps {
  label: string;

  errorMessage?: string;
}

const FormField = ({
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

      <Input
        id={id}
        error={!!errorMessage}
        {...props}
      />

      <FormError message={errorMessage} />
    </div>
  );
};

export default FormField;
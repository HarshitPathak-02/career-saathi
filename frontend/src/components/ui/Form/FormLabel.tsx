import { type LabelHTMLAttributes } from "react";

interface Props
  extends LabelHTMLAttributes<HTMLLabelElement> {}

const FormLabel = ({
  children,
  className = "",
  ...props
}: Props) => {
  return (
    <label
      className={`block mb-2 text-sm font-medium ${className}`}
      {...props}
    >
      {children}
    </label>
  );
};

export default FormLabel;
import {
  type LabelHTMLAttributes,
} from "react";

interface FormLabelProps
  extends LabelHTMLAttributes<HTMLLabelElement> { }

const FormLabel = ({

  children,

  className = "",

  ...props

}: FormLabelProps) => {

  return (

    <label

      className={`
                mb-2
                block
                text-sm
                font-medium
                text-slate-700
                ${className}
            `}

      {...props}

    >

      {children}

    </label>

  );

};

export default FormLabel;
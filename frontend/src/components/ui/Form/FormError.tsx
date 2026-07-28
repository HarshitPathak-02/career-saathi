import {
  type HTMLAttributes,
} from "react";

interface FormErrorProps
  extends HTMLAttributes<HTMLParagraphElement> {

  message?: string;

}

const FormError = ({

  message,

  className = "",

  ...props

}: FormErrorProps) => {

  if (!message) {
    return null;
  }

  return (

    <p

      className={`
                mt-1.5
                text-sm
                leading-5
                text-red-600
                ${className}
            `}

      role="alert"

      {...props}

    >

      {message}

    </p>

  );

};

export default FormError;
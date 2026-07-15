import { type HTMLAttributes } from "react";

const CardFooter = ({
  children,
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={`mt-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default CardFooter;
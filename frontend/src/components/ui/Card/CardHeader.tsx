import { type HTMLAttributes } from "react";

const CardHeader = ({
  children,
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={`mb-4 text-xl font-semibold ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default CardHeader;
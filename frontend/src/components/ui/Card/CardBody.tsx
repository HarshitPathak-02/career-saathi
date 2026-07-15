import { type HTMLAttributes } from "react";

const CardBody = ({
  children,
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={className}
      {...props}
    >
      {children}
    </div>
  );
};

export default CardBody;
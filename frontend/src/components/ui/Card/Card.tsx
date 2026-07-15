import { type CardProps } from "./Card.types";

const Card = ({
  children,
  className = "",
  ...props
}: CardProps) => {
  return (
    <div
      className={`
        rounded-xl
        border
        border-gray-200
        bg-white
        shadow-sm
        p-6
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
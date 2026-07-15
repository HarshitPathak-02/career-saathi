import { type ButtonProps } from "./Button.types";

const variantClasses = {
  primary:
    "bg-blue-600 hover:bg-blue-700 text-white",

  secondary:
    "bg-gray-700 hover:bg-gray-800 text-white",

  outline:
    "border border-gray-300 bg-white hover:bg-gray-100",

  danger:
    "bg-red-600 hover:bg-red-700 text-white",
};

const sizeClasses = {
  sm: "px-3 py-2 text-sm",

  md: "px-4 py-2",

  lg: "px-5 py-3 text-lg",
};

const Button = ({
  children,

  loading = false,

  variant = "primary",

  size = "md",

  fullWidth = false,

  className = "",

  disabled,

  ...props
}: ButtonProps) => {
  return (
    <button
      className={`
        rounded-lg
        font-medium
        transition
        duration-200
        cursor-pointer
        disabled:opacity-60
        disabled:cursor-not-allowed
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? "Loading..." : children}
    </button>
  );
};

export default Button;
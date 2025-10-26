import { forwardRef } from "react";

const Button = forwardRef(({ children, variant = "primary", size = "md", className = "", ...props }, ref) => {
  const baseClasses = "btn w-full sm:w-auto whitespace-nowrap";
  const variantClasses = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    danger: "btn-danger",
  };
  const sizeClasses = {
    sm: "px-2 py-1 text-sm",
    md: "px-3 py-1.5 text-base",
    lg: "px-4 py-2 text-lg",
  };

  return (
    <button
      ref={ref}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;

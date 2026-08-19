import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline" | "danger" | "success" | "warning";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      children,
      className = "",
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      "font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center";

    const variantStyles = {
      primary: "bg-primary hover:bg-primary-hover text-primary-foreground shadow-sm hover:shadow",
      secondary: "bg-info-100 border border-info hover:bg-info-600 text-white shadow-sm",
      ghost: "bg-transparent border border-info hover:bg-info-50 text-text-secondary hover:text-foreground",
      outline: "bg-transparent border border-secondary text-secondary-200 hover:bg-secondary-50",
      danger: "bg-danger hover:bg-danger-600 text-white shadow-sm",
      success: "bg-success hover:bg-success-600 text-white shadow-sm",
      warning: "bg-secondary hover:bg-secondary-hover text-secondary-foreground shadow-sm",
    } as const;

    const sizeStyles = {
      sm: "px-4 py-2 text-sm",
      md: "px-5 py-2.5 text-sm",
      lg: "px-6 py-3 text-base",
    } as const;

    return (
      <button
        ref={ref}
        className={`farmmart-button ${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? "Loading..." : children}
      </button>
    );
  },
);

Button.displayName = "Button";

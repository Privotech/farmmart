import React from "react";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "success" | "warning" | "danger" | "outline" | "secondary" | "info";
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = "primary",
  children,
  className = "",
  ...props
}) => {
  const variantStyles = {
    primary: "bg-primary text-white border border-primary-hover",
    success: "bg-success text-white border border-success-600",
    warning: "bg-warning text-white border border-warning-600",
    danger: "bg-danger text-white border border-danger-600",
    info: "bg-info text-white border border-info-600",
    outline: "border border-primary text-primary bg-transparent",
    secondary: "bg-primary-100 text-white border border-primary-hover",
  } as const;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

Badge.displayName = "Badge";

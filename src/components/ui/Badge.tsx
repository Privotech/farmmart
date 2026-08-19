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
    primary: "bg-primary-50 text-primary-700 border border-primary-200",
    success: "bg-success-50 text-success-700 border border-success-200",
    warning: "bg-warning-50 text-warning-700 border border-warning-200",
    danger: "bg-danger-50 text-danger-700 border border-danger-200",
    info: "bg-info-50 text-info-700 border border-info-200",
    outline: "border border-border text-text-secondary bg-transparent",
    secondary: "bg-primary-50 text-text-secondary border border-border",
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

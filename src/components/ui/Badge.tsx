import React from "react";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "success" | "warning" | "danger" | "outline" | "secondary";
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = "primary",
  children,
  className = "",
  ...props
}) => {
  const variantStyles = {
    primary: "bg-emerald-100 text-emerald-800",
    success: "bg-emerald-100 text-emerald-800",
    warning: "bg-yellow-100 text-yellow-800",
    danger: "bg-rose-100 text-rose-800",
    outline: "border border-emerald-700 text-emerald-100 bg-transparent",
    secondary: "bg-gray-200 text-gray-700",
  } as const;

  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

Badge.displayName = "Badge";

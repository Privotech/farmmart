import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-semibold text-foreground mb-1.5">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full px-4 py-2.5 bg-surface border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm text-foreground placeholder-text-secondary text-sm ${
            error ? "border-danger-500 focus:ring-danger/20 focus:border-danger" : "border-border hover:border-text-secondary/40"
          } ${className}`}
          {...props}
        />
        {error && <p className="text-danger text-xs mt-1.5 font-medium">{error}</p>}
        {helperText && !error && (
          <p className="text-text-secondary text-xs mt-1.5">{helperText}</p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

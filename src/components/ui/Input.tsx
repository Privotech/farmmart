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
          <label className="block text-sm font-medium text-emerald-200 mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full px-4 py-3 bg-emerald-950 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-500 transition-shadow shadow-sm text-emerald-100 ${
            error ? "border-emerald-500" : "border-emerald-800"
          } ${className}`}
          {...props}
        />
        {error && <p className="text-emerald-400 text-sm mt-1">{error}</p>}
        {helperText && !error && (
          <p className="text-emerald-400 text-sm mt-1">{helperText}</p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

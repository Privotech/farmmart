import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <div
      className={`bg-white/80 backdrop-blur-sm border border-gray-100 rounded-xl shadow-lg p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

Card.displayName = "Card";

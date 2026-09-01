import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: "none" | "sm" | "md" | "lg";
}

export const Card: React.FC<CardProps> = ({ padding = "md", className, children, ...props }) => {
  const paddings = {
    none: "",
    sm: "p-3",
    md: "p-5",
    lg: "p-7",
  };

  return (
    <div
      className={`bg-slate-800 border border-slate-700 rounded-xl shadow-lg ${paddings[padding]} ${className || ""}`}
      {...props}
    >
      {children}
    </div>
  );
};

Card.displayName = "Card";
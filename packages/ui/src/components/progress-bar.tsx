import React from "react";

export interface ProgressBarProps {
  value: number; // 0 to 100
  variant?: "primary" | "success" | "warning" | "danger";
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ value, variant = "primary", className }) => {
  const colors = {
    primary: "bg-blue-600",
    success: "bg-green-600",
    warning: "bg-yellow-600",
    danger: "bg-red-600",
  };

  return (
    <div className={`w-full bg-slate-700 rounded-full h-2.5 overflow-hidden ${className || ""}`}>
      <div
        className={`${colors[variant]} h-2.5 rounded-full transition-all duration-500 ease-out`}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
};

ProgressBar.displayName = "ProgressBar";
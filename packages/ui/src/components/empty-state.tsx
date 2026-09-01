import React from "react";

export interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title = "لا توجد بيانات", message, icon = "📭", action }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="text-5xl mb-4 opacity-50">{icon}</div>
      <h3 className="text-lg font-bold text-slate-100 mb-2">{title}</h3>
      {message && <p className="text-slate-400 mb-4 max-w-md">{message}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
};

EmptyState.displayName = "EmptyState";
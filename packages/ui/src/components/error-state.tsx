import React from "react";

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ title = "حدث خطأ", message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="text-4xl mb-4">⚠️</div>
      <h3 className="text-lg font-bold text-slate-100 mb-2">{title}</h3>
      {message && <p className="text-slate-400 mb-4">{message}</p>}
      {onRetry && (
        <button onClick={onRetry} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
          إعادة المحاولة
        </button>
      )}
    </div>
  );
};

ErrorState.displayName = "ErrorState";
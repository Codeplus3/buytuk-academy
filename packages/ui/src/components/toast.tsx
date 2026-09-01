import React from "react";

export interface ToastProps {
  message: string;
  type?: "success" | "error" | "warning" | "info";
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = "info", onClose }) => {
  const styles = {
    success: "bg-green-500/20 border-green-500/50 text-green-300",
    error: "bg-red-500/20 border-red-500/50 text-red-300",
    warning: "bg-yellow-500/20 border-yellow-500/50 text-yellow-300",
    info: "bg-blue-500/20 border-blue-500/50 text-blue-300",
  };

  return (
    <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-4 py-3 rounded-lg border shadow-lg flex items-center gap-3 ${styles[type]}`}>
      <span>{message}</span>
      {onClose && (
        <button onClick={onClose} className="text-lg leading-none opacity-70 hover:opacity-100">&times;</button>
      )}
    </div>
  );
};

Toast.displayName = "Toast";
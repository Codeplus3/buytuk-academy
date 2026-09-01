import React from "react";

export interface VoiceInputProps {
  isRecording: boolean;
  onStart: () => void;
  onStop: () => void;
  disabled?: boolean;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({ isRecording, onStart, onStop, disabled }) => {
  return (
    <button
      onClick={isRecording ? onStop : onStart}
      disabled={disabled}
      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
        isRecording
          ? "bg-red-500 hover:bg-red-600 text-white animate-pulse"
          : "bg-blue-600 hover:bg-blue-700 text-white"
      } disabled:opacity-50 disabled:cursor-not-allowed`}
      title={isRecording ? "إيقاف التسجيل" : "بدء التسجيل"}
    >
      {isRecording ? "⏹" : "🎤"}
    </button>
  );
};

VoiceInput.displayName = "VoiceInput";
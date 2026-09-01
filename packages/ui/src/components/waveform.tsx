import React from "react";

export interface WaveformProps {
  isActive?: boolean;
  bars?: number;
  className?: string;
}

export const Waveform: React.FC<WaveformProps> = ({ isActive = false, bars = 20, className }) => {
  return (
    <div className={`flex items-center justify-center gap-1 h-8 ${className || ""}`}>
      {Array.from({ length: bars }).map((_, i) => (
        <div
          key={i}
          className={`w-1 bg-blue-500 rounded-full transition-all duration-150 ${
            isActive ? "animate-pulse" : "h-2 opacity-30"
          }`}
          style={{
            height: isActive ? `${Math.random() * 100}%` : "20%",
            animationDelay: `${i * 0.05}s`,
          }}
        />
      ))}
    </div>
  );
};

Waveform.displayName = "Waveform";
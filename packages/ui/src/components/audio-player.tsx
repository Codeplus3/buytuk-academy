import React from "react";

export interface AudioPlayerProps {
  src: string;
  className?: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ src, className }) => {
  return (
    <div className={`w-full bg-slate-800 rounded-lg p-3 border border-slate-700 ${className || ""}`}>
      <audio controls className="w-full h-10" src={src}>
        متصفحك لا يدعم مشغل الصوت.
      </audio>
    </div>
  );
};

AudioPlayer.displayName = "AudioPlayer";
import React from "react";

export interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ src, alt, name, size = "md", className }) => {
  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-14 h-14 text-base",
  };

  const initials = name
    ? name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase()
    : "?";

  return (
    <div className={`${sizes[size]} rounded-full bg-slate-700 border-2 border-slate-600 flex items-center justify-center overflow-hidden ${className || ""}`}>
      {src ? (
        <img src={src} alt={alt || name} className="w-full h-full object-cover" />
      ) : (
        <span className="font-bold text-slate-200">{initials}</span>
      )}
    </div>
  );
};

Avatar.displayName = "Avatar";
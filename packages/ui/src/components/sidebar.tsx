import React from "react";

export interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  width?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ width = "w-64", className, children, ...props }) => {
  return (
    <aside
      className={`${width} bg-slate-900 border-l border-slate-800 h-screen overflow-y-auto ${className || ""}`}
      {...props}
    >
      {children}
    </aside>
  );
};

Sidebar.displayName = "Sidebar";
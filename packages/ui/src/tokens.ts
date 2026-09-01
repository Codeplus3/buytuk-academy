// =============================================================================
// BuyTuk Academy - Design Tokens
// =============================================================================

export const colors = {
  primary: {
    50: "#eff6ff",
    100: "#dbeafe",
    500: "#3b82f6",
    600: "#2563eb",
    700: "#1d4ed8",
  },
  success: {
    500: "#10b981",
    600: "#059669",
  },
  warning: {
    500: "#f59e0b",
    600: "#d97706",
  },
  danger: {
    500: "#ef4444",
    600: "#dc2626",
  },
  slate: {
    50: "#f8fafc",
    100: "#f1f5f9",
    700: "#334155",
    800: "#1e293b",
    900: "#0f172a",
  },
} as const;

export const spacing = {
  xs: "0.5rem",
  sm: "0.75rem",
  md: "1rem",
  lg: "1.5rem",
  xl: "2rem",
} as const;

export const borderRadius = {
  sm: "0.25rem",
  md: "0.375rem",
  lg: "0.5rem",
  xl: "0.75rem",
  full: "9999px",
} as const;

export const typography = {
  fontFamily: {
    arabic: "'Tajawal', 'Cairo', sans-serif",
    sans: "system-ui, -apple-system, sans-serif",
  },
  fontSize: {
    xs: "0.75rem",
    sm: "0.875rem",
    base: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
  },
} as const;
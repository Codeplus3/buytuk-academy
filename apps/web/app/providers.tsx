// =============================================================================
// BuyTuk Academy - Client Providers
// =============================================================================

"use client";

import React from "react";
import { Toaster } from "react-hot-toast";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Global Toast Notifications */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#1e293b",
            color: "#f8fafc",
            borderRadius: "8px",
          },
        }}
      />
      
      {/* Future Providers: AuthProvider, ThemeProvider, QueryClientProvider */}
      {children}
    </>
  );
}
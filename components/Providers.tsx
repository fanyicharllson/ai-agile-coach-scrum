"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/queryClient";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import { Toaster } from "sonner";

function ToasterProvider() {
  const { theme } = useTheme();
  
  return (
    <Toaster 
      theme={theme}
      position="top-right"
      richColors
      closeButton
      expand={true}
      toastOptions={{
        style: {
          background: theme === 'dark' ? '#1f2937' : '#ffffff',
          color: theme === 'dark' ? '#f3f4f6' : '#111827',
          border: theme === 'dark' ? '1px solid #374151' : '1px solid #e5e7eb',
        },
        className: 'toast-custom',
        duration: 4000,
      }}
    />
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ToasterProvider />
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
}

'use client';

import { ThemeProvider } from '@/components/theme-provider';
import { WebSocketProvider } from './websocket-provider';
import { Toaster } from '@/components/ui/toaster';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <WebSocketProvider>
        {children}
        <Toaster />
      </WebSocketProvider>
    </ThemeProvider>
  );
} 
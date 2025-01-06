'use client';

import { useEffect } from 'react';
import { WebSocketContext, WebSocketService } from '@/lib/socket';
import { useSettings } from '@/lib/contexts/settings-context';

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const settings = useSettings();

  const wsService = new WebSocketService(
    'wss://your-earthquake-websocket-server', 
    () => settings // Pass a function to get current settings
  );

  useEffect(() => {
    wsService.connect();
    return () => wsService.disconnect();
  }, []);

  return (
    <WebSocketContext.Provider value={wsService}>
      {children}
    </WebSocketContext.Provider>
  );
} 
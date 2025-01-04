'use client';

import { useEffect } from 'react';
import { WebSocketContext, WebSocketService } from '@/lib/socket';

const wsService = new WebSocketService('wss://your-earthquake-websocket-server');

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
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
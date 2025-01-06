'use client';

import { useEffect } from 'react';
import { isClient } from '@/lib/utils/is-client';

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (!isClient) return;
    
    // WebSocket initialization logic
  }, []);

  return children;
} 
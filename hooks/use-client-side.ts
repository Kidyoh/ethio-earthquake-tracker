import { useState, useEffect } from 'react';
import { isClient } from '@/lib/utils/is-client';

export function useClientSide<T>(serverFallback: T) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  return isReady;
} 
'use client';

import dynamic from 'next/dynamic';

// Dynamically import the map component with no SSR
export const DynamicMap = dynamic(() => import('./map-component'), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] w-full animate-pulse rounded-lg border bg-muted" />
  ),
}); 
'use client';

import { useMemo } from 'react';
import { Earthquake } from '@/lib/types';
import dynamic from 'next/dynamic';
import type { ChartProps } from '@/components/chart';

const Chart = dynamic<ChartProps>(
  () => import('@/components/chart').then(mod => mod.default),
  { 
    ssr: false,
    loading: () => <div className="h-[300px] w-full animate-pulse bg-muted" />
  }
);

interface EarthquakeChartProps {
  earthquakes: Earthquake[];
}

export function EarthquakeChart({ earthquakes }: EarthquakeChartProps) {
  const data = useMemo(() => {
    const magnitudeBins = new Map<string, number>();
    
    earthquakes.forEach(quake => {
      const magnitude = Math.floor(quake.magnitude);
      const bin = `${magnitude}.0-${magnitude}.9`;
      magnitudeBins.set(bin, (magnitudeBins.get(bin) || 0) + 1);
    });

    return Array.from(magnitudeBins.entries())
      .map(([range, count]) => ({ range, count }))
      .sort((a, b) => parseFloat(a.range) - parseFloat(b.range));
  }, [earthquakes]);

  return (
    <div className="h-[300px] w-full">
      <Chart data={data} />
    </div>
  );
} 
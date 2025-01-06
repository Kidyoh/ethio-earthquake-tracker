'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useClientSide } from '@/hooks/use-client-side';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EarthquakeStats, Earthquake } from '@/lib/types';
import { RecentEarthquakes } from '@/components/recent-earthquakes';
import { EarthquakeChart } from '@/components/earthquake-chart';
import { StatsGrid } from '@/components/stats-grid';
import { AlertLevel } from '@/components/alert-level';
import { getRecentEarthquakes } from '@/lib/api';
import { formatEarthquakeData, calculateAverageMagnitude, findHighestMagnitude } from '@/lib/utils/earthquake';
import { EarthquakeDetails } from '@/components/earthquake-details';
import { ShareAlert } from '@/components/social/share-alert';
import { ReportForm } from '@/components/community/report-form';
import { useSettings } from '@/lib/contexts/settings-context';
import { PredictionAnalysis } from '@/components/analysis/prediction';
import { SafetyTips } from '@/components/safety/safety-tips';
import { PredictionModel } from '@/components/analysis/prediction-model';

// Dynamically import components that need window
const MapComponent = dynamic(
  () => import('@/components/map/map-component'),
  { 
    ssr: false,
    loading: () => <LoadingSpinner />
  }
);

const RiskHeatMap = dynamic(
  () => import('@/components/analysis/risk-heatmap').then(mod => mod.RiskHeatMap),
  { 
    ssr: false,
    loading: () => <LoadingSpinner />
  }
);

export default function Home() {
  const isReady = useClientSide(false);
  const [earthquakes, setEarthquakes] = useState<Earthquake[]>([]);
  const [stats, setStats] = useState<EarthquakeStats | null>(null);
  const [selectedEarthquake, setSelectedEarthquake] = useState<Earthquake | null>(null);
  const settings = useSettings();

  useEffect(() => {
    const fetchEarthquakes = async () => {
      try {
        const data = await getRecentEarthquakes();
        setEarthquakes(data.features.map(formatEarthquakeData));
        calculateInitialStats(data.features);
      } catch (error) {
        console.error('Error fetching earthquakes:', error);
      }
    };

    const calculateInitialStats = (data: any[]) => {
      const last24Hours = data.filter(quake => 
        Date.now() - new Date(quake.properties.time).getTime() < 24 * 60 * 60 * 1000
      );

      setStats({
        last24Hours: last24Hours.length,
        averageMagnitude: calculateAverageMagnitude(last24Hours),
        highestMagnitude: findHighestMagnitude(last24Hours),
        totalEvents: data.length,
      });
    };

    fetchEarthquakes();
    const intervalId = setInterval(fetchEarthquakes, 60000);

    return () => clearInterval(intervalId);
  }, []);

  if (!isReady) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold">Ethiopia Earthquake Monitor</h1>
        <div className="flex items-center gap-2 self-end">
          {earthquakes.length > 0 && <ShareAlert earthquake={earthquakes[0]} />}
          <ReportForm />
        </div>
      </div>

      <EarthquakeDetails
        earthquake={selectedEarthquake}
        onClose={() => setSelectedEarthquake(null)}
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsGrid stats={stats} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Alert Level</CardTitle>
          </CardHeader>
          <CardContent>
            <AlertLevel earthquakes={earthquakes} />
          </CardContent>
        </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Earthquakes</CardTitle>
              <CardDescription>Click on an earthquake to view details</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentEarthquakes 
                earthquakes={earthquakes} 
                onEarthquakeClick={setSelectedEarthquake}
              />
            </CardContent>
          </Card>
            <PredictionAnalysis earthquakes={earthquakes} />
            <SafetyTips />

      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <PredictionModel earthquakes={earthquakes} />
        <RiskHeatMap earthquakes={earthquakes} />
      </div>
    </div>
  );
}
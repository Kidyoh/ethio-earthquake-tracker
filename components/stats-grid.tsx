import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EarthquakeStats } from '@/lib/types';

interface StatsGridProps {
  stats: EarthquakeStats | null;
}

export function StatsGrid({ stats }: StatsGridProps) {
  if (!stats) return null;

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Last 24 Hours
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.last24Hours}</div>
          <p className="text-xs text-muted-foreground">
            Earthquake events
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Average Magnitude
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.averageMagnitude.toFixed(1)}
          </div>
          <p className="text-xs text-muted-foreground">
            In last 24 hours
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Highest Magnitude
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.highestMagnitude.toFixed(1)}
          </div>
          <p className="text-xs text-muted-foreground">
            In last 24 hours
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalEvents}</div>
          <p className="text-xs text-muted-foreground">
            In monitoring period
          </p>
        </CardContent>
      </Card>
    </>
  );
} 
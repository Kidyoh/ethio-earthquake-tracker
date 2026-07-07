'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { HistoricalTrends } from '@/components/analysis/historical-trends';
import { Earthquake } from '@/lib/types';
import { getHistoricalEarthquakes } from '@/lib/api';
import { formatEarthquakeData } from '@/lib/utils/earthquake';
import { format } from 'date-fns';

function getRegion(place: string) {
  const parts = place.split(',');
  return parts[parts.length - 1]?.trim() || place;
}

function getMagnitudeColor(magnitude: number): string {
  if (magnitude >= 7) return 'text-red-500 font-bold';
  if (magnitude >= 5) return 'text-orange-500 font-semibold';
  if (magnitude >= 3) return 'text-yellow-500';
  return 'text-green-500';
}

export default function TrendsPage() {
  const [earthquakes, setEarthquakes] = useState<Earthquake[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getHistoricalEarthquakes(365, 2.5);
        setEarthquakes(data.features.map(formatEarthquakeData));
      } catch (error) {
        console.error('Error fetching historical earthquakes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const monthlyFrequency = useMemo(() => {
    const counts = new Map<string, number>();
    earthquakes.forEach(quake => {
      const key = format(new Date(quake.time), 'MMM yyyy');
      counts.set(key, (counts.get(key) ?? 0) + 1);
    });

    return Array.from(counts.entries())
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());
  }, [earthquakes]);

  const topRegions = useMemo(() => {
    const counts = new Map<string, number>();
    earthquakes.forEach(quake => {
      const region = getRegion(quake.location.place);
      counts.set(region, (counts.get(region) ?? 0) + 1);
    });

    return Array.from(counts.entries())
      .map(([region, count]) => ({ region, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [earthquakes]);

  const largestEarthquakes = useMemo(() => {
    return [...earthquakes]
      .sort((a, b) => b.magnitude - a.magnitude)
      .slice(0, 10);
  }, [earthquakes]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Historical Trends</h1>
        <p className="text-muted-foreground">
          Seismic activity around Ethiopia over the past year, based on {earthquakes.length} recorded events.
        </p>
      </div>

      <HistoricalTrends earthquakes={earthquakes} />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Frequency</CardTitle>
            <CardDescription>Number of earthquakes recorded each month</CardDescription>
          </CardHeader>
          <CardContent>
            {monthlyFrequency.length === 0 ? (
              <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">
                No data available
              </div>
            ) : (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyFrequency}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Most Active Regions</CardTitle>
            <CardDescription>Areas with the most recorded seismic events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topRegions.length === 0 && (
                <p className="text-sm text-muted-foreground">No data available</p>
              )}
              {topRegions.map(({ region, count }) => (
                <div key={region} className="flex items-center justify-between text-sm">
                  <span>{region}</span>
                  <span className="font-medium">{count} events</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Largest Earthquakes This Year</CardTitle>
          <CardDescription>Top 10 events by magnitude</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Magnitude</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Depth</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {largestEarthquakes.map(quake => (
                  <TableRow key={quake.id}>
                    <TableCell className={getMagnitudeColor(quake.magnitude)}>
                      {quake.magnitude.toFixed(1)}
                    </TableCell>
                    <TableCell>{quake.location.place}</TableCell>
                    <TableCell>{quake.depth.toFixed(1)} km</TableCell>
                    <TableCell>{format(new Date(quake.time), 'PP')}</TableCell>
                  </TableRow>
                ))}
                {largestEarthquakes.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                      No data available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

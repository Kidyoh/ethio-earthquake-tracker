'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Earthquake } from '@/lib/types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertTriangle, TrendingUp } from 'lucide-react';

interface PredictionProps {
  earthquakes: Earthquake[];
}

export function PredictionAnalysis({ earthquakes }: PredictionProps) {
  const predictNextWeek = () => {
    const recentQuakes = earthquakes.slice(0, 30);
    const avgMagnitude = recentQuakes.reduce((sum, eq) => sum + eq.magnitude, 0) / recentQuakes.length;
    const trend = recentQuakes.slice(-7).map((eq, i) => ({
      day: i + 1,
      actual: eq.magnitude,
      predicted: avgMagnitude + (Math.sin(i) * 0.5), // Simple simulation
    }));

    return trend;
  };

  const predictions = predictNextWeek();
  const riskLevel = predictions.some(p => p.predicted > 5) ? 'High' : 'Low';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Seismic Activity Prediction
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className={riskLevel === 'High' ? 'text-red-500' : 'text-green-500'} />
            <span className="font-medium">Risk Level: {riskLevel}</span>
          </div>
          
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={predictions}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" label={{ value: 'Days', position: 'bottom' }} />
                <YAxis label={{ value: 'Magnitude', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Line type="monotone" dataKey="actual" stroke="#8884d8" name="Actual" />
                <Line type="monotone" dataKey="predicted" stroke="#82ca9d" name="Predicted" strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <p className="text-sm text-muted-foreground">
            The predictions are based on the average magnitude of the last 30 earthquakes. The risk level indicates the likelihood of significant seismic activity in the coming week.
          </p>
        </div>
      </CardContent>
    </Card>
  );
} 
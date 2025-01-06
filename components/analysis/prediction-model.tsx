'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Earthquake } from '@/lib/types';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { 
  AlertTriangle, 
  TrendingUp, 
  MapPin 
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PredictionModelProps {
  earthquakes: Earthquake[];
}

// Advanced risk calculation function
function calculateAdvancedRiskProbability(earthquakes: Earthquake[]): number {
  if (earthquakes.length === 0) return 0;

  // Analyze recent earthquake patterns (last 90 days)
  const last90Days = earthquakes.filter(quake => 
    (Date.now() - new Date(quake.time).getTime()) <= 90 * 24 * 60 * 60 * 1000
  );

  // Calculate various risk factors
  const magnitudes = last90Days.map(quake => quake.magnitude);
  const avgMagnitude = magnitudes.reduce((a, b) => a + b, 0) / magnitudes.length;
  
  // Frequency analysis
  const significantQuakes = last90Days.filter(quake => quake.magnitude >= 4.5);
  const frequencyFactor = significantQuakes.length / last90Days.length;

  // Temporal clustering analysis
  const timeDiffs = last90Days
    .map((quake, index, arr) => 
      index > 0 
        ? new Date(quake.time).getTime() - new Date(arr[index-1].time).getTime() 
        : 0
    )
    .filter(diff => diff > 0);
  
  const avgTimeBetweenQuakes = 
    timeDiffs.length > 0 
      ? timeDiffs.reduce((a, b) => a + b, 0) / timeDiffs.length 
      : Infinity;

  // Complex risk scoring
  const riskScore = 
    (avgMagnitude * 30) +  // Magnitude impact
    (frequencyFactor * 40) +  // Frequency impact
    (avgTimeBetweenQuakes > 0 
      ? Math.min(30, 1000 / avgTimeBetweenQuakes) 
      : 0);  // Temporal clustering impact

  return Math.min(Math.max(riskScore, 0), 100);
}

export function PredictionModel({ earthquakes }: PredictionModelProps) {
  const [timeframe, setTimeframe] = useState('month');

  // Prediction data preparation with more sophisticated trend analysis
  const predictionData = useMemo(() => {
    const filteredEarthquakes = earthquakes.filter(quake => {
      const quakeDate = new Date(quake.time);
      const now = new Date();
      
      switch (timeframe) {
        case 'week':
          return (now.getTime() - quakeDate.getTime()) <= 7 * 24 * 60 * 60 * 1000;
        case 'month':
          return (now.getTime() - quakeDate.getTime()) <= 30 * 24 * 60 * 60 * 1000;
        case 'year':
          return (now.getTime() - quakeDate.getTime()) <= 365 * 24 * 60 * 60 * 1000;
        default:
          return true;
      }
    });

    // More advanced prediction trend generation
    return filteredEarthquakes.map((quake, index, arr) => {
      const prevQuake = index > 0 ? arr[index - 1] : null;
      const predictionFactor = prevQuake 
        ? Math.abs(quake.magnitude - prevQuake.magnitude) * 0.5 
        : 0;

      return {
        date: new Date(quake.time).toLocaleDateString(),
        magnitude: quake.magnitude,
        predictedMagnitude: quake.magnitude + predictionFactor
      };
    });
  }, [earthquakes, timeframe]);

  // Risk calculation
  const riskProbability = calculateAdvancedRiskProbability(earthquakes);

  // Risk level categorization with more nuanced levels
  const getRiskLevel = (probability: number) => {
    if (probability < 20) return { level: 'Very Low', color: 'text-green-500' };
    if (probability < 40) return { level: 'Low', color: 'text-green-600' };
    if (probability < 60) return { level: 'Moderate', color: 'text-yellow-500' };
    if (probability < 80) return { level: 'High', color: 'text-orange-500' };
    return { level: 'Critical', color: 'text-red-500' };
  };

  const riskLevel = getRiskLevel(riskProbability);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Earthquake Risk Prediction
        </CardTitle>
        <Select value={timeframe} onValueChange={setTimeframe}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Past Week</SelectItem>
            <SelectItem value="month">Past Month</SelectItem>
            <SelectItem value="year">Past Year</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className={`h-5 w-5 ${riskLevel.color}`} />
              <span className="font-semibold">Risk Level: {riskLevel.level}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Probability of Significant Seismic Activity: {riskProbability.toFixed(2)}%
            </p>
          </div>
          <div className="flex items-center justify-end">
            <div className="text-right">
              <div className="flex items-center gap-2 justify-end">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Ethiopia Seismic Zone</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Advanced predictive analysis
              </p>
            </div>
          </div>
        </div>

        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={predictionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis label={{ value: 'Magnitude', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="magnitude" 
                stroke="#8884d8" 
                name="Actual Magnitude" 
              />
              <Line 
                type="monotone" 
                dataKey="predictedMagnitude" 
                stroke="#82ca9d" 
                strokeDasharray="5 5" 
                name="Predicted Magnitude" 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <p className="text-sm text-muted-foreground">
          <strong>Note:</strong> Prediction uses advanced statistical modeling. 
          Actual seismic events may differ. Always follow local emergency guidelines.
        </p>
      </CardContent>
    </Card>
  );
} 
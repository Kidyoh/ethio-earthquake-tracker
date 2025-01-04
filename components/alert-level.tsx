import { useMemo } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react';
import { Earthquake } from '@/lib/types';

interface AlertLevelProps {
  earthquakes: Earthquake[];
}

export function AlertLevel({ earthquakes }: AlertLevelProps) {
  const alertStatus = useMemo(() => {
    const last24Hours = earthquakes.filter(
      quake => Date.now() - new Date(quake.time).getTime() < 24 * 60 * 60 * 1000
    );

    const highMagnitudeQuakes = last24Hours.filter(quake => quake.magnitude >= 5.0);
    const moderateQuakes = last24Hours.filter(quake => quake.magnitude >= 4.0);

    if (highMagnitudeQuakes.length > 0) {
      return {
        level: 'high',
        title: 'High Alert',
        description: 'Significant seismic activity detected. Stay alert and prepared.',
        icon: AlertTriangle,
        color: 'destructive',
      };
    }

    if (moderateQuakes.length > 2) {
      return {
        level: 'moderate',
        title: 'Moderate Alert',
        description: 'Multiple moderate earthquakes detected. Monitor situation.',
        icon: AlertCircle,
        color: 'warning',
      };
    }

    return {
      level: 'low',
      title: 'Normal Activity',
      description: 'No significant seismic activity detected.',
      icon: CheckCircle,
      color: 'default',
    };
  }, [earthquakes]);

  return (
    <Alert variant={alertStatus.color}>
      <alertStatus.icon className="h-4 w-4" />
      <AlertTitle>{alertStatus.title}</AlertTitle>
      <AlertDescription>
        {alertStatus.description}
      </AlertDescription>
    </Alert>
  );
} 
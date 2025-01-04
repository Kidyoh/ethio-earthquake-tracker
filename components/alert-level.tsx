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
        level: 'destructive' as 'destructive',
        title: 'High Alert',
        description: 'Significant seismic activity detected. Stay alert and prepared.',
        icon: AlertTriangle,
      };
    }

    if (moderateQuakes.length > 2) {
      return {
        level: 'default' as 'default',
        title: 'Moderate Alert',
        description: 'Multiple moderate earthquakes detected. Monitor situation.',
        icon: AlertCircle,
      };
    }

    return {
      level: 'default' as 'default',
      title: 'Normal Activity',
      description: 'No significant seismic activity detected.',
      icon: CheckCircle,
    };
  }, [earthquakes]);

  return (
    <Alert variant={alertStatus.level}>
      <alertStatus.icon className="h-4 w-4" />
      <AlertTitle>{alertStatus.title}</AlertTitle>
      <AlertDescription>
        {alertStatus.description}
      </AlertDescription>
    </Alert>
  );
} 
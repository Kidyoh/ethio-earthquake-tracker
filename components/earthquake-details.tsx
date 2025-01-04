'use client';

import { Earthquake } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { format } from 'date-fns';
import { AlertTriangle, ArrowDown, Waves } from 'lucide-react';

interface EarthquakeDetailsProps {
  earthquake: Earthquake | null;
  onClose: () => void;
}

export function EarthquakeDetails({ earthquake, onClose }: EarthquakeDetailsProps) {
  if (!earthquake) return null;

  return (
    <Dialog open={!!earthquake} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Earthquake Details</DialogTitle>
          <DialogDescription>
            Detailed information about the seismic event
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="col-span-4 space-y-4">
              <div className="flex items-center gap-2">
                <Waves className="h-4 w-4" />
                <span className="font-semibold">Magnitude:</span>
                <span className={getMagnitudeColor(earthquake.magnitude)}>
                  {earthquake.magnitude.toFixed(1)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <ArrowDown className="h-4 w-4" />
                <span className="font-semibold">Depth:</span>
                <span>{earthquake.depth.toFixed(1)} km</span>
              </div>

              <div className="space-y-1">
                <span className="font-semibold">Location:</span>
                <p className="text-sm text-muted-foreground">
                  {earthquake.location.place}
                </p>
                <p className="text-xs text-muted-foreground">
                  Lat: {earthquake.location.lat.toFixed(4)}, 
                  Lng: {earthquake.location.lng.toFixed(4)}
                </p>
              </div>

              <div className="space-y-1">
                <span className="font-semibold">Time:</span>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(earthquake.time), 'PPpp')}
                </p>
              </div>

              {earthquake.tsunami > 0 && (
                <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-2 text-sm text-destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Tsunami Warning Active</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function getMagnitudeColor(magnitude: number): string {
  if (magnitude >= 7) return 'text-red-500 font-bold';
  if (magnitude >= 5) return 'text-orange-500 font-semibold';
  if (magnitude >= 3) return 'text-yellow-500';
  return 'text-green-500';
} 
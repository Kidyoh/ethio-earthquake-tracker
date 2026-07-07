'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { MapPin, Navigation, Trash2, BellRing } from 'lucide-react';
import { Earthquake, WatchedRegion } from '@/lib/types';
import { getWorldwideEarthquakes } from '@/lib/api';
import { formatEarthquakeData } from '@/lib/utils/earthquake';
import { calculateDistance } from '@/lib/utils/distance';
import { useSettings } from '@/lib/contexts/settings-context';
import { requestNotificationPermission, sendEarthquakeNotification } from '@/lib/notifications';
import { formatDistanceToNow } from 'date-fns';

const POLL_INTERVAL_MS = 60000;

function getMagnitudeColor(magnitude: number): string {
  if (magnitude >= 7) return 'text-red-500 font-bold';
  if (magnitude >= 5) return 'text-orange-500 font-semibold';
  if (magnitude >= 3) return 'text-yellow-500';
  return 'text-green-500';
}

export default function AlertsPage() {
  const settings = useSettings();
  const [label, setLabel] = useState('');
  const [placeInput, setPlaceInput] = useState('');
  const [pendingLocation, setPendingLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [radiusKm, setRadiusKm] = useState(200);
  const [minMagnitude, setMinMagnitude] = useState(4);
  const [geocoding, setGeocoding] = useState(false);

  const [earthquakes, setEarthquakes] = useState<Earthquake[]>([]);
  const [loading, setLoading] = useState(true);
  const seenIds = useRef<Set<string>>(new Set());
  const firstLoad = useRef(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getWorldwideEarthquakes(30, 2.5);
        setEarthquakes(data.features.map(formatEarthquakeData));
      } catch (error) {
        console.error('Error fetching earthquakes for alerts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, POLL_INTERVAL_MS);
    return () => clearInterval(intervalId);
  }, []);

  const regionMatches = useMemo(() => {
    return settings.watchedRegions.map((region: WatchedRegion) => {
      const matches = earthquakes
        .filter(quake => quake.magnitude >= region.minMagnitude)
        .filter(
          quake =>
            calculateDistance(region.lat, region.lng, quake.location.lat, quake.location.lng) <=
            region.radiusKm
        )
        .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

      return { region, matches };
    });
  }, [earthquakes, settings.watchedRegions]);

  useEffect(() => {
    if (!settings.notifications) return;

    if (firstLoad.current) {
      // Don't notify for events that already existed before this page loaded.
      regionMatches.forEach(({ matches }) => {
        matches.forEach(quake => seenIds.current.add(quake.id));
      });
      firstLoad.current = false;
      return;
    }

    regionMatches.forEach(({ region, matches }) => {
      matches.forEach(quake => {
        if (!seenIds.current.has(quake.id)) {
          seenIds.current.add(quake.id);
          sendEarthquakeNotification(quake, {
            notifications: true,
            sound: settings.sound,
            minMagnitude: region.minMagnitude,
          });
        }
      });
    });
  }, [regionMatches, settings.notifications, settings.sound]);

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      position => {
        setPendingLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
        setPlaceInput('Current Location');
      },
      () => alert('Unable to get your location. Please check your browser permissions.')
    );
  };

  const handleGeocode = async () => {
    if (!placeInput.trim()) return;
    setGeocoding(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(placeInput)}&limit=1`
      );
      const data = await response.json();
      if (data && data.length > 0) {
        setPendingLocation({ lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) });
      } else {
        alert('Location not found. Please try a different search term.');
      }
    } catch (error) {
      console.error('Error geocoding location:', error);
      alert('Error searching for location. Please try again.');
    } finally {
      setGeocoding(false);
    }
  };

  const handleAddRegion = async () => {
    if (!pendingLocation) {
      alert('Please search for a place or use your current location first.');
      return;
    }

    if (settings.notifications === false) {
      const granted = await requestNotificationPermission();
      settings.setNotifications(granted);
    }

    settings.addWatchedRegion({
      label: label.trim() || placeInput.trim() || 'Watched Region',
      lat: pendingLocation.lat,
      lng: pendingLocation.lng,
      radiusKm,
      minMagnitude,
    });

    setLabel('');
    setPlaceInput('');
    setPendingLocation(null);
    setRadiusKm(200);
    setMinMagnitude(4);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Watched Regions & Alerts</h1>
        <p className="text-muted-foreground">
          Save the places you care about and get a personalized feed (plus browser notifications) when
          earthquakes strike nearby.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add a Watched Region</CardTitle>
          <CardDescription>Search for a place or use your current location</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-end gap-4">
            <div className="space-y-2">
              <Label htmlFor="regionLabel">Label</Label>
              <Input
                id="regionLabel"
                placeholder="e.g. Home, Addis Ababa"
                value={label}
                onChange={e => setLabel(e.target.value)}
                className="w-48"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="regionPlace">Place</Label>
              <div className="flex gap-2">
                <Input
                  id="regionPlace"
                  placeholder="Enter city or country"
                  value={placeInput}
                  onChange={e => setPlaceInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleGeocode()}
                  className="w-48"
                />
                <Button onClick={handleGeocode} variant="outline" size="sm" disabled={geocoding}>
                  <MapPin className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Button onClick={handleUseCurrentLocation} variant="outline" size="sm">
              <Navigation className="mr-2 h-4 w-4" />
              Use Current Location
            </Button>
          </div>

          {pendingLocation && (
            <p className="text-sm text-muted-foreground">
              Selected location: {pendingLocation.lat.toFixed(3)}, {pendingLocation.lng.toFixed(3)}
            </p>
          )}

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Alert Radius</Label>
                <span className="text-sm text-muted-foreground">{radiusKm} km</span>
              </div>
              <Slider
                value={[radiusKm]}
                onValueChange={([value]) => setRadiusKm(value)}
                min={10}
                max={2000}
                step={10}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Minimum Magnitude</Label>
                <span className="text-sm text-muted-foreground">{minMagnitude.toFixed(1)}</span>
              </div>
              <Slider
                value={[minMagnitude]}
                onValueChange={([value]) => setMinMagnitude(value)}
                min={1}
                max={8}
                step={0.1}
              />
            </div>
          </div>

          <Button onClick={handleAddRegion}>
            <BellRing className="mr-2 h-4 w-4" />
            Save Watched Region
          </Button>
        </CardContent>
      </Card>

      {loading ? (
        <LoadingSpinner />
      ) : settings.watchedRegions.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            You haven&apos;t added any watched regions yet. Add one above to start receiving personalized
            alerts.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {regionMatches.map(({ region, matches }) => (
            <Card key={region.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle>{region.label}</CardTitle>
                  <CardDescription>
                    Within {region.radiusKm} km, magnitude {region.minMagnitude.toFixed(1)}+
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => settings.removeWatchedRegion(region.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </CardHeader>
              <CardContent>
                {matches.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No matching earthquakes in the past 30 days.</p>
                ) : (
                  <div className="space-y-2">
                    {matches.slice(0, 5).map(quake => {
                      const isRecent = Date.now() - new Date(quake.time).getTime() < 24 * 60 * 60 * 1000;
                      return (
                        <div
                          key={quake.id}
                          className="flex items-center justify-between rounded-md border p-3 text-sm"
                        >
                          <div className="flex items-center gap-3">
                            <span className={getMagnitudeColor(quake.magnitude)}>
                              {quake.magnitude.toFixed(1)}
                            </span>
                            <span>{quake.location.place}</span>
                            {isRecent && <Badge>New</Badge>}
                          </div>
                          <span className="text-muted-foreground">
                            {formatDistanceToNow(new Date(quake.time), { addSuffix: true })}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

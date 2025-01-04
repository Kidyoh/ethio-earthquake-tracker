'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Bell, MapPin, Volume2 } from 'lucide-react';
import { useSettings } from '@/lib/contexts/settings-context';
import { requestNotificationPermission, setupServiceWorker } from '@/lib/notifications';

export default function SettingsPage() {
  const settings = useSettings();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setupServiceWorker();
  }, []);

  const handleNotificationToggle = async (checked: boolean) => {
    if (checked) {
      setIsLoading(true);
      const granted = await requestNotificationPermission();
      if (granted) {
        settings.setNotifications(true);
      }
      setIsLoading(false);
    } else {
      settings.setNotifications(false);
    }
  };

  const getCurrentLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          settings.setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Could not get location:', error);
        }
      );
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Configure how you want to be notified</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Push Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive alerts for new earthquakes
                </p>
              </div>
              <Switch
                checked={settings.notifications}
                onCheckedChange={handleNotificationToggle}
                disabled={isLoading}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Sound Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Play sound with notifications
                </p>
              </div>
              <Switch
                checked={settings.sound}
                onCheckedChange={settings.setSound}
              />
            </div>
            
            <div className="space-y-4">
              <Label>Minimum Magnitude</Label>
              <Slider
                value={[settings.minMagnitude]}
                onValueChange={([value]) => settings.setMinMagnitude(value)}
                min={0}
                max={10}
                step={0.1}
              />
              <p className="text-sm text-muted-foreground">
                Only notify for earthquakes above magnitude {settings.minMagnitude}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Location Settings</CardTitle>
            <CardDescription>Set your location preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Location</Label>
              <div className="flex gap-2">
                <Button 
                  variant="secondary" 
                  size="icon"
                  onClick={getCurrentLocation}
                >
                  <MapPin className="h-4 w-4" />
                </Button>
              </div>
              {settings.location && (
                <p className="text-sm text-muted-foreground">
                  Current location: {settings.location.lat.toFixed(4)}, {settings.location.lng.toFixed(4)}
                </p>
              )}
            </div>

            <div className="space-y-4">
              <Label>Notification Radius (km)</Label>
              <Slider
                value={[settings.radius]}
                onValueChange={([value]) => settings.setRadius(value)}
                min={0}
                max={500}
                step={10}
              />
              <p className="text-sm text-muted-foreground">
                Notify for earthquakes within {settings.radius}km of your location
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 
'use client';

import { EarthquakeMap } from '@/components/map/earthquake-map';
import { useEffect, useState } from 'react';
import { Earthquake } from '@/lib/types';
import { getRecentEarthquakes } from '@/lib/api';
import { formatEarthquakeData } from '@/lib/utils/earthquake';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Navigation } from 'lucide-react';

export default function MapPage() {
  const [earthquakes, setEarthquakes] = useState<Earthquake[]>([]);
  const [loading, setLoading] = useState(false);
  const [days, setDays] = useState(30);
  const [centerLat, setCenterLat] = useState(9.145); // Ethiopia center
  const [centerLng, setCenterLng] = useState(40.489);
  const [radiusKm, setRadiusKm] = useState(1000);
  const [locationInput, setLocationInput] = useState('');

  const fetchEarthquakes = async () => {
    setLoading(true);
    try {
      const data = await getRecentEarthquakes(days, centerLat, centerLng, radiusKm);
      setEarthquakes(data.features.map(formatEarthquakeData));
    } catch (error) {
      console.error('Error fetching earthquakes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEarthquakes();
  }, [days, centerLat, centerLng, radiusKm]);

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenterLat(position.coords.latitude);
          setCenterLng(position.coords.longitude);
          setRadiusKm(300); // Smaller radius for current location - show local earthquakes
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your location. Please check your browser permissions.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  const handleLocationSearch = async () => {
    if (!locationInput.trim()) return;

    try {
      // Use a geocoding service to convert location name to coordinates
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationInput)}&limit=1`);
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        setCenterLat(parseFloat(lat));
        setCenterLng(parseFloat(lon));
        setRadiusKm(400); // Moderate radius for searched locations
      } else {
        alert('Location not found. Please try a different search term.');
      }
    } catch (error) {
      console.error('Error searching location:', error);
      alert('Error searching for location. Please try again.');
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Earthquake Map</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap gap-4 items-end">
            <div className="space-y-2">
              <Label htmlFor="days">Time Period</Label>
              <Select value={days.toString()} onValueChange={(value) => setDays(parseInt(value))}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="60">60 days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <div className="flex gap-2">
                <Input
                  id="location"
                  placeholder="Enter city or country"
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleLocationSearch()}
                  className="w-48"
                />
                <Button onClick={handleLocationSearch} variant="outline" size="sm">
                  <MapPin className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Button onClick={handleUseCurrentLocation} variant="outline" size="sm">
              <Navigation className="h-4 w-4 mr-2" />
              Use Current Location
            </Button>
          </div>

          {/* Map */}
          <div className="relative">
            {loading && (
              <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10 rounded-lg">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                  <p>Loading earthquakes...</p>
                </div>
              </div>
            )}
            <EarthquakeMap 
              earthquakes={earthquakes} 
              center={[centerLat, centerLng]}
              zoom={centerLat === 9.145 && centerLng === 40.489 ? 6 : 8}
            />
          </div>

          <div className="text-sm text-muted-foreground">
            Showing {earthquakes.length} earthquakes in the past {days} days
            {centerLat === 9.145 && centerLng === 40.489 ? (
              <span> in Ethiopia</span>
            ) : (
              <span> around {centerLat.toFixed(2)}, {centerLng.toFixed(2)}</span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
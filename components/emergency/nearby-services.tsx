'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmergencyService } from '@/lib/types';
import { Hospital, Shield, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NearbyServicesProps {
  userLocation?: { lat: number; lng: number };
}

export function NearbyServices({ userLocation }: NearbyServicesProps) {
  const [services, setServices] = useState<EmergencyService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, fetch from your API based on user location
    const mockServices: EmergencyService[] = [
      {
        id: '1',
        name: 'Black Lion Hospital',
        type: 'hospital',
        location: { lat: 9.0222, lng: 38.7468 },
        address: 'Addis Ababa',
        phone: '+251-115-538880',
      },
      // Add more mock data
    ];

    setServices(mockServices);
    setLoading(false);
  }, [userLocation]);

  const getIcon = (type: EmergencyService['type']) => {
    switch (type) {
      case 'hospital':
        return <Hospital className="h-4 w-4" />;
      case 'police':
        return <Shield className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nearby Emergency Services</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {services.map((service) => (
            <div
              key={service.id}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div className="flex items-center gap-4">
                {getIcon(service.type)}
                <div>
                  <h3 className="font-semibold">{service.name}</h3>
                  <p className="text-sm text-muted-foreground">{service.address}</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(`tel:${service.phone}`)}
              >
                <Phone className="mr-2 h-4 w-4" />
                Call
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 
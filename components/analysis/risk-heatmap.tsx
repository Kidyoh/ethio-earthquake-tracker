'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Earthquake } from '@/lib/types';
import { 
  Globe, 
  MapPin, 
  AlertTriangle, 
  Waves, 
  Shield, 
  TrendingUp,
  Mountain,
  Flame,
  Clock,
  Star
} from 'lucide-react';
import { calculateDistance } from '@/lib/utils/distance';
import { 
  FeatureCollection, 
  Point, 
  Feature 
} from 'geojson';
import L from 'leaflet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Detailed risk color typing
const RISK_COLORS = {
  critical: 'rgba(255, 0, 0, 0.7)',
  high: 'rgba(255, 165, 0, 0.6)',
  moderate: 'rgba(255, 255, 0, 0.5)',
  low: 'rgba(0, 255, 0, 0.4)'
} as const;

const RISK_LEVELS = ['critical', 'high', 'moderate', 'low'] as const;
type RiskLevel = typeof RISK_LEVELS[number];

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

const getRiskBadgeVariant = (riskLevel: RiskLevel): BadgeVariant => {
  switch (riskLevel) {
    case 'critical': return 'destructive';
    case 'high': return 'secondary';
    case 'moderate': return 'default';
    case 'low': return 'outline';
  }
};

// Add a more detailed interface for geological context
interface GeologicalFeature {
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  additionalInfo?: {
    formation?: string;
    age?: string;
    significance?: string;
  };
}

interface GeologicalContext {
  tectonicPlates: string[];
  faultLines: string[];
  riskFactors: string[];
  geologicalFeatures: GeologicalFeature[];
}

// Enhance the ETHIOPIAN_GEOLOGICAL_REGIONS with more detailed information
const ETHIOPIAN_GEOLOGICAL_REGIONS = [
  {
    name: 'Great Rift Valley',
    coordinates: [8.5, 39.5],
    radius: 250,
    geologicalContext: {
      tectonicPlates: ['African Plate', 'Arabian Plate'],
      faultLines: ['Main Ethiopian Rift', 'Afar Triple Junction'],
      riskFactors: [
        'Active volcanic region',
        'Frequent tectonic movements',
        'High seismic potential'
      ],
      geologicalFeatures: [
        {
          name: 'Rift Valley Formation',
          description: 'Ongoing continental drift causing significant geological activity',
          icon: Mountain,
          additionalInfo: {
            formation: 'Divergent plate boundary',
            age: 'Formed approximately 20-25 million years ago',
            significance: 'One of the most active rift systems globally'
          }
        },
        {
          name: 'Volcanic Zones',
          description: 'Multiple active and dormant volcanic systems',
          icon: Flame,
          additionalInfo: {
            formation: 'Magmatic activity due to plate separation',
            age: 'Continuous volcanic activity over millions of years',
            significance: 'Critical for understanding geological evolution'
          }
        }
      ]
    }
  },
  {
    name: 'Addis Ababa Metropolitan',
    coordinates: [9.0, 38.7],
    radius: 100,
    geologicalContext: {
      tectonicPlates: ['African Plate'],
      faultLines: ['Central Ethiopian Rift'],
      riskFactors: [
        'Dense urban population',
        'Mixed geological formations',
        'Potential infrastructure vulnerability'
      ],
      geologicalFeatures: [
        {
          name: 'Urban Geological Zone',
          description: 'Complex urban geological environment',
          icon: Mountain
        }
      ]
    }
  },
  {
    name: 'Afar Triangle',
    coordinates: [11.5, 40.5],
    radius: 300,
    geologicalContext: {
      tectonicPlates: ['African Plate', 'Arabian Plate', 'Somali Plate'],
      faultLines: ['Afar Triple Junction', 'East African Rift'],
      riskFactors: [
        'Divergent plate boundary',
        'Highest geological activity in Ethiopia',
        'Continuous geological transformation'
      ],
      geologicalFeatures: [
        {
          name: 'Tectonic Boundary',
          description: 'Intersection of multiple tectonic plates',
          icon: Flame
        }
      ]
    }
  },
  {
    name: 'Tigray Highlands',
    coordinates: [13.5, 39.5],
    radius: 200,
    geologicalContext: {
      tectonicPlates: ['African Plate'],
      faultLines: ['Northern Ethiopian Rift'],
      riskFactors: [
        'Mountainous terrain',
        'Complex geological structure',
        'Moderate seismic activity'
      ],
      geologicalFeatures: [
        {
          name: 'Highland Geological Zone',
          description: 'Mountainous terrain with complex geological formations',
          icon: Mountain
        }
      ]
    }
  }
];

export function RiskHeatMap({ earthquakes }: { earthquakes: Earthquake[] }) {
  const [selectedRegion, setSelectedRegion] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'risk' | 'details'>('risk');

  const regionRiskData = useMemo(() => 
    ETHIOPIAN_GEOLOGICAL_REGIONS.map(region => {
      const nearbyQuakes = earthquakes.filter(quake => 
        calculateDistance(
          region.coordinates[0], 
          region.coordinates[1], 
          quake.location.lat, 
          quake.location.lng
        ) <= region.radius
      );

      const recentQuakes = nearbyQuakes.filter(quake => 
        (Date.now() - new Date(quake.time).getTime()) < 90 * 24 * 60 * 60 * 1000
      );

      const magnitudes = recentQuakes.map(q => q.magnitude);
      const avgMagnitude = magnitudes.length > 0 
        ? magnitudes.reduce((a, b) => a + b, 0) / magnitudes.length 
        : 0;

      const riskScore = 
        (avgMagnitude * 40) +  
        (recentQuakes.length * 30) +  
        (region.geologicalContext.riskFactors.length * 10);  

      const riskLevel: RiskLevel = 
        riskScore > 80 ? 'critical' :
        riskScore > 60 ? 'high' :
        riskScore > 40 ? 'moderate' : 
        'low';

      return {
        ...region,
        quakeCount: nearbyQuakes.length,
        recentQuakeCount: recentQuakes.length,
        avgMagnitude,
        riskScore,
        riskLevel
      };
    }), 
    [earthquakes]
  );

  const ethiopiaRiskZones: FeatureCollection<Point> = {
    type: 'FeatureCollection',
    features: regionRiskData.map(region => ({
      type: 'Feature',
      properties: { 
        ...region,
        description: `Risk Level: ${region.riskLevel.toUpperCase()}`
      },
      geometry: {
        type: 'Point',
        coordinates: [region.coordinates[1], region.coordinates[0]]
      }
    } as Feature<Point>))
  };

  const getRegionStyle = (feature: Feature) => {
    const properties = feature.properties as any;
    const riskLevel = properties.riskLevel as RiskLevel;

    return {
      fillColor: RISK_COLORS[riskLevel],
      radius: 20,
      weight: 2,
      opacity: 1,
      color: 'white',
      fillOpacity: 0.7
    };
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Ethiopia Seismic Risk Visualization
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        <div className="flex items-center gap-4">
          <Select 
            value={selectedRegion?.name || ''} 
            onValueChange={(value) => {
              const region = regionRiskData.find(r => r.name === value);
              setSelectedRegion(region);
              setActiveTab('details');
            }}
          >
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Select a region to analyze" />
            </SelectTrigger>
            <SelectContent>
              {regionRiskData.map((region) => (
                <SelectItem key={region.name} value={region.name}>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {region.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedRegion && (
            <Badge variant={getRiskBadgeVariant(selectedRegion.riskLevel)}>
              {selectedRegion.riskLevel.toUpperCase()} RISK
            </Badge>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab as any}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="risk">
              <AlertTriangle className="mr-2 h-4 w-4" />
              Risk Overview
            </TabsTrigger>
            <TabsTrigger value="details">
              <Shield className="mr-2 h-4 w-4" />
              Geological Details
            </TabsTrigger>
          </TabsList>
          <TabsContent value="risk" className="h-[500px]">
            <MapContainer 
              center={[9.145, 40.489]} 
              zoom={6} 
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <GeoJSON 
                data={ethiopiaRiskZones} 
                pointToLayer={(feature, latlng) => {
                  const marker = L.circleMarker(latlng, getRegionStyle(feature));
                  
                  marker.on({
                    click: () => {
                      // Update selected region on click
                      setSelectedRegion(feature.properties);
                      setActiveTab('details');
                    },
                    mouseover: () => {
                      marker.bindPopup(
                        `<b>${feature.properties.name}</b><br>` +
                        `Risk Level: ${feature.properties.riskLevel.toUpperCase()}<br>` +
                        `Recent Earthquakes: ${feature.properties.recentQuakeCount}`
                      ).openPopup();
                    }
                  });
                  
                  return marker;
                }}
              />
            </MapContainer>
          </TabsContent>
          <TabsContent value="details">
            {selectedRegion ? (
              <div className="space-y-6 p-4 bg-muted rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    <h3 className="text-xl font-bold">{selectedRegion.name}</h3>
                  </div>
                  <Badge 
                    variant={getRiskBadgeVariant(selectedRegion.riskLevel)}
                  >
                    {selectedRegion.riskLevel.toUpperCase()} RISK
                  </Badge>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-background p-4 rounded-lg">
                    <h4 className="font-semibold flex items-center mb-3">
                      <Waves className="mr-2 h-5 w-5 text-blue-500" /> 
                      Tectonic Plates
                    </h4>
                    <div className="space-y-2">
                      {selectedRegion.geologicalContext.tectonicPlates.map((plate: string) => (
                        <div key={plate} className="flex items-center gap-3">
                          <Shield className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{plate}</p>
                            <p className="text-xs text-muted-foreground">
                              {plate === 'African Plate' 
                                ? 'Primary continental plate covering most of Africa' 
                                : 'Secondary tectonic plate in the region'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-background p-4 rounded-lg">
                    <h4 className="font-semibold flex items-center mb-3">
                      <TrendingUp className="mr-2 h-5 w-5 text-red-500" /> 
                      Fault Lines
                    </h4>
                    <div className="space-y-2">
                      {selectedRegion.geologicalContext.faultLines.map((fault: string) => (
                        <div key={fault} className="flex items-center gap-3">
                          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{fault}</p>
                            <p className="text-xs text-muted-foreground">
                              {fault === 'Main Ethiopian Rift' 
                                ? 'Primary geological boundary with high seismic activity' 
                                : 'Secondary fault line with potential geological stress'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-background p-4 rounded-lg">
                    <h4 className="font-semibold flex items-center mb-3">
                      <Mountain className="mr-2 h-5 w-5 text-green-500" /> 
                      Risk Factors
                    </h4>
                    <div className="space-y-2">
                      {selectedRegion.geologicalContext.riskFactors.map((factor: string) => (
                        <div key={factor} className="flex items-center gap-3">
                          <Shield className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{factor}</p>
                            <p className="text-xs text-muted-foreground">
                              {factor === 'Active volcanic region' 
                                ? 'Continuous geological transformation and potential hazards' 
                                : 'Significant geological risk factor'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-background p-4 rounded-lg">
                  <h4 className="font-semibold mb-4 flex items-center">
                    <Globe className="mr-2 h-5 w-5" /> Detailed Geological Features
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    {(selectedRegion.geologicalContext.geologicalFeatures || []).map((feature: GeologicalFeature) => {
                      const FeatureIcon = feature.icon || Mountain;
                      return (
                        <div 
                          key={feature.name} 
                          className="border p-4 rounded-lg hover:bg-muted/50 transition space-y-3"
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <FeatureIcon className="h-6 w-6 text-muted-foreground" />
                            <h5 className="font-semibold text-lg">{feature.name}</h5>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {feature.description}
                          </p>
                          {feature.additionalInfo && (
                            <div className="space-y-1">
                              {feature.additionalInfo.formation && (
                                <div className="flex items-center gap-2">
                                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                  <p className="text-xs">
                                    <span className="font-medium">Formation:</span> {feature.additionalInfo.formation}
                                  </p>
                                </div>
                              )}
                              {feature.additionalInfo.age && (
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-muted-foreground" />
                                  <p className="text-xs">
                                    <span className="font-medium">Age:</span> {feature.additionalInfo.age}
                                  </p>
                                </div>
                              )}
                              {feature.additionalInfo.significance && (
                                <div className="flex items-center gap-2">
                                  <Star className="h-4 w-4 text-muted-foreground" />
                                  <p className="text-xs">
                                    <span className="font-medium">Significance:</span> {feature.additionalInfo.significance}
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-background p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center">
                    <TrendingUp className="mr-2 h-5 w-5" /> Seismic Statistics
                  </h4>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Quakes</p>
                      <p className="font-bold text-lg">{selectedRegion.quakeCount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Avg Magnitude</p>
                      <p className="font-bold text-lg">{selectedRegion.avgMagnitude.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Risk Score</p>
                      <p className="font-bold text-lg">{selectedRegion.riskScore.toFixed(0)}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center p-4 text-muted-foreground">
                Select a region to view detailed geological information
              </div>
            )}
          </TabsContent>
        </Tabs>

        <p className="text-xs text-muted-foreground text-center">
          <strong>Note:</strong> Risk assessment based on geological surveys, 
          recent seismic activity, and expert analysis.
        </p>
      </CardContent>
    </Card>
  );
} 
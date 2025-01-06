'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Book, 
  Video, 
  FileText, 
  Link as LinkIcon, 
  MapPin, 
  Globe, 
  Smartphone, 
  Shield 
} from 'lucide-react';

const COMPREHENSIVE_RESOURCES = {
  internationalResources: [
    {
      title: 'USGS Earthquake Hazards Program',
      description: 'Comprehensive global earthquake monitoring and research',
      link: 'https://earthquake.usgs.gov/',
      icon: Globe,
    },
    {
      title: 'United Nations Disaster Risk Reduction',
      description: 'Global disaster preparedness and mitigation strategies',
      link: 'https://www.undrr.org/',
      icon: Shield,
    }
  ],
  mobileApps: [
    {
      title: 'QuakeAlert',
      description: 'Real-time earthquake alerts and safety information',
      link: 'https://play.google.com/store/apps/details?id=example',
      icon: Smartphone,
    }
  ],
  technicalReports: [
    {
      title: 'Ethiopian Seismic Hazard Assessment',
      description: 'Detailed geological and seismic risk analysis for Ethiopia',
      link: 'https://example.com/ethiopia-seismic-report',
      icon: FileText,
    }
  ]
};

interface ResourceSectionProps {
  title: string;
  resources: Array<{
    title: string, 
    description: string, 
    link: string, 
    icon: React.ComponentType<{ className?: string }>
  }>;
  SectionIcon: React.ComponentType<{ className?: string }>;
}

function ResourceSection({ 
  title, 
  resources, 
  SectionIcon 
}: ResourceSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 border-b pb-2">
        <SectionIcon className="h-5 w-5" />
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      {resources.map((resource, index) => (
        <a
          key={index}
          href={resource.link}
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-lg border p-4 hover:bg-muted/50 transition"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <resource.icon className="h-6 w-6 text-muted-foreground" />
              <div>
                <h4 className="font-medium">{resource.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {resource.description}
                </p>
              </div>
            </div>
            <LinkIcon className="h-4 w-4 text-muted-foreground" />
          </div>
        </a>
      ))}
    </div>
  );
}

export function ComprehensiveResources() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Book className="h-5 w-5" />
          Comprehensive Resources
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <ResourceSection
          title="International Resources"
          resources={COMPREHENSIVE_RESOURCES.internationalResources}
          SectionIcon={Globe}
        />
        <ResourceSection
          title="Mobile Apps"
          resources={COMPREHENSIVE_RESOURCES.mobileApps}
          SectionIcon={Smartphone}
        />
        <ResourceSection
          title="Technical Reports"
          resources={COMPREHENSIVE_RESOURCES.technicalReports}
          SectionIcon={FileText}
        />
      </CardContent>
    </Card>
  );
} 
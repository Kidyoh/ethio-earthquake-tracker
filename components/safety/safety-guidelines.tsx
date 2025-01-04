'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Shield, Siren, HelpCircle } from 'lucide-react';

const SAFETY_GUIDELINES = {
  before: [
    { title: 'Create an Emergency Kit', content: 'Include water, food, first-aid supplies, flashlights, and batteries' },
    { title: 'Know Safe Spots', content: 'Identify safe places in each room - under sturdy tables, against interior walls' },
    { title: 'Practice Drills', content: 'Conduct family earthquake drills and establish meeting points' },
  ],
  during: [
    { title: 'Drop, Cover, Hold', content: 'Drop to the ground, take cover under sturdy furniture, hold on until shaking stops' },
    { title: 'Stay Inside', content: 'If indoors, stay there. Most injuries occur when people try to move to different locations' },
    { title: 'If Outside', content: 'Move to a clear area away from buildings, trees, streetlights, and power lines' },
  ],
  after: [
    { title: 'Check for Injuries', content: 'Provide first aid for anyone who needs it' },
    { title: 'Inspect Home', content: 'Check for damage, especially gas, water, and electrical lines' },
    { title: 'Monitor News', content: 'Listen to local news for emergency information and instructions' },
  ],
};

export function SafetyGuidelines() {
  const [activeTab, setActiveTab] = useState('before');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Safety Guidelines
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="before" className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              Before
            </TabsTrigger>
            <TabsTrigger value="during" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              During
            </TabsTrigger>
            <TabsTrigger value="after" className="flex items-center gap-2">
              <Siren className="h-4 w-4" />
              After
            </TabsTrigger>
          </TabsList>
          {Object.entries(SAFETY_GUIDELINES).map(([phase, guidelines]) => (
            <TabsContent key={phase} value={phase}>
              <div className="grid gap-4">
                {guidelines.map((guideline, index) => (
                  <div key={index} className="space-y-2">
                    <h3 className="font-semibold">{guideline.title}</h3>
                    <p className="text-sm text-muted-foreground">{guideline.content}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
} 
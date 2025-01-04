'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

const SAFETY_TIPS = [
  'Create an emergency kit with essential supplies.',
  'Know safe spots in your home, such as under sturdy furniture.',
  'Practice earthquake drills with your family.',
  'Stay indoors during shaking; do not run outside.',
  'After an earthquake, check for injuries and hazards.',
];

export function SafetyTips() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Safety Tips
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="list-disc pl-5 space-y-2">
          {SAFETY_TIPS.map((tip, index) => (
            <li key={index} className="text-sm text-muted-foreground">
              {tip}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
} 
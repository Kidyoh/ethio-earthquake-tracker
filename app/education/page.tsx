'use client';

import { EducationalResources } from '@/components/education/resources';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, AlertTriangle, Info } from 'lucide-react';

const SAFETY_CHECKLIST = [
  {
    category: 'Home Preparation',
    items: [
      'Secure heavy furniture to walls',
      'Install latches on cabinets',
      'Know how to shut off utilities',
      'Have emergency supplies ready',
    ],
  },
  {
    category: 'Emergency Kit',
    items: [
      'Water (1 gallon per person per day)',
      'Non-perishable food',
      'First aid supplies',
      'Flashlights and batteries',
      'Battery-powered radio',
    ],
  },
  {
    category: 'Communication Plan',
    items: [
      'Family emergency contact list',
      'Out-of-area contact person',
      'Planned meeting locations',
      'Emergency contact cards',
    ],
  },
];

export default function EducationPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Info className="h-6 w-6" />
        <h1 className="text-3xl font-bold">Education & Resources</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <EducationalResources />
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Personal Safety Checklist
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {SAFETY_CHECKLIST.map((section, index) => (
                <div key={index} className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    {section.category}
                  </h3>
                  <ul className="space-y-2">
                    {section.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-2">
                        <div className="h-6 w-6 flex-shrink-0">
                          <input 
                            type="checkbox" 
                            className="h-4 w-4 mt-1 rounded border-gray-300"
                          />
                        </div>
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 
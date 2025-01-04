'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, AlertTriangle, Heart } from 'lucide-react';

const safetyTips = {
  before: [
    {
      title: {
        en: 'Create an Emergency Kit',
        am: 'የድንገተኛ አደጋ ዕቃዎችን ያዘጋጁ',
        om: 'Meeshaalee Ariitii Qopheessuu',
      },
      content: {
        en: 'Prepare a basic emergency kit with water, food, first-aid supplies, and important documents.',
        am: 'መሰረታዊ የድንገተኛ አደጋ ዕቃዎችን እንደ ውሃ፣ ምግብ፣ የመጀመሪያ እርዳታ እቃዎች እና አስፈላጊ ሰነዶችን ያዘጋጁ።',
        om: 'Meeshaalee ariitii bu\'uura ta\'an kan akka bishaan, nyaata, meeshaalee fayyaa fi sanadoota barbaachisoo ta\'an qopheeffadhu.',
      },
    },
    // Add more tips...
  ],
  during: [
    {
      title: {
        en: 'Drop, Cover, and Hold On',
        am: 'ወድቅ፣ ተሸፍን እና ያዝ',
        om: 'Kufi, Haguugi, fi Qabadhu',
      },
      content: {
        en: 'Drop to the ground, take cover under a sturdy desk or table, and hold on until the shaking stops.',
        am: 'ወደ መሬት ይውደቁ፣ በጠንካራ ጠረጴዛ ስር ይሸፈኑ እና መንቀጥቀጡ እስኪያቆም ድረስ ይያዙ።',
        om: 'Lafa ciisi, meeshaa jabaaa jala seeni, fi sochoʼiinsi hanga dhaabbatu qabadhu.',
      },
    },
    // Add more tips...
  ],
  after: [
    {
      title: {
        en: 'Check for Injuries',
        am: 'ጉዳቶችን ይፈትሹ',
        om: 'Miidhaa Ilaaluu',
      },
      content: {
        en: 'Check yourself and others for injuries. Provide first aid if needed.',
        am: 'እራስዎን እና ሌሎችን ለጉዳት ይፈትሹ። አስፈላጊ ከሆነ የመጀመሪያ እርዳታ ይስጡ።',
        om: 'Ofii fi namoota biroo miidhaa ilaalaa. Yoo barbaachise, gargaarsa duraa kenni.',
      },
    },
    // Add more tips...
  ],
};

export default function SafetyPage() {
  const [language, setLanguage] = useState('en');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Safety Guidelines</h1>
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="am">አማርኛ</SelectItem>
            <SelectItem value="om">Afaan Oromoo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="before">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="before">Before</TabsTrigger>
          <TabsTrigger value="during">During</TabsTrigger>
          <TabsTrigger value="after">After</TabsTrigger>
        </TabsList>

        <TabsContent value="before">
          <div className="grid gap-6 md:grid-cols-2">
            {safetyTips.before.map((tip, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-primary" />
                    {tip.title[language as keyof typeof tip.title]}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {tip.content[language as keyof typeof tip.content]}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="during">
          <div className="grid gap-6 md:grid-cols-2">
            {safetyTips.during.map((tip, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2 text-destructive" />
                    {tip.title[language as keyof typeof tip.title]}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {tip.content[language as keyof typeof tip.content]}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="after">
          <div className="grid gap-6 md:grid-cols-2">
            {safetyTips.after.map((tip, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Heart className="h-5 w-5 mr-2 text-primary" />
                    {tip.title[language as keyof typeof tip.title]}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {tip.content[language as keyof typeof tip.content]}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
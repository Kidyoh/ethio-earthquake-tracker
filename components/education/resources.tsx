'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Book, Video, FileText, Link as LinkIcon, MapPin } from 'lucide-react';

const RESOURCES = {
  articles: [
    {
      title: 'Understanding Ethiopian Seismic Activity',
      description: "Learn about the East African Rift System and its impact on Ethiopia's seismic activity",
      link: 'https://earthquake.usgs.gov/earthquakes/map/',
    },
    {
      title: 'Building Safety in Seismic Zones',
      description: 'Guidelines for construction and building safety in earthquake-prone areas of Ethiopia',
      link: 'https://www.preventionweb.net/files/15255_guidelinesonseismicdesignethiopia.pdf',
    },
    {
      title: 'Early Warning Systems',
      description: 'How Ethiopia earthquake early warning systems work and what they mean for you',
      link: 'https://www.undrr.org/publication/early-warning-systems',
    },
    {
      title: 'Historical Earthquakes in Ethiopia',
      description: 'A comprehensive look at major seismic events in Ethiopian history',
      link: 'https://www.researchgate.net/publication/274458384_Seismic_Hazard_Assessment_for_Ethiopia',
    },
  ],
  videos: [
    {
      title: 'Earthquake Safety in Amharic',
      description: 'A comprehensive guide to earthquake preparedness in Amharic language',
      link: 'https://www.youtube.com/watch?v=example1',
    },
    {
      title: 'Ethiopian Geological Survey',
      description: 'Official educational content from the Ethiopian Geological Survey',
      link: 'https://www.youtube.com/watch?v=example2',
    },
    {
      title: 'Drop, Cover, and Hold On',
      description: 'Demonstration of proper earthquake safety techniques',
      link: 'https://www.youtube.com/watch?v=example3',
    },
    {
      title: 'Building Earthquake Resilient Communities',
      description: 'Community preparedness and response strategies for Ethiopian context',
      link: 'https://www.youtube.com/watch?v=example4',
    },
  ],
  localResources: [
    {
      title: 'Ethiopian Seismological Network',
      description: 'Real-time seismic monitoring and data from Ethiopian stations',
      link: 'http://www.geobs.net/',
    },
    {
      title: 'National Disaster Risk Management Commission',
      description: 'Official government resources and guidelines',
      link: 'https://ndrmc.gov.et/',
    },
  ],
};

export function EducationalResources() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Book className="h-5 w-5" />
          Educational Resources
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="articles">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="articles">
              <FileText className="mr-2 h-4 w-4" />
              Articles
            </TabsTrigger>
            <TabsTrigger value="videos">
              <Video className="mr-2 h-4 w-4" />
              Videos
            </TabsTrigger>
            <TabsTrigger value="local">
              <MapPin className="mr-2 h-4 w-4" />
              Local Resources
            </TabsTrigger>
          </TabsList>
          <TabsContent value="articles" className="space-y-4">
            {RESOURCES.articles.map((article, index) => (
              <a
                key={index}
                href={article.link}
                className="block rounded-lg border p-4 hover:bg-muted/50"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{article.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {article.description}
                    </p>
                  </div>
                  <LinkIcon className="h-4 w-4" />
                </div>
              </a>
            ))}
          </TabsContent>
          <TabsContent value="videos" className="space-y-4">
            {RESOURCES.videos.map((video, index) => (
              <a
                key={index}
                href={video.link}
                className="block rounded-lg border p-4 hover:bg-muted/50"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{video.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {video.description}
                    </p>
                  </div>
                  <Video className="h-4 w-4" />
                </div>
              </a>
            ))}
          </TabsContent>
          <TabsContent value="local" className="space-y-4">
            {RESOURCES.localResources.map((resource, index) => (
              <a
                key={index}
                href={resource.link}
                className="block rounded-lg border p-4 hover:bg-muted/50"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{resource.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {resource.description}
                    </p>
                  </div>
                  <MapPin className="h-4 w-4" />
                </div>
              </a>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 
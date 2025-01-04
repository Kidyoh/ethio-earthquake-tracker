import { AnalyticsEvent, EarthquakeStats } from '../types';

export class AnalyticsService {
  private static instance: AnalyticsService;
  private events: AnalyticsEvent[] = [];
  private batchSize = 10;
  private flushInterval = 30000; // 30 seconds

  private constructor() {
    setInterval(() => this.flush(), this.flushInterval);
  }

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  trackEvent(event: AnalyticsEvent) {
    this.events.push({
      ...event,
      timestamp: new Date().toISOString(),
    });

    if (this.events.length >= this.batchSize) {
      this.flush();
    }
  }

  private async flush() {
    if (this.events.length === 0) return;

    const eventsToSend = [...this.events];
    this.events = [];

    try {
      await fetch('/api/analytics/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventsToSend),
      });
    } catch (error) {
      console.error('Error flushing analytics:', error);
      // Restore events on failure
      this.events = [...eventsToSend, ...this.events];
    }
  }

  async getEarthquakeStats(
    startDate: Date,
    endDate: Date
  ): Promise<EarthquakeStats> {
    try {
      const response = await fetch('/api/analytics/earthquake-stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startDate, endDate }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch earthquake stats');
      }

      return response.json();
    } catch (error) {
      console.error('Error fetching earthquake stats:', error);
      throw error;
    }
  }
} 
import { EmergencyService } from '../types';
import { calculateDistance, sortByDistance } from '../utils/distance';

export class EmergencyServicesAPI {
  private static instance: EmergencyServicesAPI;
  private cache: Map<string, EmergencyService[]> = new Map();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  private constructor() {}

  static getInstance(): EmergencyServicesAPI {
    if (!EmergencyServicesAPI.instance) {
      EmergencyServicesAPI.instance = new EmergencyServicesAPI();
    }
    return EmergencyServicesAPI.instance;
  }

  async getNearbyServices(
    lat: number, 
    lng: number, 
    type?: string,
    radius: number = 10000
  ): Promise<EmergencyService[]> {
    const cacheKey = `${lat}-${lng}-${type}-${radius}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      const response = await fetch(`/api/emergency-services`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat, lng, type, radius }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch emergency services');
      }

      const services: EmergencyService[] = await response.json();
      const sortedServices = sortByDistance(services, lat, lng);
      
      this.cache.set(cacheKey, sortedServices);
      setTimeout(() => this.cache.delete(cacheKey), this.cacheTimeout);
      
      return sortedServices;
    } catch (error) {
      console.error('Error fetching emergency services:', error);
      throw error;
    }
  }

  async getDirections(
    startLat: number,
    startLng: number,
    endLat: number,
    endLng: number,
    mode: 'driving' | 'walking' = 'driving'
  ) {
    try {
      const response = await fetch(`/api/directions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          start: { lat: startLat, lng: startLng },
          end: { lat: endLat, lng: endLng },
          mode,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch directions');
      }

      return response.json();
    } catch (error) {
      console.error('Error fetching directions:', error);
      throw error;
    }
  }
} 
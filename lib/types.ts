export interface Earthquake {
  id: string;
  magnitude: number;
  location: {
    lat: number;
    lng: number;
    place: string;
  };
  time: string;
  depth: number;
  tsunami: number;
}

export interface EmergencyService {
  id: string;
  name: string;
  type: 'hospital' | 'shelter' | 'police' | 'fire';
  location: {
    lat: number;
    lng: number;
  };
  address: string;
  phone: string;
}

export interface DamageReport {
  id: string;
  userId: string;
  location: {
    lat: number;
    lng: number;
  };
  description: string;
  severity: 'low' | 'medium' | 'high';
  images?: string[];
  timestamp: string;
}

export interface SafetyTip {
  id: string;
  phase: 'before' | 'during' | 'after';
  title: {
    en: string;
    am: string; // Amharic
    om: string; // Oromo
  };
  content: {
    en: string;
    am: string;
    om: string;
  };
  icon?: string;
}

export interface EarthquakeStats {
  last24Hours: number;
  averageMagnitude: number;
  highestMagnitude: number;
  totalEvents: number;
}

export interface AnalyticsEvent {
  type: string;
  data: any;
  timestamp?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  notificationEnabled: boolean;
  notificationThreshold: number;
  language: 'en' | 'am' | 'om';
  location?: {
    lat: number;
    lng: number;
  };
}
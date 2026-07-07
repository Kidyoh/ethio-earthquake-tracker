'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { WatchedRegion } from '@/lib/types';

interface SettingsContextType {
  notifications: boolean;
  sound: boolean;
  minMagnitude: number;
  radius: number;
  location: { lat: number; lng: number } | null;
  watchedRegions: WatchedRegion[];
  setNotifications: (enabled: boolean) => void;
  setSound: (enabled: boolean) => void;
  setMinMagnitude: (magnitude: number) => void;
  setRadius: (radius: number) => void;
  setLocation: (location: { lat: number; lng: number } | null) => void;
  addWatchedRegion: (region: Omit<WatchedRegion, 'id'>) => void;
  removeWatchedRegion: (id: string) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('earthquake-settings');
      if (saved) {
        return { watchedRegions: [], ...JSON.parse(saved) };
      }
    }
    return {
      notifications: false,
      sound: true,
      minMagnitude: 3,
      radius: 100,
      location: null,
      watchedRegions: [],
    };
  });

  useEffect(() => {
    localStorage.setItem('earthquake-settings', JSON.stringify(settings));
  }, [settings]);

  const setNotifications = (enabled: boolean) => 
    setSettings((prev: any) => ({ ...prev, notifications: enabled }));
  
  const setSound = (enabled: boolean) => 
    setSettings((prev: any) => ({ ...prev, sound: enabled }));
  
  const setMinMagnitude = (magnitude: number) => 
    setSettings((prev: any) => ({ ...prev, minMagnitude: magnitude }));
  
  const setRadius = (radius: number) => 
    setSettings((prev: any) => ({ ...prev, radius }));
  
  const setLocation = (location: { lat: number; lng: number } | null) =>
    setSettings((prev: any) => ({ ...prev, location }));

  const addWatchedRegion = (region: Omit<WatchedRegion, 'id'>) =>
    setSettings((prev: any) => ({
      ...prev,
      watchedRegions: [
        ...(prev.watchedRegions ?? []),
        { ...region, id: Math.random().toString(36).slice(2, 9) },
      ],
    }));

  const removeWatchedRegion = (id: string) =>
    setSettings((prev: any) => ({
      ...prev,
      watchedRegions: (prev.watchedRegions ?? []).filter((r: WatchedRegion) => r.id !== id),
    }));

  return (
    <SettingsContext.Provider value={{
      ...settings,
      setNotifications,
      setSound,
      setMinMagnitude,
      setRadius,
      setLocation,
      addWatchedRegion,
      removeWatchedRegion,
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
} 
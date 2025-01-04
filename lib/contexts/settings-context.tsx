'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface SettingsContextType {
  notifications: boolean;
  sound: boolean;
  minMagnitude: number;
  radius: number;
  location: { lat: number; lng: number } | null;
  setNotifications: (enabled: boolean) => void;
  setSound: (enabled: boolean) => void;
  setMinMagnitude: (magnitude: number) => void;
  setRadius: (radius: number) => void;
  setLocation: (location: { lat: number; lng: number } | null) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('earthquake-settings');
      if (saved) {
        return JSON.parse(saved);
      }
    }
    return {
      notifications: false,
      sound: true,
      minMagnitude: 3,
      radius: 100,
      location: null,
    };
  });

  useEffect(() => {
    localStorage.setItem('earthquake-settings', JSON.stringify(settings));
  }, [settings]);

  const setNotifications = (enabled: boolean) => 
    setSettings(prev => ({ ...prev, notifications: enabled }));
  
  const setSound = (enabled: boolean) => 
    setSettings(prev => ({ ...prev, sound: enabled }));
  
  const setMinMagnitude = (magnitude: number) => 
    setSettings(prev => ({ ...prev, minMagnitude: magnitude }));
  
  const setRadius = (radius: number) => 
    setSettings(prev => ({ ...prev, radius }));
  
  const setLocation = (location: { lat: number; lng: number } | null) => 
    setSettings(prev => ({ ...prev, location }));

  return (
    <SettingsContext.Provider value={{
      ...settings,
      setNotifications,
      setSound,
      setMinMagnitude,
      setRadius,
      setLocation,
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
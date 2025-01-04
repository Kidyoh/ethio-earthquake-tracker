import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
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

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      notifications: false,
      sound: true,
      minMagnitude: 3,
      radius: 100,
      location: null,
      setNotifications: (enabled) => set({ notifications: enabled }),
      setSound: (enabled) => set({ sound: enabled }),
      setMinMagnitude: (magnitude) => set({ minMagnitude: magnitude }),
      setRadius: (radius) => set({ radius: radius }),
      setLocation: (location) => set({ location }),
    }),
    {
      name: 'earthquake-settings',
    }
  )
); 
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  notifications: boolean;
  sound: boolean;
  minMagnitude: number;
  radius: number;
  location: { lat: number; lng: number } | null;
  setNotifications: (enabled: boolean) => void;
  // ... other methods
}

export const useGlobalSettings = create<SettingsState>()(
  persist(
    (set, get) => ({
      notifications: false,
      sound: true,
      minMagnitude: 3,
      radius: 100,
      location: null,
      setNotifications: (enabled) => set({ notifications: enabled }),
      // Add other methods
    }),
    {
      name: 'earthquake-settings',
    }
  )
); 
import { ExtendedNotificationOptions } from './types/notifications';
import { useSettings } from './contexts/settings-context';
import { Earthquake } from './types';

export async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    console.warn('Notifications not supported');
    return false;
  }

  const permission = await Notification.requestPermission();
  return permission === 'granted';
}

export function canSendNotification(earthquake: Earthquake, settings: any) {
  // Check if notifications are enabled
  if (!settings.notifications) return false;

  // Check magnitude threshold
  if (earthquake.magnitude < settings.minMagnitude) return false;

  // Optional: Check distance if location is set
  if (settings.location) {
    const distance = calculateDistance(
      settings.location.lat, 
      settings.location.lng, 
      earthquake.location.lat, 
      earthquake.location.lng
    );
    
    if (distance > settings.radius) return false;
  }

  return true;
}

export function sendEarthquakeNotification(
  earthquake: Earthquake, 
  settings: any
) {
  if (!canSendNotification(earthquake, settings)) return;

  const title = `Earthquake Alert: Magnitude ${earthquake.magnitude}`;
  const options: ExtendedNotificationOptions = {
    body: `Location: ${earthquake.location.place}`,
    icon: '/icons/icon-192x192.png',
    vibrate: [200, 100, 200],
    tag: 'earthquake-alert',
    data: {
      earthquakeId: earthquake.id,
      location: earthquake.location,
    }
  };

  if (settings.sound) {
    // You could add a sound here if needed
    // new Audio('/path/to/alert-sound.mp3').play();
  }

  return new Notification(title, options);
}

function calculateDistance(
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

export function setupServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration) => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error);
      });
  }
} 
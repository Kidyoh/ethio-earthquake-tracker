import { ExtendedNotificationOptions } from './types/notifications';

export async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    return false;
  }

  let permission = await Notification.requestPermission();
  return permission === 'granted';
}

export async function sendNotification(title: string, options: ExtendedNotificationOptions) {
  if (!('Notification' in window)) {
    return;
  }

  if (Notification.permission === 'granted') {
    return new Notification(title, options);
  }
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
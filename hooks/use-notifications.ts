import { useState, useEffect } from 'react';
import { requestNotificationPermission } from '@/lib/notifications';
import { useSettings } from '@/lib/contexts/settings-context';

export function useNotifications() {
  const [notificationStatus, setNotificationStatus] = useState<'pending' | 'granted' | 'denied'>('pending');
  const settings = useSettings();

  useEffect(() => {
    const checkNotificationStatus = async () => {
      if (!('Notification' in window)) {
        setNotificationStatus('denied');
        return;
      }

      const status = Notification.permission;
      setNotificationStatus(status as any);
    };

    checkNotificationStatus();
  }, []);

  const requestPermission = async () => {
    const granted = await requestNotificationPermission();
    setNotificationStatus(granted ? 'granted' : 'denied');
    settings.setNotifications(granted);
  };

  return {
    status: notificationStatus,
    requestPermission,
  };
} 
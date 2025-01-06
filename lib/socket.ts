import { createContext, useContext } from 'react';
import { toast } from '@/hooks/use-toast';
import { Earthquake } from './types';
import { sendEarthquakeNotification } from './notifications';
import { useGlobalSettings } from './stores/global-settings';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'wss://your-earthquake-websocket-server';

export class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private listeners: ((data: any) => void)[] = [];
  private settings: any;

  constructor(
    private url: string = WS_URL, 
    private getSettings: () => any
  ) {
    this.settings = this.getSettings();
  }

  connect() {
    try {
      this.ws = new WebSocket(this.url);
      
      this.ws.onopen = () => {
        console.log('WebSocket Connected');
        this.reconnectAttempts = 0;
      };

      this.ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'earthquake') {
          this.notifyListeners(data);
          this.showNotification(data);
        }
      };

      this.ws.onclose = () => {
        console.log('WebSocket Disconnected');
        this.attemptReconnect();
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket Error:', error);
      };
    } catch (error) {
      console.error('WebSocket Connection Error:', error);
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(`Attempting to reconnect... (${this.reconnectAttempts})`);
        this.connect();
      }, 5000 * this.reconnectAttempts);
    }
  }

  private showNotification(data: Earthquake) {
    const settings = useGlobalSettings.getState();
    sendEarthquakeNotification(data, settings);
  }

  addListener(callback: (data: any) => void) {
    this.listeners.push(callback);
  }

  removeListener(callback: (data: any) => void) {
    this.listeners = this.listeners.filter(listener => listener !== callback);
  }

  private notifyListeners(data: any) {
    this.listeners.forEach(listener => listener(data));
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
    }
  }
}

export const WebSocketContext = createContext<WebSocketService | null>(null);

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
}; 
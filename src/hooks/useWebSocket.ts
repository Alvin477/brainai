import { useState, useEffect } from 'react';

interface GlobalState {
  age: number;
  message: string;
  transaction: string | null;
  connectedClients: number;
}

const WS_URL = import.meta.env.PROD 
  ? 'wss://api.brainterminal.live'  // Production URL using secure WebSocket
  : 'ws://localhost:8080';          // Development URL

export const useWebSocket = () => {
  const [globalState, setGlobalState] = useState<GlobalState>({
    age: 1,
    message: "Initializing...",
    transaction: null,
    connectedClients: 0
  });

  useEffect(() => {
    const ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      console.log('Connected to WebSocket server');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setGlobalState(data);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      ws.close();
    };
  }, []);

  return { globalState };
};
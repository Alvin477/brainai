import { useState, useEffect } from 'react';

interface GlobalState {
  age: number;
  message: string;
  transaction: string | null;
  connectedClients: number;
}

const WS_URL = 'ws://169.197.86.231:8080';

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
import { useState, useEffect } from 'react';

interface GlobalState {
  age: number;
  message: string;
  transaction: string | null;
  connectedClients: number;
  diaryEntries: DiaryEntry[];
}

interface DiaryEntry {
  message: string;
  timestamp: string;
  age: number;
}

const WS_URL = import.meta.env.PROD 
  ? 'wss://api.brainterminal.live'  // Production URL using secure WebSocket
  : 'wss://api.brainterminal.live';          // Development URL

export const useWebSocket = () => {
  const [globalState, setGlobalState] = useState<GlobalState>({
    age: 1,
    message: "Initializing...",
    transaction: null,
    connectedClients: 0,
    diaryEntries: []
  });

  useEffect(() => {
    const ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      console.log('Connected to WebSocket server');
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('Received WebSocket data:', data);
        
        // Handle both INIT and UPDATE messages
        if (data.type === 'INIT' || data.type === 'UPDATE') {
          setGlobalState({
            age: data.age,
            message: data.message,
            transaction: data.transaction,
            connectedClients: data.connectedClients,
            diaryEntries: data.diaryEntries || []
          });
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => ws.close();
  }, []);

  return { globalState };
};
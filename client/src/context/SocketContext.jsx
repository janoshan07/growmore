import { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [prices, setPrices] = useState({});

  useEffect(() => {
    // In production, WebSockets must go to the Render backend (Vercel is serverless)
    const socketUrl = import.meta.env.VITE_SOCKET_URL || '/';
    const s = io(socketUrl, {
      transports: ['websocket', 'polling'], // polling fallback prevents hard failures
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });
    setSocket(s);

    s.on('market:prices', (data) => {
      // Convert array to object keyed by symbol for O(1) lookups
      const map = {};
      data.forEach((asset) => { map[asset.symbol] = asset; });
      setPrices(map);
    });

    return () => s.disconnect();
  }, []);

  return (
    <SocketContext.Provider value={{ socket, prices }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);

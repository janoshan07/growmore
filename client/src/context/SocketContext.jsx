import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import api from '../api/axios';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket]   = useState(null);
  const [prices, setPrices]   = useState({});
  const [connected, setConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    const socketUrl = import.meta.env.VITE_SOCKET_URL || '/';

    // On production (Render free tier), wake the server with a health check
    // before opening the socket so we don't hit a 502 cold-start error.
    const connect = () => {
      if (socketRef.current) return; // already connecting

      const s = io(socketUrl, {
        // Start with polling (HTTP) — works even during Render cold-start.
        // Socket.IO will automatically upgrade to WebSocket once connected.
        transports: ['polling', 'websocket'],
        reconnectionAttempts: 10,
        reconnectionDelay: 3000,
        reconnectionDelayMax: 10000,
        timeout: 20000,
      });

      socketRef.current = s;
      setSocket(s);

      s.on('connect', () => setConnected(true));
      s.on('disconnect', () => setConnected(false));

      s.on('market:prices', (data) => {
        const map = {};
        data.forEach((asset) => { map[asset.symbol] = asset; });
        setPrices(map);
      });
    };

    // Ping health endpoint first (wakes Render free-tier if sleeping),
    // then open the socket regardless of the result.
    api.get('/health').catch(() => {}).finally(connect);

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, prices, connected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);

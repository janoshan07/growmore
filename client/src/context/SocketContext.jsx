import { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [prices, setPrices] = useState({});

  useEffect(() => {
    const s = io('/', { transports: ['websocket'] });
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

import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || '/';

// Derive health URL from SOCKET_URL (always the clean base server URL)
// e.g. https://growmore-08vn.onrender.com → https://growmore-08vn.onrender.com/api/health
// Falls back to /api/health for local dev (Vite proxy handles it)
const HEALTH_URL = SOCKET_URL && SOCKET_URL !== '/'
  ? `${SOCKET_URL.replace(/\/$/, '')}/api/health`
  : '/api/health';

const MAX_RETRIES = 12;   // 12 × 5 s = 60 s max wait
const RETRY_MS    = 5000;

/** Poll the health endpoint until the server responds 200, then connect. */
async function waitForServer(signal) {
  for (let i = 0; i < MAX_RETRIES; i++) {
    if (signal.aborted) return false;
    try {
      const res = await fetch(HEALTH_URL, { signal: AbortSignal.timeout(4000) });
      if (res.ok) return true;        // server is awake ✅
    } catch { /* still sleeping, keep retrying */ }
    // wait before next attempt
    await new Promise(r => setTimeout(r, RETRY_MS));
  }
  return false; // gave up
}

export const SocketProvider = ({ children }) => {
  const [socket,    setSocket]    = useState(null);
  const [prices,    setPrices]    = useState({});
  const [connected, setConnected] = useState(false);
  const [serverUp,  setServerUp]  = useState(false); // exposed so UI can show "waking up"
  const socketRef  = useRef(null);
  const abortRef   = useRef(new AbortController());

  useEffect(() => {
    const abort = new AbortController();
    abortRef.current = abort;

    (async () => {
      const ready = await waitForServer(abort.signal);
      if (!ready || abort.signal.aborted) return;

      setServerUp(true);

      if (socketRef.current) return; // already connected

      const s = io(SOCKET_URL, {
        transports: ['polling', 'websocket'], // polling first → safer on managed infra
        reconnectionAttempts: 10,
        reconnectionDelay: 3000,
        reconnectionDelayMax: 15000,
        timeout: 20000,
      });

      socketRef.current = s;
      setSocket(s);

      s.on('connect',    () => setConnected(true));
      s.on('disconnect', () => setConnected(false));

      s.on('market:prices', (data) => {
        const map = {};
        data.forEach((asset) => { map[asset.symbol] = asset; });
        setPrices(map);
      });
    })();

    return () => {
      abort.abort();
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, prices, connected, serverUp }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);

import { useSocket } from '../context/SocketContext';
import { useRef, useState, useEffect } from 'react';
import { FiPause, FiPlay, FiChevronsLeft, FiChevronsRight, FiActivity } from 'react-icons/fi';

// ─── Mini sparkline SVG ────────────────────────────────────────────────────────
function Spark({ positive }) {
  const points = positive
    ? '0,10 4,7 8,9 12,5 16,6 20,3 24,5 28,1'
    : '0,1 4,3 8,2 12,5 16,4 20,7 24,6 28,10';
  return (
    <svg width="28" height="11" viewBox="0 0 28 11" style={{ display: 'block' }}>
      <polyline
        points={points}
        fill="none"
        stroke={positive ? '#0ecb81' : '#f6465d'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─── Single ticker item ────────────────────────────────────────────────────────
function TickerItem({ asset }) {
  const pos = asset.changePercent >= 0;
  const price = Number(asset.price).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: asset.price < 10 ? 4 : 2,
  });

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        padding: '0 20px',
        borderRight: '1px solid rgba(255,255,255,0.07)',
        height: '100%',
        cursor: 'default',
        transition: 'background 0.2s',
        flexShrink: 0,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
    >
      {/* Symbol */}
      <span style={{
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: '0.04em',
        color: '#f0f0f0',
        fontFamily: 'monospace',
        minWidth: 44,
      }}>
        {asset.symbol}
      </span>

      {/* Sparkline */}
      <Spark positive={pos} />

      {/* Price */}
      <span style={{
        fontSize: 12,
        fontFamily: 'monospace',
        color: '#c9d2dc',
        fontWeight: 500,
      }}>
        ${price}
      </span>

      {/* Change badge */}
      <span style={{
        fontSize: 11,
        fontWeight: 700,
        fontFamily: 'monospace',
        padding: '2px 7px',
        borderRadius: 4,
        background: pos ? 'rgba(14,203,129,0.12)' : 'rgba(246,70,93,0.12)',
        color: pos ? '#0ecb81' : '#f6465d',
        border: `1px solid ${pos ? 'rgba(14,203,129,0.25)' : 'rgba(246,70,93,0.25)'}`,
        whiteSpace: 'nowrap',
      }}>
        {pos ? '▲' : '▼'} {pos ? '+' : ''}{asset.changePercent}%
      </span>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────
export default function MarketTicker() {
  const { prices } = useSocket();
  const items = Object.values(prices);

  const trackRef = useRef(null);
  const animRef  = useRef(null);
  const posRef   = useRef(0);

  const [paused,  setPaused]  = useState(false);
  const [speed,   setSpeed]   = useState(1);   // multiplier: 0.5, 1, 2
  const [hovered, setHovered] = useState(false);

  const PX_PER_FRAME = 0.6; // base pixels per animation frame

  // ── Animation loop ────────────────────────────────────────────────────────
  useEffect(() => {
    const track = trackRef.current;
    if (!track || items.length === 0) return;

    const tick = () => {
      if (!paused && !hovered) {
        const halfWidth = track.scrollWidth / 2;
        posRef.current -= PX_PER_FRAME * speed;
        if (posRef.current <= -halfWidth) {
          posRef.current = 0;
        }
        track.style.transform = `translateX(${posRef.current}px)`;
      }
      animRef.current = requestAnimationFrame(tick);
    };

    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, [items.length, paused, hovered, speed]);

  // Manual scroll controls
  const nudge = (dir) => {
    const track = trackRef.current;
    if (!track) return;
    const halfWidth = track.scrollWidth / 2;
    posRef.current += dir * 80;
    if (posRef.current <= -halfWidth) posRef.current = 0;
    if (posRef.current > 0) posRef.current = 0;
    track.style.transform = `translateX(${posRef.current}px)`;
  };

  const cycleSpeed = () => {
    setSpeed((s) => (s === 0.5 ? 1 : s === 1 ? 2 : 0.5));
  };

  if (items.length === 0) {
    return (
      <div style={{
        height: 40,
        background: 'linear-gradient(90deg, #0b0e11 0%, #0f1923 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: 8,
      }}>
        <FiActivity style={{ color: '#00e5ff', width: 13, height: 13, opacity: 0.6 }} />
        <span style={{ fontSize: 11, color: '#4a5568', fontFamily: 'monospace' }}>
          Connecting to live markets…
        </span>
      </div>
    );
  }

  // Triple the items for seamless infinite loop
  const looped = [...items, ...items, ...items];

  const speedLabel = speed === 0.5 ? '0.5×' : speed === 1 ? '1×' : '2×';

  return (
    <div style={{
      height: 42,
      background: 'linear-gradient(90deg, #0b0e11 0%, #0f1923 50%, #0b0e11 100%)',
      borderBottom: '1px solid rgba(0,229,255,0.1)',
      display: 'flex',
      alignItems: 'center',
      overflow: 'hidden',
      position: 'relative',
      boxShadow: '0 1px 12px rgba(0,0,0,0.4)',
      userSelect: 'none',
    }}>

      {/* ── Left label pill ── */}
      <div style={{
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '0 14px',
        borderRight: '1px solid rgba(0,229,255,0.15)',
        height: '100%',
        background: 'rgba(0,229,255,0.06)',
        zIndex: 10,
      }}>
        <span style={{
          width: 6, height: 6, borderRadius: '50%',
          background: '#0ecb81',
          boxShadow: '0 0 6px #0ecb81',
          flexShrink: 0,
          animation: 'pulse 2s ease infinite',
        }} />
        <span style={{
          fontSize: 10, fontWeight: 800, color: '#00e5ff',
          letterSpacing: '0.12em', fontFamily: 'monospace',
          textTransform: 'uppercase',
        }}>
          LIVE
        </span>
      </div>

      {/* ── Left fade ── */}
      <div style={{
        position: 'absolute', left: 86, top: 0, bottom: 0, width: 40,
        background: 'linear-gradient(90deg, #0b0e11, transparent)',
        zIndex: 5, pointerEvents: 'none',
      }} />

      {/* ── Scrolling track ── */}
      <div
        style={{ flex: 1, overflow: 'hidden', height: '100%', cursor: paused ? 'default' : 'grab' }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div
          ref={trackRef}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            height: '100%',
            whiteSpace: 'nowrap',
            willChange: 'transform',
          }}
        >
          {looped.map((asset, i) => (
            <TickerItem key={`${asset.symbol}-${i}`} asset={asset} />
          ))}
        </div>
      </div>

      {/* ── Right fade ── */}
      <div style={{
        position: 'absolute', right: 120, top: 0, bottom: 0, width: 40,
        background: 'linear-gradient(270deg, #0b0e11, transparent)',
        zIndex: 5, pointerEvents: 'none',
      }} />

      {/* ── Controls ── */}
      <div style={{
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        padding: '0 10px',
        borderLeft: '1px solid rgba(0,229,255,0.1)',
        height: '100%',
        background: 'rgba(0,0,0,0.2)',
        zIndex: 10,
      }}>
        {/* Scroll back */}
        <CtrlBtn onClick={() => nudge(1)} title="Scroll back">
          <FiChevronsLeft style={{ width: 13, height: 13 }} />
        </CtrlBtn>

        {/* Play / Pause */}
        <CtrlBtn onClick={() => setPaused((p) => !p)} title={paused ? 'Play' : 'Pause'} active={paused}>
          {paused
            ? <FiPlay  style={{ width: 12, height: 12 }} />
            : <FiPause style={{ width: 12, height: 12 }} />
          }
        </CtrlBtn>

        {/* Speed */}
        <CtrlBtn onClick={cycleSpeed} title="Change speed">
          <span style={{ fontSize: 10, fontFamily: 'monospace', fontWeight: 700, lineHeight: 1 }}>
            {speedLabel}
          </span>
        </CtrlBtn>

        {/* Scroll forward */}
        <CtrlBtn onClick={() => nudge(-1)} title="Scroll forward">
          <FiChevronsRight style={{ width: 13, height: 13 }} />
        </CtrlBtn>
      </div>

      {/* Pulse keyframe */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.35; }
        }
      `}</style>
    </div>
  );
}

// ─── Control Button ────────────────────────────────────────────────────────────
function CtrlBtn({ onClick, children, title, active = false }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      title={title}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: 26, height: 26,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderRadius: 6,
        border: active
          ? '1px solid rgba(0,229,255,0.4)'
          : hover
            ? '1px solid rgba(255,255,255,0.15)'
            : '1px solid transparent',
        background: active
          ? 'rgba(0,229,255,0.12)'
          : hover
            ? 'rgba(255,255,255,0.06)'
            : 'transparent',
        color: active ? '#00e5ff' : hover ? '#e0f7fa' : '#6b7280',
        cursor: 'pointer',
        transition: 'all 0.18s ease',
        flexShrink: 0,
      }}
    >
      {children}
    </button>
  );
}

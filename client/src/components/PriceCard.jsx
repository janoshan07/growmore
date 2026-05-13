import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

export default function PriceCard({ asset, onTrade }) {
  const [hovered, setHovered] = useState(false);
  const isPositive = asset.changePercent >= 0;

  const price = Number(asset.price).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: asset.price < 10 ? 4 : 2,
  });

  return (
    <motion.div
      whileHover={{ y: -3 }}
      onClick={() => onTrade && onTrade(asset)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'linear-gradient(145deg, #071a2e 0%, #0a2240 100%)',
        border: `1px solid ${hovered ? 'rgba(0,229,255,0.4)' : 'rgba(0,229,255,0.15)'}`,
        borderRadius: 16,
        padding: '18px 18px 14px',
        cursor: 'pointer',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        boxShadow: hovered ? '0 0 24px rgba(0,229,255,0.1)' : '0 2px 8px rgba(0,0,0,0.3)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle top glow streak */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: hovered
          ? 'linear-gradient(90deg, transparent, rgba(0,229,255,0.5), transparent)'
          : 'linear-gradient(90deg, transparent, rgba(0,229,255,0.12), transparent)',
        transition: 'background 0.3s',
      }} />

      {/* ── Top row: symbol info + type badge ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Icon */}
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: 'rgba(0,229,255,0.08)',
            border: '1px solid rgba(0,229,255,0.18)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18,
            boxShadow: hovered ? '0 0 12px rgba(0,229,255,0.15)' : 'none',
            transition: 'box-shadow 0.2s',
          }}>
            {asset.logo || '💹'}
          </div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 800, color: '#e0f7fa', margin: 0, fontFamily: 'monospace' }}>
              {asset.symbol}
            </p>
            <p style={{ fontSize: 11, color: '#7ecfda', margin: 0, maxWidth: 110, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {asset.name}
            </p>
          </div>
        </div>

        {/* Type badge */}
        <span style={{
          fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 6,
          textTransform: 'uppercase', letterSpacing: '0.06em',
          background: asset.type === 'crypto' ? 'rgba(139,92,246,0.15)' : 'rgba(0,229,255,0.1)',
          border: `1px solid ${asset.type === 'crypto' ? 'rgba(139,92,246,0.3)' : 'rgba(0,229,255,0.2)'}`,
          color: asset.type === 'crypto' ? '#a78bfa' : '#00e5ff',
        }}>
          {asset.type}
        </span>
      </div>

      {/* ── Price row ── */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 10 }}>
        <div>
          <p style={{ fontSize: 18, fontWeight: 800, fontFamily: 'monospace', color: '#e0f7fa', margin: 0 }}>
            ${price}
          </p>
          <p style={{ fontSize: 10, color: '#4a6070', margin: '3px 0 0', fontFamily: 'monospace' }}>
            H: ${Number(asset.high24h).toFixed(2)} · L: ${Number(asset.low24h).toFixed(2)}
          </p>
        </div>

        {/* Change badge */}
        <span style={{
          fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 8,
          display: 'flex', alignItems: 'center', gap: 4,
          background: isPositive ? 'rgba(14,203,129,0.12)' : 'rgba(246,70,93,0.12)',
          border: `1px solid ${isPositive ? 'rgba(14,203,129,0.28)' : 'rgba(246,70,93,0.28)'}`,
          color: isPositive ? '#0ecb81' : '#f6465d',
        }}>
          {isPositive ? <FiTrendingUp style={{ width: 11, height: 11 }} /> : <FiTrendingDown style={{ width: 11, height: 11 }} />}
          {isPositive ? '+' : ''}{asset.changePercent}%
        </span>
      </div>

      {/* ── Trade button (appears on hover) ── */}
      {onTrade && (
        <div style={{
          marginTop: 4,
          overflow: 'hidden',
          maxHeight: hovered ? 40 : 0,
          opacity: hovered ? 1 : 0,
          transition: 'max-height 0.25s ease, opacity 0.2s ease',
        }}>
          <div style={{
            width: '100%', padding: '7px 0', borderRadius: 10, textAlign: 'center',
            fontSize: 12, fontWeight: 700, letterSpacing: '0.04em',
            background: 'rgba(0,229,255,0.12)',
            border: '1px solid rgba(0,229,255,0.35)',
            color: '#00e5ff',
            boxShadow: '0 0 12px rgba(0,229,255,0.1)',
            cursor: 'pointer',
          }}>
            Trade {asset.symbol}
          </div>
        </div>
      )}
    </motion.div>
  );
}

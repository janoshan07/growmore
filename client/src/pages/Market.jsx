import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useSocket } from '../context/SocketContext';
import api from '../api/axios';
import MarketTicker from '../components/MarketTicker';
import PriceCard from '../components/PriceCard';
import TradeModal from '../components/TradeModal';
import {
  AreaChart, Area, LineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine,
} from 'recharts';
import { FiSearch, FiFilter, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

const CHART_SYMBOLS = ['AAPL', 'BTC', 'ETH', 'TSLA', 'NVDA', 'SOL'];

const fetchHistory = async (symbol) => {
  const { data } = await api.get(`/market/${symbol}/history?days=30`);
  return data.data;
};

// ─── Dark tooltip ──────────────────────────────────────────────────────────────
const DarkTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'rgba(0,20,40,0.97)',
      border: '1px solid rgba(0,229,255,0.3)',
      borderRadius: 8,
      padding: '8px 14px',
      boxShadow: '0 0 20px rgba(0,229,255,0.12)',
    }}>
      <p style={{ color: '#7ecfda', fontSize: 10, margin: 0 }}>{label}</p>
      <p style={{ color: '#00e5ff', fontWeight: 700, fontFamily: 'monospace', fontSize: 14, margin: '3px 0 0' }}>
        ${Number(payload[0].value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
      </p>
    </div>
  );
};

export default function Market() {
  const { prices } = useSocket();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [chartSymbol, setChartSymbol] = useState('AAPL');

  const { data: history, isLoading: histLoading } = useQuery({
    queryKey: ['history', chartSymbol],
    queryFn: () => fetchHistory(chartSymbol),
    staleTime: 60000,
  });

  const assets = Object.values(prices);
  const filtered = assets.filter((a) => {
    const matchSearch =
      a.symbol.includes(search.toUpperCase()) ||
      a.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || a.type === filter;
    return matchSearch && matchFilter;
  });

  // Current live price for the charted symbol
  const liveAsset = prices[chartSymbol];
  const isPos = liveAsset ? liveAsset.changePercent >= 0 : true;

  // Average close for reference line
  const avg = history?.length
    ? history.reduce((s, d) => s + d.close, 0) / history.length
    : null;

  return (
    <div style={{ minHeight: '100vh', background: '#040f1c' }}>
      <MarketTicker />

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px' }}>

        {/* ── Header ── */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#e0f7fa', margin: 0 }}>Market</h1>
          <p style={{ color: '#7ecfda', fontSize: 13, marginTop: 4 }}>Live prices updated every 3 seconds</p>
        </motion.div>

        {/* ── Chart Panel ── */}
        <div style={{
          background: 'linear-gradient(160deg, #071a2e 0%, #0a2240 100%)',
          border: '1px solid rgba(0,229,255,0.18)',
          borderRadius: 18,
          padding: '22px 24px',
          marginBottom: 24,
        }}>
          {/* Chart header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <h2 style={{ fontSize: 16, fontWeight: 800, color: '#e0f7fa', margin: 0 }}>
                  {chartSymbol}
                </h2>
                {liveAsset && (
                  <>
                    <span style={{ fontSize: 20, fontWeight: 800, fontFamily: 'monospace', color: '#e0f7fa' }}>
                      ${Number(liveAsset.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                    </span>
                    <span style={{
                      fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 6,
                      background: isPos ? 'rgba(14,203,129,0.12)' : 'rgba(246,70,93,0.12)',
                      border: `1px solid ${isPos ? 'rgba(14,203,129,0.3)' : 'rgba(246,70,93,0.3)'}`,
                      color: isPos ? '#0ecb81' : '#f6465d',
                      display: 'flex', alignItems: 'center', gap: 4,
                    }}>
                      {isPos ? <FiTrendingUp style={{ width: 11, height: 11 }} /> : <FiTrendingDown style={{ width: 11, height: 11 }} />}
                      {isPos ? '+' : ''}{liveAsset.changePercent}%
                    </span>
                  </>
                )}
              </div>
              <p style={{ fontSize: 11, color: '#7ecfda', margin: '4px 0 0' }}>30-day price history</p>
            </div>

            {/* Symbol pills */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {CHART_SYMBOLS.map((sym) => (
                <button
                  key={sym}
                  onClick={() => setChartSymbol(sym)}
                  style={{
                    fontSize: 11, fontWeight: 700, padding: '5px 14px', borderRadius: 8,
                    cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'monospace',
                    background: chartSymbol === sym ? 'rgba(0,229,255,0.15)' : 'transparent',
                    border: `1px solid ${chartSymbol === sym ? 'rgba(0,229,255,0.5)' : 'rgba(0,229,255,0.12)'}`,
                    color: chartSymbol === sym ? '#00e5ff' : '#7ecfda',
                    boxShadow: chartSymbol === sym ? '0 0 10px rgba(0,229,255,0.15)' : 'none',
                  }}
                >
                  {sym}
                </button>
              ))}
            </div>
          </div>

          {/* Chart */}
          {histLoading || !history ? (
            <div style={{
              height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#7ecfda', fontSize: 13,
            }}>
              Loading chart…
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={history} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="mktGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={isPos ? '#00e5ff' : '#f6465d'} stopOpacity={0.22} />
                    <stop offset="100%" stopColor={isPos ? '#00e5ff' : '#f6465d'} stopOpacity={0} />
                  </linearGradient>
                  <filter id="mktGlow">
                    <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                    <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                </defs>
                <CartesianGrid stroke="rgba(0,229,255,0.06)" strokeDasharray="4 4" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fill: '#7ecfda', fontSize: 10, fontFamily: 'monospace' }}
                  axisLine={{ stroke: 'rgba(0,229,255,0.12)' }}
                  tickLine={false}
                  tickFormatter={(v) => v.slice(5)}
                  interval={4}
                />
                <YAxis
                  tick={{ fill: '#7ecfda', fontSize: 10, fontFamily: 'monospace' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `$${v >= 1000 ? (v / 1000).toFixed(1) + 'k' : v.toFixed(2)}`}
                  domain={['auto', 'auto']}
                  width={56}
                />
                <Tooltip content={<DarkTooltip />} />
                {avg && (
                  <ReferenceLine
                    y={avg}
                    stroke="rgba(0,229,255,0.3)"
                    strokeDasharray="6 3"
                    label={{
                      value: `Avg: $${avg >= 1000 ? (avg / 1000).toFixed(2) + 'k' : avg.toFixed(2)}`,
                      fill: '#00e5ff', fontSize: 10, position: 'insideTopRight',
                    }}
                  />
                )}
                <Area
                  type="monotone"
                  dataKey="close"
                  stroke={isPos ? '#00e5ff' : '#f6465d'}
                  strokeWidth={2}
                  fill="url(#mktGrad)"
                  dot={false}
                  activeDot={{ r: 4, fill: isPos ? '#00e5ff' : '#f6465d', stroke: '#fff', strokeWidth: 1.5 }}
                  filter="url(#mktGlow)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* ── Filters Row ── */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 20, alignItems: 'center' }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <FiSearch style={{
              position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
              color: '#7ecfda', width: 14, height: 14,
            }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search assets…"
              style={{
                width: '100%', padding: '9px 12px 9px 36px', boxSizing: 'border-box',
                background: 'rgba(0,229,255,0.04)',
                border: '1px solid rgba(0,229,255,0.18)',
                borderRadius: 10, color: '#e0f7fa', fontSize: 13,
                outline: 'none', fontFamily: 'inherit',
                transition: 'border-color 0.2s, box-shadow 0.2s',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'rgba(0,229,255,0.5)';
                e.target.style.boxShadow = '0 0 0 3px rgba(0,229,255,0.08)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(0,229,255,0.18)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Filter tabs */}
          <div style={{ display: 'flex', gap: 6 }}>
            {['all', 'stock', 'crypto'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  fontSize: 12, fontWeight: 600, padding: '8px 18px', borderRadius: 10,
                  cursor: 'pointer', transition: 'all 0.2s', textTransform: 'capitalize',
                  background: filter === f ? 'rgba(0,229,255,0.15)' : 'transparent',
                  border: `1px solid ${filter === f ? 'rgba(0,229,255,0.45)' : 'rgba(0,229,255,0.12)'}`,
                  color: filter === f ? '#00e5ff' : '#7ecfda',
                  boxShadow: filter === f ? '0 0 10px rgba(0,229,255,0.12)' : 'none',
                }}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Count */}
          <span style={{ fontSize: 12, color: '#7ecfda', opacity: 0.7 }}>
            {filtered.length} asset{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* ── Assets Grid ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
          gap: 14,
        }}>
          {filtered.length > 0 ? (
            filtered.map((asset) => (
              <motion.div
                key={asset.symbol}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
              >
                <PriceCard asset={asset} onTrade={setSelectedAsset} />
              </motion.div>
            ))
          ) : (
            <div style={{
              gridColumn: '1/-1', textAlign: 'center', padding: '64px 0',
              color: '#7ecfda', fontSize: 13,
            }}>
              <FiFilter style={{ width: 36, height: 36, margin: '0 auto 12px', opacity: 0.25 }} />
              <p style={{ margin: 0 }}>No assets match your search</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Trade Modal ── */}
      {selectedAsset && (
        <TradeModal
          asset={selectedAsset}
          onClose={() => setSelectedAsset(null)}
          onSuccess={() => {}}
        />
      )}
    </div>
  );
}

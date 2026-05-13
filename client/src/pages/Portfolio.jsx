import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useSocket } from '../context/SocketContext';
import api from '../api/axios';
import MarketTicker from '../components/MarketTicker';
import TradeModal from '../components/TradeModal';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import { FiTrendingUp, FiTrendingDown, FiShoppingCart, FiBarChart2 } from 'react-icons/fi';

// ─── Colors ──────────────────────────────────────────────────────────────────
const TEAL_SHADES = [
  '#00e5ff', '#00bcd4', '#0097a7', '#006064',
  '#26c6da', '#4dd0e1', '#80deea', '#b2ebf2',
];

// ─── Data fetchers ────────────────────────────────────────────────────────────
const fetchPortfolio = async () => {
  const { data } = await api.get('/portfolio');
  return data.data;
};
const fetchTransactions = async () => {
  const { data } = await api.get('/portfolio/transactions?limit=50');
  return data.data;
};

// ─── Custom Pie Tooltip ───────────────────────────────────────────────────────
const PieTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'rgba(0,20,40,0.95)',
      border: '1px solid rgba(0,229,255,0.35)',
      borderRadius: 8,
      padding: '8px 14px',
      boxShadow: '0 0 16px rgba(0,229,255,0.15)',
    }}>
      <p style={{ color: '#7ecfda', fontSize: 11, margin: 0 }}>{payload[0].name}</p>
      <p style={{ color: '#00e5ff', fontWeight: 700, fontFamily: 'monospace', fontSize: 14, margin: '3px 0 0' }}>
        ${Number(payload[0].value).toLocaleString('en-US', { minimumFractionDigits: 2 })}
      </p>
    </div>
  );
};

// ─── Dark panel wrapper ───────────────────────────────────────────────────────
const Panel = ({ children, style = {} }) => (
  <div style={{
    background: 'linear-gradient(160deg, #071a2e 0%, #0a2240 100%)',
    border: '1px solid rgba(0,229,255,0.18)',
    borderRadius: 18,
    padding: '22px 24px',
    ...style,
  }}>
    {children}
  </div>
);

// ─── Summary Card ─────────────────────────────────────────────────────────────
const SumCard = ({ label, value, prefix = '$', colored = false }) => {
  const isPos = value >= 0;
  return (
    <motion.div
      whileHover={{ y: -2, boxShadow: '0 0 24px rgba(0,229,255,0.1)' }}
      style={{
        background: 'linear-gradient(145deg, #071a2e 0%, #0a2240 100%)',
        border: '1px solid rgba(0,229,255,0.18)',
        borderRadius: 16,
        padding: '18px 20px',
        transition: 'all 0.3s ease',
      }}
    >
      <p style={{ fontSize: 10, color: '#7ecfda', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>{label}</p>
      <p style={{
        fontSize: 20, fontWeight: 800, fontFamily: 'monospace', marginTop: 6, marginBottom: 0,
        color: colored ? (isPos ? '#4ade80' : '#f87171') : '#e0f7fa',
      }}>
        {colored && !isPos ? '-' : ''}{prefix}{Math.abs(value || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
      </p>
    </motion.div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Portfolio() {
  const { prices } = useSocket();
  const queryClient = useQueryClient();
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [txFilter, setTxFilter] = useState('all');

  const { data: portfolio, isLoading } = useQuery({
    queryKey: ['portfolio'],
    queryFn: fetchPortfolio,
    refetchInterval: 15000,
  });

  const { data: transactions } = useQuery({
    queryKey: ['transactions-all'],
    queryFn: fetchTransactions,
    refetchInterval: 30000,
  });

  const summary = portfolio?.summary || {};
  const holdings = portfolio?.holdings || [];

  // Pie data
  const pieData = holdings.map((h) => ({
    name: h.symbol,
    value: parseFloat((h.currentValue || 0).toFixed(2)),
  }));

  // Bar data (holdings P&L comparison)
  const barData = holdings.map((h) => {
    const livePrice = prices[h.symbol]?.price || h.currentPrice;
    const livePL = livePrice * h.quantity - h.totalInvested;
    return { name: h.symbol, pl: parseFloat(livePL.toFixed(2)) };
  });

  const filteredTx = transactions?.filter((t) => txFilter === 'all' || t.type === txFilter) || [];

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', background: '#040f1c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#7ecfda', fontSize: 14 }}>Loading portfolio…</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#040f1c' }}>
      <MarketTicker />
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px' }}>

        {/* ── Header ── */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#e0f7fa', margin: 0 }}>Portfolio</h1>
          <p style={{ color: '#7ecfda', fontSize: 13, marginTop: 4 }}>Your holdings and trade history</p>
        </motion.div>

        {/* ── Summary Cards ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
          <SumCard label="Total Invested" value={summary.totalInvested} />
          <SumCard label="Current Value" value={summary.totalCurrentValue} />
          <SumCard label="Total P&L" value={summary.totalProfitLoss} colored />
          <SumCard label="Net Worth" value={summary.netWorth} />
        </div>

        {/* ── Charts Row: Holdings Table + Pie + Bar ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>

          {/* Allocation Donut */}
          <Panel>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: '#e0f7fa', margin: '0 0 18px' }}>Allocation</h2>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <defs>
                    <filter id="pieShadow">
                      <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#00e5ff" floodOpacity="0.4" />
                    </filter>
                  </defs>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="46%"
                    innerRadius={72}
                    outerRadius={105}
                    paddingAngle={3}
                    dataKey="value"
                    strokeWidth={0}
                    filter="url(#pieShadow)"
                  >
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={TEAL_SHADES[i % TEAL_SHADES.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    formatter={(val) => (
                      <span style={{ color: '#7ecfda', fontSize: 11 }}>{val}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7ecfda', fontSize: 13 }}>
                No data
              </div>
            )}
          </Panel>

          {/* P&L Bar Chart */}
          <Panel>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: '#e0f7fa', margin: '0 0 18px' }}>P&L by Asset</h2>
            {barData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={barData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="barPos" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00e5ff" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#006064" stopOpacity={0.6} />
                    </linearGradient>
                    <linearGradient id="barNeg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f87171" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#7f1d1d" stopOpacity={0.6} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(0,229,255,0.06)" strokeDasharray="4 4" vertical={false} />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: '#7ecfda', fontSize: 10, fontFamily: 'monospace' }}
                    axisLine={{ stroke: 'rgba(0,229,255,0.15)' }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: '#7ecfda', fontSize: 10, fontFamily: 'monospace' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `$${v}`}
                    width={52}
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(0,229,255,0.05)' }}
                    content={({ active, payload, label }) => {
                      if (!active || !payload?.length) return null;
                      const val = payload[0].value;
                      return (
                        <div style={{
                          background: 'rgba(0,20,40,0.95)',
                          border: '1px solid rgba(0,229,255,0.35)',
                          borderRadius: 8, padding: '8px 14px',
                        }}>
                          <p style={{ color: '#7ecfda', fontSize: 11, margin: 0 }}>{label}</p>
                          <p style={{
                            color: val >= 0 ? '#4ade80' : '#f87171',
                            fontWeight: 700, fontFamily: 'monospace', fontSize: 14, margin: '3px 0 0',
                          }}>
                            {val >= 0 ? '+' : ''}${val.toFixed(2)}
                          </p>
                        </div>
                      );
                    }}
                  />
                  <Bar
                    dataKey="pl"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={40}
                  >
                    {barData.map((entry, i) => (
                      <Cell key={i} fill={entry.pl >= 0 ? 'url(#barPos)' : 'url(#barNeg)'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7ecfda', fontSize: 13 }}>
                No data
              </div>
            )}
          </Panel>
        </div>

        {/* ── Holdings Table ── */}
        <Panel style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 14, fontWeight: 700, color: '#e0f7fa', margin: '0 0 18px' }}>Holdings</h2>
          {holdings.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr>
                    {['Asset', 'Qty', 'Avg Buy', 'Current', 'Value', 'P&L', 'Action'].map((h, i) => (
                      <th key={h} style={{
                        padding: '0 0 12px',
                        textAlign: i === 0 ? 'left' : 'right',
                        fontSize: 10, fontWeight: 600,
                        color: '#7ecfda', textTransform: 'uppercase', letterSpacing: '0.08em',
                        borderBottom: '1px solid rgba(0,229,255,0.12)',
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {holdings.map((h) => {
                    const livePrice = prices[h.symbol]?.price || h.currentPrice;
                    const liveValue = livePrice * h.quantity;
                    const livePL = liveValue - h.totalInvested;
                    const livePLPct = ((livePL / h.totalInvested) * 100).toFixed(2);
                    return (
                      <tr key={h.symbol} style={{ borderBottom: '1px solid rgba(0,229,255,0.07)' }}>
                        <td style={{ padding: '13px 0' }}>
                          <p style={{ fontWeight: 700, color: '#e0f7fa', margin: 0, fontSize: 13 }}>{h.symbol}</p>
                          <p style={{ fontSize: 11, color: '#7ecfda', margin: 0 }}>{h.name}</p>
                        </td>
                        <td style={{ padding: '13px 0', textAlign: 'right', fontFamily: 'monospace', color: '#b0cdd6' }}>{h.quantity}</td>
                        <td style={{ padding: '13px 0', textAlign: 'right', fontFamily: 'monospace', color: '#7ecfda' }}>${h.avgBuyPrice.toFixed(4)}</td>
                        <td style={{ padding: '13px 0', textAlign: 'right', fontFamily: 'monospace', color: '#e0f7fa' }}>${livePrice.toFixed(4)}</td>
                        <td style={{ padding: '13px 0', textAlign: 'right', fontFamily: 'monospace', color: '#e0f7fa', fontWeight: 600 }}>${liveValue.toFixed(2)}</td>
                        <td style={{ padding: '13px 0', textAlign: 'right', fontFamily: 'monospace' }}>
                          <span style={{ color: livePL >= 0 ? '#4ade80' : '#f87171', fontWeight: 600, display: 'block' }}>
                            {livePL >= 0 ? '+' : ''}${livePL.toFixed(2)}
                          </span>
                          <span style={{ fontSize: 10, color: livePL >= 0 ? '#4ade80' : '#f87171', opacity: 0.75 }}>
                            ({livePL >= 0 ? '+' : ''}{livePLPct}%)
                          </span>
                        </td>
                        <td style={{ padding: '13px 0', textAlign: 'right' }}>
                          <button
                            onClick={() => setSelectedAsset({ ...h, price: livePrice })}
                            style={{
                              fontSize: 11, fontWeight: 600,
                              padding: '5px 14px', borderRadius: 8,
                              background: 'rgba(0,229,255,0.08)',
                              border: '1px solid rgba(0,229,255,0.25)',
                              color: '#00e5ff', cursor: 'pointer',
                              transition: 'all 0.2s',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = 'rgba(0,229,255,0.18)';
                              e.currentTarget.style.boxShadow = '0 0 10px rgba(0,229,255,0.2)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'rgba(0,229,255,0.08)';
                              e.currentTarget.style.boxShadow = 'none';
                            }}
                          >
                            Trade
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '48px 0', color: '#7ecfda', fontSize: 13 }}>
              <FiBarChart2 style={{ width: 36, height: 36, margin: '0 auto 10px', opacity: 0.25 }} />
              <p style={{ margin: 0 }}>No holdings yet</p>
              <p style={{ fontSize: 11, margin: '4px 0 0', opacity: 0.6 }}>Go to Market to buy your first asset</p>
            </div>
          )}
        </Panel>

        {/* ── Transaction History ── */}
        <Panel>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: '#e0f7fa', margin: 0 }}>Transaction History</h2>
            <div style={{ display: 'flex', gap: 8 }}>
              {['all', 'buy', 'sell'].map((f) => (
                <button
                  key={f}
                  onClick={() => setTxFilter(f)}
                  style={{
                    fontSize: 10, fontWeight: 600, padding: '4px 12px', borderRadius: 20,
                    textTransform: 'capitalize', cursor: 'pointer',
                    background: txFilter === f ? 'rgba(0,229,255,0.15)' : 'transparent',
                    border: `1px solid ${txFilter === f ? 'rgba(0,229,255,0.4)' : 'rgba(0,229,255,0.12)'}`,
                    color: txFilter === f ? '#00e5ff' : '#7ecfda',
                    transition: 'all 0.2s',
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {filteredTx.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr>
                    {['Asset', 'Type', 'Qty', 'Price', 'Total', 'P&L', 'Date'].map((h, i) => (
                      <th key={h} style={{
                        padding: '0 0 12px',
                        textAlign: i === 0 ? 'left' : 'right',
                        fontSize: 10, fontWeight: 600,
                        color: '#7ecfda', textTransform: 'uppercase', letterSpacing: '0.08em',
                        borderBottom: '1px solid rgba(0,229,255,0.12)',
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredTx.map((t) => (
                    <tr key={t._id} style={{ borderBottom: '1px solid rgba(0,229,255,0.06)' }}>
                      <td style={{ padding: '12px 0' }}>
                        <p style={{ fontWeight: 700, color: '#e0f7fa', margin: 0 }}>{t.symbol}</p>
                        <p style={{ fontSize: 11, color: '#7ecfda', margin: 0 }}>{t.name}</p>
                      </td>
                      <td style={{ padding: '12px 0', textAlign: 'right' }}>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: 4,
                          fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 20,
                          background: t.type === 'buy' ? 'rgba(74,222,128,0.12)' : 'rgba(248,113,113,0.12)',
                          border: `1px solid ${t.type === 'buy' ? 'rgba(74,222,128,0.3)' : 'rgba(248,113,113,0.3)'}`,
                          color: t.type === 'buy' ? '#4ade80' : '#f87171',
                        }}>
                          {t.type === 'buy' ? <FiShoppingCart style={{ width: 10, height: 10 }} /> : <FiTrendingDown style={{ width: 10, height: 10 }} />}
                          {t.type.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: '12px 0', textAlign: 'right', fontFamily: 'monospace', color: '#b0cdd6' }}>{t.quantity}</td>
                      <td style={{ padding: '12px 0', textAlign: 'right', fontFamily: 'monospace', color: '#b0cdd6' }}>${t.price.toFixed(4)}</td>
                      <td style={{ padding: '12px 0', textAlign: 'right', fontFamily: 'monospace', color: '#e0f7fa', fontWeight: 600 }}>${t.total.toFixed(2)}</td>
                      <td style={{ padding: '12px 0', textAlign: 'right', fontFamily: 'monospace', fontSize: 12 }}>
                        <span style={{ color: t.profitLoss === null ? '#7ecfda' : t.profitLoss >= 0 ? '#4ade80' : '#f87171' }}>
                          {t.profitLoss !== null ? `${t.profitLoss >= 0 ? '+' : ''}$${t.profitLoss.toFixed(2)}` : '—'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 0', textAlign: 'right', color: '#7ecfda', fontSize: 11 }}>
                        {new Date(t.createdAt).toLocaleDateString()}<br />
                        <span>{new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '32px 0', color: '#7ecfda', fontSize: 13 }}>
              No transactions found
            </div>
          )}
        </Panel>
      </div>

      {selectedAsset && (
        <TradeModal
          asset={selectedAsset}
          onClose={() => setSelectedAsset(null)}
          onSuccess={() => queryClient.invalidateQueries(['portfolio'])}
        />
      )}
    </div>
  );
}

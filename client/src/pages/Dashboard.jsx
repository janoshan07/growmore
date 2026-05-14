import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import api from '../api/axios';
import MarketTicker from '../components/MarketTicker';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, ReferenceLine,
} from 'recharts';
import {
  FiTrendingUp, FiTrendingDown, FiDollarSign,
  FiPieChart, FiActivity, FiArrowRight,
} from 'react-icons/fi';

// ─── Fetch helpers ────────────────────────────────────────────────────────────
const fetchPortfolio = async () => {
  const { data } = await api.get('/portfolio');
  return data.data;
};
const fetchTransactions = async () => {
  const { data } = await api.get('/portfolio/transactions?limit=5');
  return data.data;
};

// ─── Custom Tooltip ──────────────────────────────────────────────────────────
const DarkTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'rgba(0,20,40,0.95)',
      border: '1px solid rgba(0,229,255,0.35)',
      borderRadius: 8,
      padding: '8px 14px',
      boxShadow: '0 0 16px rgba(0,229,255,0.15)',
    }}>
      <p style={{ color: '#7ecfda', fontSize: 11, marginBottom: 2 }}>{label}</p>
      <p style={{ color: '#00e5ff', fontWeight: 700, fontFamily: 'monospace', fontSize: 14 }}>
        ${Number(payload[0].value).toLocaleString('en-US', { minimumFractionDigits: 2 })}
      </p>
    </div>
  );
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ title, value, sub, icon: Icon, positive, prefix = '' }) => (
  <motion.div
    whileHover={{ y: -2, boxShadow: '0 0 24px rgba(0,229,255,0.12)' }}
    style={{
      background: 'linear-gradient(145deg, #071a2e 0%, #0a2240 100%)',
      border: '1px solid rgba(0,229,255,0.18)',
      borderRadius: 16,
      padding: '18px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      transition: 'all 0.3s ease',
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <p style={{ fontSize: 11, color: '#7ecfda', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>{title}</p>
      <div style={{
        width: 32, height: 32,
        background: 'rgba(0,229,255,0.1)',
        border: '1px solid rgba(0,229,255,0.2)',
        borderRadius: 8,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon style={{ color: '#00e5ff', width: 15, height: 15 }} />
      </div>
    </div>
    <p style={{ fontSize: 22, fontWeight: 800, fontFamily: 'monospace', color: '#e0f7fa', margin: 0, marginTop: 4 }}>
      {prefix}{typeof value === 'number' ? value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : value}
    </p>
    {sub !== undefined && (
      <p style={{
        fontSize: 11,
        display: 'flex', alignItems: 'center', gap: 4, margin: 0,
        color: positive === true ? '#4ade80' : positive === false ? '#f87171' : '#7ecfda',
      }}>
        {positive === true && <FiTrendingUp style={{ width: 11, height: 11 }} />}
        {positive === false && <FiTrendingDown style={{ width: 11, height: 11 }} />}
        {sub}
      </p>
    )}
  </motion.div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Dashboard() {
  const { user } = useAuth();
  const { prices } = useSocket();

  const { data: portfolio } = useQuery({ queryKey: ['portfolio'], queryFn: fetchPortfolio, refetchInterval: 30000 });
  const { data: transactions } = useQuery({ queryKey: ['transactions'], queryFn: fetchTransactions, refetchInterval: 30000 });

  const summary = portfolio?.summary || {};

  const chartData = transactions
    ? [...transactions].reverse().map((t) => ({
      name: new Date(t.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: t.balanceAfter,
    }))
    : [];

  // Average for reference line
  const avg = chartData.length
    ? chartData.reduce((s, d) => s + d.value, 0) / chartData.length
    : null;

  return (
    <div style={{ minHeight: '100vh', background: '#040f1c' }}>
      <MarketTicker />
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px' }}>

        {/* ── Welcome ── */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#e0f7fa', margin: 0 }}>
            Good day, <span style={{ color: '#00e5ff' }}>{user?.name?.split(' ')[0]}</span> 👋
          </h1>
          <p style={{ color: '#7ecfda', fontSize: 13, marginTop: 4 }}>Here's your trading overview</p>
        </motion.div>

        {/* ── Stat Cards ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
          <StatCard title="Cash Balance" value={user?.balance || 0} prefix="$" icon={FiDollarSign} />
          <StatCard
            title="Portfolio Value"
            value={summary.totalCurrentValue || 0}
            prefix="$"
            icon={FiPieChart}
            positive={summary.totalProfitLoss >= 0}
            sub={`${summary.totalProfitLoss >= 0 ? '+' : ''}$${(summary.totalProfitLoss || 0).toFixed(2)}`}
          />
          <StatCard
            title="Total P&L"
            value={Math.abs(summary.totalProfitLoss || 0)}
            prefix={summary.totalProfitLoss >= 0 ? '+$' : '-$'}
            icon={FiActivity}
            positive={summary.totalProfitLoss >= 0}
            sub={`${summary.totalProfitLossPercent || 0}% overall return`}
          />
          <StatCard title="Net Worth" value={summary.netWorth || user?.balance || 0} prefix="$" icon={FiTrendingUp} />
        </div>

        {/* ── Charts Row ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, marginBottom: 24 }}>

          {/* Balance History Chart */}
          <div style={{
            background: 'linear-gradient(160deg, #071a2e 0%, #0a2240 100%)',
            border: '1px solid rgba(0,229,255,0.18)',
            borderRadius: 18,
            padding: '22px 24px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
              <div>
                <h2 style={{ fontSize: 14, fontWeight: 700, color: '#e0f7fa', margin: 0 }}>Balance History</h2>
                <p style={{ fontSize: 11, color: '#7ecfda', margin: '3px 0 0' }}>Last {chartData.length} trades</p>
              </div>
              <span style={{
                fontSize: 10, fontWeight: 600, color: '#00e5ff',
                background: 'rgba(0,229,255,0.08)',
                border: '1px solid rgba(0,229,255,0.2)',
                borderRadius: 6, padding: '3px 10px',
                textTransform: 'uppercase', letterSpacing: '0.06em',
              }}>LIVE</span>
            </div>

            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="balGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00e5ff" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#00e5ff" stopOpacity={0} />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                      <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
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
                    tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`}
                    width={52}
                  />
                  <Tooltip content={<DarkTooltip />} />
                  {avg && (
                    <ReferenceLine
                      y={avg}
                      stroke="rgba(0,229,255,0.35)"
                      strokeDasharray="6 3"
                      label={{
                        value: `Avg: $${(avg / 1000).toFixed(1)}k`,
                        fill: '#00e5ff', fontSize: 10, position: 'insideTopRight',
                      }}
                    />
                  )}
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#00e5ff"
                    strokeWidth={2}
                    fill="url(#balGrad)"
                    dot={false}
                    activeDot={{ r: 4, fill: '#00e5ff', stroke: '#fff', strokeWidth: 1.5 }}
                    filter="url(#glow)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div style={{
                height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#7ecfda', fontSize: 13,
              }}>
                No trade history yet. Make your first trade!
              </div>
            )}
          </div>

          {/* Top Holdings */}
          <div style={{
            background: 'linear-gradient(160deg, #071a2e 0%, #0a2240 100%)',
            border: '1px solid rgba(0,229,255,0.18)',
            borderRadius: 18,
            padding: '22px 24px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
              <h2 style={{ fontSize: 14, fontWeight: 700, color: '#e0f7fa', margin: 0 }}>Top Holdings</h2>
              <Link to="/portfolio" style={{
                fontSize: 11, color: '#00e5ff', display: 'flex', alignItems: 'center', gap: 4,
                textDecoration: 'none',
              }}>
                View all <FiArrowRight style={{ width: 12, height: 12 }} />
              </Link>
            </div>

            {portfolio?.holdings?.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {portfolio.holdings.slice(0, 4).map((h) => {
                  const live = prices[h.symbol];
                  const cp = live?.price || h.currentPrice;
                  const pl = cp * h.quantity - h.totalInvested;
                  const positive = pl >= 0;
                  return (
                    <div key={h.symbol} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      paddingBottom: 12,
                      borderBottom: '1px solid rgba(0,229,255,0.08)',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 34, height: 34, borderRadius: 10,
                          background: 'rgba(0,229,255,0.1)',
                          border: '1px solid rgba(0,229,255,0.2)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 11, fontWeight: 800, color: '#00e5ff', fontFamily: 'monospace',
                        }}>
                          {h.symbol.slice(0, 2)}
                        </div>
                        <div>
                          <p style={{ fontSize: 13, fontWeight: 700, color: '#e0f7fa', margin: 0 }}>{h.symbol}</p>
                          <p style={{ fontSize: 11, color: '#7ecfda', margin: 0 }}>{h.quantity} units</p>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: 13, fontFamily: 'monospace', color: '#e0f7fa', margin: 0 }}>
                          ${(cp * h.quantity).toFixed(2)}
                        </p>
                        <p style={{ fontSize: 11, color: positive ? '#4ade80' : '#f87171', margin: 0 }}>
                          {positive ? '+' : ''}${pl.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '32px 0', color: '#7ecfda', fontSize: 13 }}>
                <FiPieChart style={{ width: 32, height: 32, margin: '0 auto 8px', opacity: 0.3 }} />
                <p>No holdings yet</p>
              </div>
            )}
          </div>
        </div>

        {/* ── Recent Transactions ── */}
        <div style={{
          background: 'linear-gradient(160deg, #071a2e 0%, #0a2240 100%)',
          border: '1px solid rgba(0,229,255,0.18)',
          borderRadius: 18,
          padding: '22px 24px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: '#e0f7fa', margin: 0 }}>Recent Transactions</h2>
            <Link to="/portfolio" style={{
              fontSize: 11, color: '#00e5ff', display: 'flex', alignItems: 'center', gap: 4,
              textDecoration: 'none',
            }}>
              View all <FiArrowRight style={{ width: 12, height: 12 }} />
            </Link>
          </div>

          {transactions?.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr>
                    {['Asset', 'Type', 'Quantity', 'Price', 'Total', 'Date'].map((h) => (
                      <th key={h} style={{
                        padding: '0 0 12px', textAlign: h === 'Asset' ? 'left' : 'right',
                        fontSize: 10, fontWeight: 600, color: '#7ecfda',
                        textTransform: 'uppercase', letterSpacing: '0.08em',
                        borderBottom: '1px solid rgba(0,229,255,0.12)',
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t) => (
                    <tr key={t._id} style={{ borderBottom: '1px solid rgba(0,229,255,0.06)' }}>
                      <td style={{ padding: '12px 0', fontWeight: 700, color: '#e0f7fa' }}>{t.symbol}</td>
                      <td style={{ padding: '12px 0', textAlign: 'right' }}>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center',
                          fontSize: 10, fontWeight: 700,
                          padding: '3px 10px', borderRadius: 20,
                          background: t.type === 'buy' ? 'rgba(74,222,128,0.12)' : 'rgba(248,113,113,0.12)',
                          border: `1px solid ${t.type === 'buy' ? 'rgba(74,222,128,0.3)' : 'rgba(248,113,113,0.3)'}`,
                          color: t.type === 'buy' ? '#4ade80' : '#f87171',
                        }}>
                          {t.type.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: '12px 0', textAlign: 'right', fontFamily: 'monospace', color: '#b0cdd6' }}>{t.quantity}</td>
                      <td style={{ padding: '12px 0', textAlign: 'right', fontFamily: 'monospace', color: '#b0cdd6' }}>${t.price.toFixed(2)}</td>
                      <td style={{ padding: '12px 0', textAlign: 'right', fontFamily: 'monospace', color: '#e0f7fa', fontWeight: 600 }}>${t.total.toFixed(2)}</td>
                      <td style={{ padding: '12px 0', textAlign: 'right', color: '#7ecfda', fontSize: 11 }}>
                        {new Date(t.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '32px 0', color: '#7ecfda', fontSize: 13 }}>
              No transactions yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
                        </span >
                      </td >
                      <td style={{padding:'11px 0',textAlign:'right',fontFamily:'monospace',color:'#b0cdd6'}}>${fmt(t.price)}</td>
                      <td style={{padding:'11px 0',textAlign:'right',fontFamily:'monospace',color:'#b0cdd6'}}>{t.quantity}</td>
                      <td style={{padding:'11px 0',textAlign:'right',color:chg>=0?'#4ade80':'#f87171',fontWeight:700,fontFamily:'monospace'}}>
                        {chg>=0?'+':''}{fmt(chg,2)}%
                      </td>
                      <td style={{padding:'11px 0',textAlign:'right',fontFamily:'monospace',color:'#b0cdd6'}}>${fmt(vol)}</td>
                      <td style={{padding:'11px 0',textAlign:'right',fontFamily:'monospace',fontWeight:700,color:'#e0f7fa'}}>${fmt(t.total)}</td>
                      <td style={{padding:'11px 0',textAlign:'right',color:'#7ecfda',fontSize:10}}>{new Date(t.createdAt).toLocaleDateString()}</td>
                    </tr >
                  );
                }) : (
  <tr><td colSpan={8} style={{ textAlign: 'center', padding: '32px 0', color: '#7ecfda', fontSize: 13 }}>No transactions found</td></tr>
)}
              </tbody >
            </table >
          </div >
        </div >

      </div >
    </div >
  );
}

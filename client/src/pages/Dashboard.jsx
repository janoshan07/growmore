import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import api from '../api/axios';
import MarketTicker from '../components/MarketTicker';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import {
  FiTrendingUp, FiTrendingDown, FiDollarSign,
  FiPieChart, FiActivity, FiArrowRight,
} from 'react-icons/fi';

// Fetch portfolio data
const fetchPortfolio = async () => {
  const { data } = await api.get('/portfolio');
  return data.data;
};

// Fetch recent transactions
const fetchTransactions = async () => {
  const { data } = await api.get('/portfolio/transactions?limit=5');
  return data.data;
};

const StatCard = ({ title, value, sub, icon: Icon, positive, prefix = '' }) => (
  <motion.div whileHover={{ y: -2 }} className="stat-card">
    <div className="flex items-center justify-between">
      <p className="text-xs text-gray-500 uppercase tracking-wider">{title}</p>
      <div className="w-8 h-8 bg-primary-500/10 rounded-lg flex items-center justify-center">
        <Icon className="w-4 h-4 text-primary-400" />
      </div>
    </div>
    <p className="text-2xl font-bold font-mono text-white mt-2">
      {prefix}{typeof value === 'number' ? value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : value}
    </p>
    {sub !== undefined && (
      <p className={`text-xs flex items-center gap-1 mt-1 ${positive ? 'text-green-400' : positive === false ? 'text-red-400' : 'text-gray-500'}`}>
        {positive === true && <FiTrendingUp className="w-3 h-3" />}
        {positive === false && <FiTrendingDown className="w-3 h-3" />}
        {sub}
      </p>
    )}
  </motion.div>
);

export default function Dashboard() {
  const { user } = useAuth();
  const { prices } = useSocket();

  const { data: portfolio } = useQuery({ queryKey: ['portfolio'], queryFn: fetchPortfolio, refetchInterval: 30000 });
  const { data: transactions } = useQuery({ queryKey: ['transactions'], queryFn: fetchTransactions, refetchInterval: 30000 });

  const summary = portfolio?.summary || {};

  // Generate a simple net worth sparkline from transactions
  const chartData = transactions
    ? [...transactions].reverse().map((t, i) => ({
        name: new Date(t.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value: t.balanceAfter,
      }))
    : [];

  return (
    <div className="min-h-screen bg-dark-300">
      <MarketTicker />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-2xl font-bold text-white">
            Good day, <span className="text-primary-400">{user?.name?.split(' ')[0]}</span> 👋
          </h1>
          <p className="text-gray-500 text-sm mt-1">Here's your trading overview</p>
        </motion.div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Balance Chart */}
          <div className="lg:col-span-2 card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-white">Balance History</h2>
              <span className="text-xs text-gray-500">Last {chartData.length} trades</span>
            </div>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="balGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v/1000).toFixed(1)}k`} />
                  <Tooltip
                    contentStyle={{ background: '#1e2130', border: '1px solid #374151', borderRadius: '12px', color: '#f3f4f6' }}
                    formatter={(val) => [`$${val.toFixed(2)}`, 'Balance']}
                  />
                  <Area type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={2} fill="url(#balGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-48 flex items-center justify-center text-gray-500 text-sm">
                No trade history yet. Make your first trade!
              </div>
            )}
          </div>

          {/* Holdings Summary */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-white">Top Holdings</h2>
              <Link to="/portfolio" className="text-xs text-primary-400 flex items-center gap-1 hover:underline">
                View all <FiArrowRight className="w-3 h-3" />
              </Link>
            </div>
            {portfolio?.holdings?.length > 0 ? (
              <div className="space-y-3">
                {portfolio.holdings.slice(0, 4).map((h) => {
                  const live = prices[h.symbol];
                  const cp = live?.price || h.currentPrice;
                  const pl = cp * h.quantity - h.totalInvested;
                  return (
                    <div key={h.symbol} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-white">{h.symbol}</p>
                        <p className="text-xs text-gray-500">{h.quantity} units</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-mono text-white">${(cp * h.quantity).toFixed(2)}</p>
                        <p className={`text-xs ${pl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {pl >= 0 ? '+' : ''}${pl.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 text-sm">
                <FiPieChart className="w-8 h-8 mx-auto mb-2 opacity-30" />
                No holdings yet
              </div>
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="card mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-white">Recent Transactions</h2>
            <Link to="/portfolio" className="text-xs text-primary-400 flex items-center gap-1 hover:underline">
              View all <FiArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {transactions?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-500 text-xs uppercase">
                    <th className="text-left pb-3 font-medium">Asset</th>
                    <th className="text-left pb-3 font-medium">Type</th>
                    <th className="text-right pb-3 font-medium">Quantity</th>
                    <th className="text-right pb-3 font-medium">Price</th>
                    <th className="text-right pb-3 font-medium">Total</th>
                    <th className="text-right pb-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/50">
                  {transactions.map((t) => (
                    <tr key={t._id} className="hover:bg-dark-200/50">
                      <td className="py-3 font-semibold text-white">{t.symbol}</td>
                      <td className="py-3">
                        <span className={t.type === 'buy' ? 'badge-green' : 'badge-red'}>
                          {t.type.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 text-right font-mono text-gray-300">{t.quantity}</td>
                      <td className="py-3 text-right font-mono text-gray-300">${t.price.toFixed(2)}</td>
                      <td className="py-3 text-right font-mono text-white">${t.total.toFixed(2)}</td>
                      <td className="py-3 text-right text-gray-500 text-xs">
                        {new Date(t.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 text-sm">No transactions yet</div>
          )}
        </div>
      </div>
    </div>
  );
}

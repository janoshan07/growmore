import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useSocket } from '../context/SocketContext';
import api from '../api/axios';
import MarketTicker from '../components/MarketTicker';
import TradeModal from '../components/TradeModal';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { FiTrendingUp, FiTrendingDown, FiShoppingCart, FiBarChart2 } from 'react-icons/fi';

const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316', '#ec4899'];

const fetchPortfolio = async () => {
  const { data } = await api.get('/portfolio');
  return data.data;
};

const fetchTransactions = async () => {
  const { data } = await api.get('/portfolio/transactions?limit=50');
  return data.data;
};

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

  // Pie chart data
  const pieData = holdings.map((h) => ({
    name: h.symbol,
    value: parseFloat((h.currentValue || 0).toFixed(2)),
  }));

  const filteredTx = transactions?.filter((t) => txFilter === 'all' || t.type === txFilter) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading portfolio...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MarketTicker />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Portfolio</h1>
          <p className="text-gray-600 text-sm mt-1">Your holdings and trade history</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Invested', value: summary.totalInvested, prefix: '$' },
            { label: 'Current Value', value: summary.totalCurrentValue, prefix: '$' },
            { label: 'Total P&L', value: summary.totalProfitLoss, prefix: '$', colored: true },
            { label: 'Net Worth', value: summary.netWorth, prefix: '$' },
          ].map((item) => (
            <div key={item.label} className="card bg-white shadow-sm border-gray-200">
              <p className="text-xs text-gray-500 uppercase tracking-wider">{item.label}</p>
              <p className={`text-xl font-bold font-mono mt-1 ${
                item.colored
                  ? item.value >= 0 ? 'text-green-600' : 'text-red-600'
                  : 'text-gray-900'
              }`}>
                {item.value >= 0 || !item.colored ? '' : '-'}
                {item.prefix}{Math.abs(item.value || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* Holdings Table */}
          <div className="lg:col-span-2 card bg-white shadow-sm border-gray-200">
            <h2 className="font-bold text-gray-900 mb-4">Holdings</h2>
            {holdings.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-gray-600 text-xs uppercase border-b border-gray-200">
                      <th className="text-left pb-3 font-medium">Asset</th>
                      <th className="text-right pb-3 font-medium">Qty</th>
                      <th className="text-right pb-3 font-medium">Avg Buy</th>
                      <th className="text-right pb-3 font-medium">Current</th>
                      <th className="text-right pb-3 font-medium">Value</th>
                      <th className="text-right pb-3 font-medium">P&L</th>
                      <th className="text-right pb-3 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {holdings.map((h) => {
                      const livePrice = prices[h.symbol]?.price || h.currentPrice;
                      const liveValue = livePrice * h.quantity;
                      const livePL = liveValue - h.totalInvested;
                      const livePLPct = ((livePL / h.totalInvested) * 100).toFixed(2);
                      return (
                        <tr key={h.symbol} className="hover:bg-gray-50 transition-colors">
                          <td className="py-3">
                            <p className="font-bold text-gray-900">{h.symbol}</p>
                            <p className="text-xs text-gray-500">{h.name}</p>
                          </td>
                          <td className="py-3 text-right font-mono text-gray-700">{h.quantity}</td>
                          <td className="py-3 text-right font-mono text-gray-600">${h.avgBuyPrice.toFixed(4)}</td>
                          <td className="py-3 text-right font-mono text-gray-900">${livePrice.toFixed(4)}</td>
                          <td className="py-3 text-right font-mono text-gray-900">${liveValue.toFixed(2)}</td>
                          <td className={`py-3 text-right font-mono text-sm ${livePL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {livePL >= 0 ? '+' : ''}${livePL.toFixed(2)}
                            <span className="block text-xs">({livePL >= 0 ? '+' : ''}{livePLPct}%)</span>
                          </td>
                          <td className="py-3 text-right">
                            <button
                              onClick={() => setSelectedAsset({ ...h, price: livePrice })}
                              className="text-xs btn-secondary py-1 px-3"
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
              <div className="text-center py-16 text-gray-500">
                <FiBarChart2 className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p>No holdings yet</p>
                <p className="text-xs mt-1">Go to Market to buy your first asset</p>
              </div>
            )}
          </div>

          {/* Pie Chart */}
          <div className="card bg-white shadow-sm border-gray-200">
            <h2 className="font-bold text-gray-900 mb-4">Allocation</h2>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="45%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value">
                    {pieData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px', color: '#111827', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    formatter={(val) => [`$${val.toFixed(2)}`, '']}
                  />
                  <Legend formatter={(val) => <span style={{ color: '#4b5563', fontSize: 12 }}>{val}</span>} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500 text-sm">No data</div>
            )}
          </div>
        </div>

        {/* Transaction History */}
        <div className="card bg-white shadow-sm border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900">Transaction History</h2>
            <div className="flex gap-2">
              {['all', 'buy', 'sell'].map((f) => (
                <button
                  key={f}
                  onClick={() => setTxFilter(f)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-all ${txFilter === f ? 'bg-primary-900 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:text-gray-900'}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          {filteredTx.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-600 text-xs uppercase border-b border-gray-200">
                    <th className="text-left pb-3 font-medium">Asset</th>
                    <th className="text-left pb-3 font-medium">Type</th>
                    <th className="text-right pb-3 font-medium">Qty</th>
                    <th className="text-right pb-3 font-medium">Price</th>
                    <th className="text-right pb-3 font-medium">Total</th>
                    <th className="text-right pb-3 font-medium">P&L</th>
                    <th className="text-right pb-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredTx.map((t) => (
                    <tr key={t._id} className="hover:bg-gray-50">
                      <td className="py-3">
                        <p className="font-bold text-gray-900">{t.symbol}</p>
                        <p className="text-xs text-gray-500">{t.name}</p>
                      </td>
                      <td className="py-3">
                        <span className={t.type === 'buy' ? 'badge-green' : 'badge-red'}>
                          {t.type === 'buy' ? <FiShoppingCart className="w-3 h-3" /> : <FiTrendingDown className="w-3 h-3" />}
                          {t.type.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 text-right font-mono text-gray-700">{t.quantity}</td>
                      <td className="py-3 text-right font-mono text-gray-600">${t.price.toFixed(4)}</td>
                      <td className="py-3 text-right font-mono text-gray-900">${t.total.toFixed(2)}</td>
                      <td className={`py-3 text-right font-mono text-sm ${t.profitLoss === null ? 'text-gray-500' : t.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {t.profitLoss !== null ? `${t.profitLoss >= 0 ? '+' : ''}$${t.profitLoss.toFixed(2)}` : '—'}
                      </td>
                      <td className="py-3 text-right text-gray-500 text-xs">
                        {new Date(t.createdAt).toLocaleDateString()}<br />
                        <span>{new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500 text-sm">No transactions found</div>
          )}
        </div>
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

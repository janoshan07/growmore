import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useSocket } from '../context/SocketContext';
import api from '../api/axios';
import MarketTicker from '../components/MarketTicker';
import PriceCard from '../components/PriceCard';
import TradeModal from '../components/TradeModal';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { FiSearch, FiFilter } from 'react-icons/fi';

const fetchHistory = async (symbol) => {
  const { data } = await api.get(`/market/${symbol}/history?days=30`);
  return data.data;
};

export default function Market() {
  const { prices } = useSocket();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // all | stock | crypto
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [chartSymbol, setChartSymbol] = useState('AAPL');

  const { data: history } = useQuery({
    queryKey: ['history', chartSymbol],
    queryFn: () => fetchHistory(chartSymbol),
    staleTime: 60000,
  });

  const assets = Object.values(prices);
  const filtered = assets.filter((a) => {
    const matchSearch = a.symbol.includes(search.toUpperCase()) || a.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || a.type === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="min-h-screen bg-dark-300">
      <MarketTicker />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Market</h1>
          <p className="text-gray-500 text-sm mt-1">Live prices updated every 3 seconds</p>
        </div>

        {/* Chart Section */}
        <div className="card mb-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h2 className="font-bold text-white">{chartSymbol} — 30 Day Chart</h2>
            <div className="flex gap-2 flex-wrap">
              {['AAPL', 'BTC', 'ETH', 'TSLA', 'NVDA', 'SOL'].map((sym) => (
                <button
                  key={sym}
                  onClick={() => setChartSymbol(sym)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${chartSymbol === sym ? 'bg-primary-500 text-white' : 'bg-dark-200 text-gray-400 hover:text-white'}`}
                >
                  {sym}
                </button>
              ))}
            </div>
          </div>
          {history ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2130" />
                <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false}
                  tickFormatter={(v) => v.slice(5)} interval={4} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false}
                  tickFormatter={(v) => `$${v >= 1000 ? (v/1000).toFixed(1)+'k' : v.toFixed(2)}`} domain={['auto', 'auto']} />
                <Tooltip
                  contentStyle={{ background: '#1e2130', border: '1px solid #374151', borderRadius: '12px', color: '#f3f4f6' }}
                  formatter={(val) => [`$${Number(val).toFixed(4)}`, 'Close']}
                />
                <Line type="monotone" dataKey="close" stroke="#22c55e" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-56 flex items-center justify-center text-gray-500 text-sm">Loading chart...</div>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-5">
          <div className="relative flex-1 min-w-48">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search assets..."
              className="input-field pl-9 py-2 text-sm"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'stock', 'crypto'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize ${filter === f ? 'bg-primary-500 text-white' : 'btn-secondary'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Assets Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.length > 0 ? (
            filtered.map((asset) => (
              <motion.div key={asset.symbol} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <PriceCard asset={asset} onTrade={setSelectedAsset} />
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-16 text-gray-500">
              <FiFilter className="w-10 h-10 mx-auto mb-3 opacity-30" />
              No assets match your search
            </div>
          )}
        </div>
      </div>

      {/* Trade Modal */}
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

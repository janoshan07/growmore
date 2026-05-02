import { motion } from 'framer-motion';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

export default function PriceCard({ asset, onTrade }) {
  const isPositive = asset.changePercent >= 0;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="card cursor-pointer hover:border-primary-500/40 transition-all duration-200 group"
      onClick={() => onTrade && onTrade(asset)}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-dark-200 rounded-xl flex items-center justify-center text-xl">
            {asset.logo || '💹'}
          </div>
          <div>
            <p className="text-sm font-bold text-white">{asset.symbol}</p>
            <p className="text-xs text-gray-500 truncate max-w-[100px]">{asset.name}</p>
          </div>
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${asset.type === 'crypto' ? 'bg-purple-500/10 text-purple-400' : 'bg-blue-500/10 text-blue-400'}`}>
          {asset.type}
        </span>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <p className="text-lg font-bold font-mono text-white">
            ${Number(asset.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
          </p>
          <p className="text-xs text-gray-500">
            H: ${Number(asset.high24h).toFixed(2)} · L: ${Number(asset.low24h).toFixed(2)}
          </p>
        </div>
        <div className={`flex items-center gap-1 text-sm font-semibold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
          {isPositive ? <FiTrendingUp /> : <FiTrendingDown />}
          {isPositive ? '+' : ''}{asset.changePercent}%
        </div>
      </div>

      {onTrade && (
        <button className="mt-3 w-full btn-primary text-sm py-2 opacity-0 group-hover:opacity-100 transition-opacity">
          Trade
        </button>
      )}
    </motion.div>
  );
}

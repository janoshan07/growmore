import { useSocket } from '../context/SocketContext';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

export default function MarketTicker() {
  const { prices } = useSocket();
  const items = Object.values(prices);

  if (items.length === 0) return null;

  // Duplicate for seamless loop
  const tickerItems = [...items, ...items];

  return (
    <div className="bg-dark-200 border-b border-gray-700/50 py-2 overflow-hidden">
      <div className="ticker-wrap">
        <div className="ticker-content flex gap-8 items-center">
          {tickerItems.map((asset, i) => (
            <div key={`${asset.symbol}-${i}`} className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-bold text-gray-300">{asset.symbol}</span>
              <span className="text-xs font-mono text-white">
                ${Number(asset.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
              </span>
              <span className={`text-xs flex items-center gap-0.5 ${asset.changePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {asset.changePercent >= 0 ? <FiTrendingUp className="w-3 h-3" /> : <FiTrendingDown className="w-3 h-3" />}
                {asset.changePercent >= 0 ? '+' : ''}{asset.changePercent}%
              </span>
              <span className="text-gray-600">|</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { useSocket } from '../context/SocketContext';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

export default function MarketTicker() {
  const { prices } = useSocket();
  const items = Object.values(prices);

  if (items.length === 0) return null;

  // Duplicate for seamless loop
  const tickerItems = [...items, ...items];

  return (
    <div className="border-b py-2 overflow-hidden shadow-sm" style={{ background: '#0b0e11', borderColor: 'rgba(255,255,255,0.05)' }}>
      <div className="ticker-wrap">
        <div className="ticker-content flex gap-8 items-center">
          {tickerItems.map((asset, i) => (
            <div key={`${asset.symbol}-${i}`} className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-bold" style={{ color: '#eaecef' }}>{asset.symbol}</span>
              <span className="text-xs font-mono" style={{ color: '#848e9c' }}>
                ${Number(asset.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
              </span>
              <span className={`text-xs flex items-center gap-0.5 ${asset.changePercent >= 0 ? 'text-[#0ecb81]' : 'text-[#f6465d]'}`}>
                {asset.changePercent >= 0 ? <FiTrendingUp className="w-3 h-3" /> : <FiTrendingDown className="w-3 h-3" />}
                {asset.changePercent >= 0 ? '+' : ''}{asset.changePercent}%
              </span>
              <span style={{ color: 'rgba(255,255,255,0.1)' }}>|</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

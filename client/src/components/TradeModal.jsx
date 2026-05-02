import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { FiX, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

export default function TradeModal({ asset, onClose, onSuccess }) {
  const { user, setUser } = useAuth();
  const { prices } = useSocket();
  const [type, setType] = useState('buy'); // 'buy' | 'sell'
  const [quantity, setQuantity] = useState('');
  const [loading, setLoading] = useState(false);

  // Use live price if available
  const liveAsset = prices[asset?.symbol] || asset;
  const price = liveAsset?.price || 0;
  const total = (parseFloat(quantity) || 0) * price;

  const handleTrade = async () => {
    if (!quantity || parseFloat(quantity) <= 0) {
      return toast.error('Enter a valid quantity');
    }
    setLoading(true);
    try {
      const endpoint = type === 'buy' ? '/portfolio/buy' : '/portfolio/sell';
      const { data } = await api.post(endpoint, {
        symbol: asset.symbol,
        quantity: parseFloat(quantity),
      });
      toast.success(data.message);
      // Update balance in context
      setUser((prev) => ({ ...prev, balance: data.data.newBalance }));
      onSuccess?.();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Trade failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {asset && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-2xl border border-gray-200 shadow-xl w-full max-w-md p-6"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold text-gray-900">{asset.symbol} · {asset.name}</h2>
                <p className="text-2xl font-mono font-bold text-primary-700 mt-0.5">
                  ${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                </p>
              </div>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-900 p-1">
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Buy/Sell Toggle */}
            <div className="flex rounded-xl bg-gray-100 p-1 mb-5">
              <button
                onClick={() => setType('buy')}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${type === 'buy' ? 'bg-green-600 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
              >
                <FiTrendingUp className="inline w-4 h-4 mr-1" /> Buy
              </button>
              <button
                onClick={() => setType('sell')}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${type === 'sell' ? 'bg-red-600 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
              >
                <FiTrendingDown className="inline w-4 h-4 mr-1" /> Sell
              </button>
            </div>

            {/* Quantity */}
            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-1.5">Quantity</label>
              <input
                type="number"
                min="0.0001"
                step="0.001"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="0.00"
                className="input-field font-mono"
              />
            </div>

            {/* Order Summary */}
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 mb-5 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Price per unit</span>
                <span className="font-mono text-gray-900">${price.toFixed(4)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Quantity</span>
                <span className="font-mono text-gray-900">{quantity || '0'}</span>
              </div>
              <div className="border-t border-gray-200 pt-2 flex justify-between font-semibold">
                <span className="text-gray-700">Total</span>
                <span className="font-mono text-gray-900">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Available Balance</span>
                <span className="text-primary-700">${user?.balance?.toFixed(2)}</span>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={handleTrade}
              disabled={loading}
              className={`w-full py-3 rounded-xl font-semibold text-white shadow-sm transition-all active:scale-95 disabled:opacity-50 ${
                type === 'buy' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {loading ? 'Processing...' : `${type === 'buy' ? 'Buy' : 'Sell'} ${asset.symbol}`}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

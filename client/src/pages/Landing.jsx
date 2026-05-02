import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiShield, FiZap, FiBarChart2, FiArrowRight } from 'react-icons/fi';
import CountUp from 'react-countup';

const features = [
  { icon: FiTrendingUp, title: 'Real-Time Markets', desc: 'Live price feeds for stocks and crypto with WebSocket technology.' },
  { icon: FiShield, title: 'Secure & Safe', desc: 'JWT authentication with encrypted data and secure API endpoints.' },
  { icon: FiZap, title: 'Instant Trades', desc: 'Execute buy and sell orders instantly with virtual balance.' },
  { icon: FiBarChart2, title: 'Analytics Dashboard', desc: 'Track your P&L, portfolio value, and trading history visually.' },
];

const stats = [
  { value: 14, suffix: '+', label: 'Assets Available' },
  { value: 10000, prefix: '$', suffix: '', label: 'Starting Balance' },
  { value: 3, suffix: 's', label: 'Price Update Speed' },
  { value: 100, suffix: '%', label: 'Free to Use' },
];

export default function Landing() {
  return (
    <div className="w-full overflow-hidden bg-gray-50">
      {/* Hero */}
      <section className="relative max-w-7xl mx-auto px-6 pt-20 pb-32 text-center">
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary-200/40 rounded-full blur-3xl pointer-events-none" />

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <span className="inline-flex items-center gap-2 bg-primary-100 border border-primary-200 text-primary-800 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <span className="w-2 h-2 bg-primary-600 rounded-full animate-pulse" />
            Live Trading Simulation
          </span>
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-tight mb-6">
            Trade Smarter,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-700 to-primary-500">
              Grow Faster
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
            Practice trading stocks and crypto with $10,000 virtual balance. Real market data, zero real risk.
          </p>
          <div className="flex flex-wrap gap-4 justify-center relative z-10">
            <Link to="/register" className="btn-primary flex items-center gap-2 text-base px-8 py-3">
              Start Trading Free <FiArrowRight />
            </Link>
            <Link to="/login" className="btn-secondary flex items-center gap-2 text-base px-8 py-3">
              Login to Account
            </Link>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 relative z-10"
        >
          {stats.map((s) => (
            <div key={s.label} className="card text-center bg-white shadow-sm">
              <p className="text-3xl font-black text-primary-700 font-mono">
                {s.prefix}<CountUp end={s.value} duration={2} enableScrollSpy />{s.suffix}
              </p>
              <p className="text-sm text-gray-600 mt-1">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 pb-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Everything you need to trade</h2>
          <p className="text-gray-600">A complete trading platform built for learners and enthusiasts.</p>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card hover:border-primary-200 hover:shadow-md transition-all group bg-white"
            >
              <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary-200 transition-colors">
                <f.icon className="text-primary-700 w-5 h-5" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-600">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 pb-24 text-center relative z-10">
        <div className="card bg-gradient-to-br from-primary-50 to-white border-primary-200 shadow-sm p-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Ready to start growing?</h2>
          <p className="text-gray-600 mb-6">Join now and get $10,000 virtual balance to start trading today.</p>
          <Link to="/register" className="btn-primary inline-flex items-center gap-2 px-8 py-3">
            Create Free Account <FiArrowRight />
          </Link>
        </div>
      </section>
    </div>
  );
}

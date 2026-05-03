import { Link } from 'react-router-dom';
import { motion, useMotionValue, useTransform } from 'framer-motion';
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

const TiltCard = ({ children, className = "" }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-150, 150], [15, -15]);
  const rotateY = useTransform(x, [-150, 150], [-15, 15]);

  function handleMouse(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    const offsetX = event.clientX - rect.left - rect.width / 2;
    const offsetY = event.clientY - rect.top - rect.height / 2;
    x.set(offsetX);
    y.set(offsetY);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      style={{ perspective: 1200 }}
      className={`relative ${className}`}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        onMouseMove={handleMouse}
        onMouseLeave={handleMouseLeave}
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="w-full h-full"
      >
        <div className="card bg-white shadow-sm hover:shadow-xl transition-shadow duration-300 h-full border border-gray-100 flex flex-col items-center justify-center relative overflow-hidden group">
          {/* Subtle glare effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/40 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none transform -translate-x-full group-hover:translate-x-full" />
          
          <div style={{ transform: "translateZ(40px)", transformStyle: "preserve-3d" }} className="w-full flex flex-col items-center">
            {children}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function Landing() {
  return (
    <div className="w-full overflow-hidden bg-gray-50 perspective-1000">
      {/* Hero */}
      <section className="relative max-w-7xl mx-auto px-6 pt-20 pb-32 text-center">
        {/* Animated 3D Background Elements */}
        <motion.div 
          animate={{ y: [0, -30, 0], rotate: [0, 10, -10, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-primary-200/50 rounded-full blur-3xl pointer-events-none" 
        />
        <motion.div 
          animate={{ y: [0, 40, 0], rotate: [0, -15, 15, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-20 right-1/4 w-[400px] h-[400px] bg-blue-200/40 rounded-full blur-3xl pointer-events-none" 
        />

        <motion.div 
          initial={{ opacity: 0, y: 30, rotateX: 20 }} 
          animate={{ opacity: 1, y: 0, rotateX: 0 }} 
          transition={{ duration: 0.8, type: "spring" }}
          style={{ transformStyle: "preserve-3d" }}
          className="relative z-10"
        >
          <span className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-md border border-primary-200 shadow-sm text-primary-800 text-sm font-medium px-4 py-1.5 rounded-full mb-6 transform hover:scale-105 transition-transform cursor-default">
            <span className="w-2 h-2 bg-primary-600 rounded-full animate-pulse" />
            Live Trading Simulation
          </span>
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-tight mb-6 tracking-tight">
            Trade Smarter,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-700 to-[#00e5ff]">
              Grow Faster
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
            Practice trading stocks and crypto with $10,000 virtual balance. Real market data, zero real risk.
          </p>
          <div className="flex flex-wrap gap-4 justify-center relative z-10">
            <Link to="/register" className="btn-primary flex items-center gap-2 text-base px-8 py-3 shadow-lg hover:shadow-primary-500/30 transform hover:-translate-y-1 transition-all">
              Start Trading Free <FiArrowRight />
            </Link>
            <Link to="/login" className="btn-secondary flex items-center gap-2 text-base px-8 py-3 transform hover:-translate-y-1 transition-all">
              Login to Account
            </Link>
          </div>
        </motion.div>

        {/* 3D Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-24 relative z-10"
        >
          {stats.map((s) => (
            <TiltCard key={s.label} className="h-[140px]">
              <p className="text-4xl font-black text-primary-700 font-mono tracking-tight shadow-primary-900/10" style={{ transform: "translateZ(20px)" }}>
                {s.prefix}<CountUp end={s.value} duration={2} enableScrollSpy />{s.suffix}
              </p>
              <p className="text-sm text-gray-500 mt-2 font-medium uppercase tracking-wider" style={{ transform: "translateZ(10px)" }}>{s.label}</p>
            </TiltCard>
          ))}
        </motion.div>
      </section>

      {/* 3D Features */}
      <section className="max-w-7xl mx-auto px-6 pb-32 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">Everything you need to trade</h2>
          <p className="text-gray-600 text-lg">A complete trading platform built for learners and enthusiasts.</p>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <TiltCard className="h-[220px]">
                <div 
                  className="w-14 h-14 bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform duration-300"
                  style={{ transform: "translateZ(30px)" }}
                >
                  <f.icon className="text-primary-700 w-6 h-6 drop-shadow-md" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-3" style={{ transform: "translateZ(20px)" }}>{f.title}</h3>
                <p className="text-sm text-gray-600 px-4 leading-relaxed" style={{ transform: "translateZ(10px)" }}>{f.desc}</p>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3D CTA */}
      <section className="max-w-5xl mx-auto px-6 pb-32 text-center relative z-10">
        <TiltCard className="p-1">
          <div className="w-full bg-gradient-to-br from-[#f8f9fa] to-white rounded-2xl p-12 relative overflow-hidden border-0">
            {/* Inner background glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-100 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            
            <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight" style={{ transform: "translateZ(40px)" }}>Ready to start growing?</h2>
            <p className="text-gray-600 mb-8 text-lg" style={{ transform: "translateZ(20px)" }}>Join now and get $10,000 virtual balance to start trading today.</p>
            <div style={{ transform: "translateZ(50px)" }}>
              <Link to="/register" className="btn-primary inline-flex items-center gap-2 px-10 py-4 text-lg shadow-xl hover:shadow-primary-500/40 transform hover:-translate-y-1 transition-all">
                Create Free Account <FiArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </TiltCard>
      </section>
    </div>
  );
}

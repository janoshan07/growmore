import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiShield, FiTrendingUp, FiZap, FiBarChart2 } from 'react-icons/fi';

/* ─── Globe Canvas ───────────────────────────────────────────── */
function GlobeCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animId;
    let angle = 0;
    let stars = [];

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      // regenerate stars on resize
      stars = Array.from({ length: 220 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.4,
        a: Math.random(),
      }));
    };

    resize();
    window.addEventListener('resize', resize);

    // Globe parameters
    const ROWS = 22;
    const COLS = 50;

    function project3D(lat, lon, rotY, cx, cy, radius) {
      const phi   = (lat * Math.PI) / 180;
      const theta = (lon * Math.PI) / 180 + rotY;
      const x3 = radius * Math.cos(phi) * Math.sin(theta);
      const y3 = radius * Math.sin(phi);
      const z3 = radius * Math.cos(phi) * Math.cos(theta);
      return { x: cx + x3, y: cy - y3, z: z3 };
    }

    function draw() {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      /* ── Starfield ── */
      stars.forEach(s => {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${s.a * 0.7})`;
        ctx.fill();
      });

      const cx     = W * 0.5;
      const cy     = H * 0.56;
      const radius = Math.min(W, H) * 0.41;

      /* ── Globe outer glow ── */
      const glow = ctx.createRadialGradient(cx, cy, radius * 0.3, cx, cy, radius * 1.2);
      glow.addColorStop(0,   'rgba(120, 40, 220, 0.22)');
      glow.addColorStop(0.5, 'rgba(100, 20, 200, 0.12)');
      glow.addColorStop(1,   'rgba(60,  0, 140, 0)');
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.2, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();

      /* ── Globe base fill ── */
      const base = ctx.createRadialGradient(cx - radius * 0.3, cy - radius * 0.3, 0, cx, cy, radius);
      base.addColorStop(0,   'rgba(110, 40, 200, 0.85)');
      base.addColorStop(0.5, 'rgba(70,  15, 160, 0.80)');
      base.addColorStop(1,   'rgba(30,   5, 100, 0.90)');
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fillStyle = base;
      ctx.fill();

      /* ── Dot grid (sphere surface) ── */
      const points = [];
      for (let row = 0; row < ROWS; row++) {
        const lat = -90 + (180 / ROWS) * row;
        const colCount = Math.max(1, Math.round(COLS * Math.cos((lat * Math.PI) / 180)));
        for (let col = 0; col < colCount; col++) {
          const lon = -180 + (360 / colCount) * col;
          points.push(project3D(lat, lon, angle, cx, cy, radius));
        }
      }

      // sort back-to-front
      points.sort((a, b) => a.z - b.z);

      points.forEach(p => {
        const visible = p.z > -radius * 0.05; // cull back half (slightly)
        const brightness = (p.z + radius) / (2 * radius); // 0-1
        const alpha = visible ? 0.25 + brightness * 0.65 : 0;
        if (alpha < 0.02) return;

        const dotR = 1.1 + brightness * 1.5;
        ctx.beginPath();
        ctx.arc(p.x, p.y, dotR, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 160, 255, ${alpha})`;
        ctx.fill();
      });

      /* ── Equatorial ring ── */
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(1, 0.22);
      ctx.beginPath();
      ctx.arc(0, 0, radius * 1.18, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(180, 100, 255, 0.28)';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();

      /* ── Rim highlight ── */
      const rim = ctx.createRadialGradient(cx + radius * 0.6, cy - radius * 0.5, 0, cx, cy, radius);
      rim.addColorStop(0,   'rgba(220,180,255,0.18)');
      rim.addColorStop(0.7, 'rgba(120,60,220,0.06)');
      rim.addColorStop(1,   'rgba(0,0,0,0)');
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fillStyle = rim;
      ctx.fill();

      angle += 0.004;
      animId = requestAnimationFrame(draw);
    }

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ display: 'block' }}
    />
  );
}

/* ─── Stats ─────────────────────────────────────────────────── */
const stats = [
  { value: '50%', label: 'Yearly Return' },
  { value: 'LKR 300K', label: 'Min. Investment' },
  { value: '100%', label: 'Capital Secured' },
  { value: '10Y', label: 'Wealth Plan' },
];

/* ─── Features ──────────────────────────────────────────────── */
const features = [
  { icon: FiTrendingUp, title: 'High Returns', desc: 'Earn up to 50% yearly return with our Fixed 1-Year Plan.' },
  { icon: FiShield,     title: 'Capital Protected', desc: 'Your capital is fully secured with an official signed agreement.' },
  { icon: FiZap,        title: 'Monthly Payouts', desc: 'Receive 2.5–3% monthly returns directly to your account.' },
  { icon: FiBarChart2,  title: 'Long-Term Wealth', desc: 'Build generational wealth with our 10-Year Wealth Plan.' },
];

/* ─── Landing Page ───────────────────────────────────────────── */
export default function Landing() {
  return (
    <div className="w-full overflow-hidden" style={{ background: '#07071a' }}>

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center overflow-hidden">
        {/* Globe canvas fills the full hero */}
        <GlobeCanvas />

        {/* Dark vignette overlay */}
        <div className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 80% 60% at 50% 100%, transparent 0%, #07071a 70%)',
          }}
        />
        <div className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 50% 40% at 50% 0%, #07071a 0%, transparent 100%)',
          }}
        />

        {/* Hero content — centered overlay */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto mt-[-40px]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 border border-purple-500/40 bg-purple-900/20 text-purple-300 text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-8 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse" />
              Grow More Lanka Investment Consultancy
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white leading-[1.05] mb-6 tracking-tight">
              Today Invest,<br />
              <span style={{
                background: 'linear-gradient(135deg, #c9a84c 0%, #e8c96b 40%, #9f6ef5 80%, #c9a84c 100%)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                animation: 'shimmerText 4s linear infinite',
              }}>
                Tomorrow Grow.
              </span>
            </h1>

            {/* Sub text */}
            <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              Sri Lanka's most trusted investment consultancy — delivering fixed, high-return investment plans with full transparency and official agreements.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/plans"
                className="relative overflow-hidden inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-[#07071a] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl text-base"
                style={{ background: 'linear-gradient(135deg, #c9a84c, #e8c96b)' }}>
                Start Investing <FiArrowRight className="btn-icon" />
              </Link>
              <Link to="/contact"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-white border border-white/20 bg-white/8 backdrop-blur-sm hover:bg-white/15 hover:border-white/40 transition-all duration-300 hover:-translate-y-0.5 text-base">
                Contact Now
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Stats bar ─────────────────────────────────────────── */}
      <section className="relative z-10 py-10 px-6" style={{ background: 'rgba(255,255,255,0.03)', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
        >
          {stats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}>
              <p className="text-3xl md:text-4xl font-black" style={{ color: '#c9a84c' }}>{s.value}</p>
              <p className="text-white/50 text-sm mt-1 font-medium uppercase tracking-wider">{s.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── Features ──────────────────────────────────────────── */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-purple-400 mb-3 block">Why Choose Us</span>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4">Built for Real Wealth</h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto">Professional investment management with transparent returns and guaranteed agreements.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group rounded-2xl p-7 border transition-all duration-300 hover:-translate-y-1"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(150,80,255,0.10)';
                e.currentTarget.style.border = '1px solid rgba(200,160,255,0.25)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                e.currentTarget.style.border = '1px solid rgba(255,255,255,0.08)';
              }}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ background: 'rgba(150,80,255,0.15)' }}>
                <f.icon className="w-5 h-5" style={{ color: '#c9a84c' }} />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA Section ───────────────────────────────────────── */}
      <section className="relative z-10 pb-24 px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto rounded-3xl p-12 text-center relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(120,40,220,0.25) 0%, rgba(30,10,80,0.6) 100%)',
            border: '1px solid rgba(200,150,255,0.2)',
          }}
        >
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at 50% -20%, rgba(150,80,255,0.3) 0%, transparent 70%)' }} />
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4 relative z-10">Ready to Grow Your Wealth?</h2>
          <p className="text-white/60 mb-8 text-lg relative z-10">
            Join hundreds of clients who trust Grow More Lanka for transparent, high-return investments.
          </p>
          <div className="flex flex-wrap gap-4 justify-center relative z-10">
            <Link to="/plans"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-[#07071a] transition-all hover:-translate-y-0.5 shadow-xl text-base"
              style={{ background: 'linear-gradient(135deg, #c9a84c, #e8c96b)' }}>
              View Investment Plans <FiArrowRight />
            </Link>
            <Link to="/contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-white border border-white/20 bg-white/8 hover:bg-white/15 transition-all hover:-translate-y-0.5 text-base">
              Talk to an Advisor
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── Shimmer text animation keyframe ───────────────────── */}
      <style>{`
        @keyframes shimmerText {
          0%   { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
      `}</style>
    </div>
  );
}

import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiShield, FiTrendingUp, FiZap, FiBarChart2 } from 'react-icons/fi';

/* ══════════════════════════════════════════════════════════════
   3D PARTICLE NETWORK CANVAS  (voxr.ai style)
   - Floating nodes in 3D space, projected onto 2D canvas
   - Connected by glowing lines when close
   - Auto-rotates + mouse parallax tilt
   - Depth-based opacity & size
   ══════════════════════════════════════════════════════════════ */
function ParticleNetworkCanvas() {
  const canvasRef = useRef(null);
  const mouseRef  = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let W, H;

    /* ── Resize ─────────────────────────── */
    const resize = () => {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    /* ── Mouse track ───────────────────── */
    const onMouse = (e) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth  - 0.5) * 2,  // -1 to 1
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      };
    };
    window.addEventListener('mousemove', onMouse);

    /* ── Nodes ─────────────────────────── */
    const COUNT  = 110;
    const SPREAD = 420;

    const nodes = Array.from({ length: COUNT }, () => ({
      x: (Math.random() - 0.5) * SPREAD,
      y: (Math.random() - 0.5) * SPREAD,
      z: (Math.random() - 0.5) * SPREAD,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      vz: (Math.random() - 0.5) * 0.18,
      size: 1.2 + Math.random() * 2.2,
      // colour pick — purple / cyan / gold accents
      hue: [210, 220, 200, 195, 215][Math.floor(Math.random() * 5)],
    }));

    /* ── Rotation helpers ──────────────── */
    const rotX = (p, a) => ({
      ...p,
      y: p.y * Math.cos(a) - p.z * Math.sin(a),
      z: p.y * Math.sin(a) + p.z * Math.cos(a),
    });
    const rotY = (p, a) => ({
      ...p,
      x: p.x * Math.cos(a) + p.z * Math.sin(a),
      z: -p.x * Math.sin(a) + p.z * Math.cos(a),
    });

    /* ── Project 3-D → 2-D ─────────────── */
    const FOV = 600;
    const project = (p, cx, cy) => {
      const scale = FOV / (FOV + p.z + 220);
      return {
        sx: cx + p.x * scale,
        sy: cy + p.y * scale,
        scale,
        depth: (p.z + SPREAD / 2) / SPREAD, // 0..1
      };
    };

    /* ── Max connection distance ───────── */
    const LINK_DIST = 115;

    let time = 0;

    /* ── Draw loop ─────────────────────── */
    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      /* background gradient */
      const bg = ctx.createRadialGradient(W * 0.5, H * 0.4, 0, W * 0.5, H * 0.4, Math.max(W, H) * 0.9);
      bg.addColorStop(0,   'rgba(25, 8, 55, 1)');
      bg.addColorStop(0.5, 'rgba(10, 4, 30, 1)');
      bg.addColorStop(1,   'rgba(4, 2, 14, 1)');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      /* soft center glow */
      const glow = ctx.createRadialGradient(W * 0.5, H * 0.45, 0, W * 0.5, H * 0.45, W * 0.42);
      glow.addColorStop(0,   'rgba(110, 40, 220, 0.18)');
      glow.addColorStop(0.5, 'rgba(60,  10, 160, 0.08)');
      glow.addColorStop(1,   'rgba(0,    0,   0, 0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, W, H);

      /* auto-rotate angles + mouse parallax */
      const angleY =  time * 0.0018 + mouseRef.current.x * 0.25;
      const angleX = -time * 0.0008 + mouseRef.current.y * 0.15;

      const cx = W * 0.5;
      const cy = H * 0.48;

      /* transform all nodes */
      const projected = nodes.map(n => {
        let p = { x: n.x, y: n.y, z: n.z };
        p = rotY(p, angleY);
        p = rotX(p, angleX);
        return { ...project(p, cx, cy), hue: n.hue, size: n.size, raw: p };
      });

      /* draw connecting lines */
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const a = projected[i], b = projected[j];
          const dx = a.raw.x - b.raw.x;
          const dy = a.raw.y - b.raw.y;
          const dz = a.raw.z - b.raw.z;
          const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
          if (dist > LINK_DIST) continue;

          const t = 1 - dist / LINK_DIST;
          const avgDepth = (a.depth + b.depth) * 0.5;
          const alpha = t * t * avgDepth * 0.55;
          const avgHue = (a.hue + b.hue) / 2;

          const grad = ctx.createLinearGradient(a.sx, a.sy, b.sx, b.sy);
          grad.addColorStop(0, `hsla(${a.hue},85%,72%,${alpha})`);
          grad.addColorStop(1, `hsla(${b.hue},85%,72%,${alpha})`);

          ctx.beginPath();
          ctx.moveTo(a.sx, a.sy);
          ctx.lineTo(b.sx, b.sy);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 0.6 + t * 0.8;
          ctx.stroke();
        }
      }

      /* draw nodes */
      projected.forEach(p => {
        const alpha = 0.4 + p.depth * 0.6;
        const r = p.size * p.scale * 1.6;

        /* outer glow */
        const nodeGlow = ctx.createRadialGradient(p.sx, p.sy, 0, p.sx, p.sy, r * 4);
        nodeGlow.addColorStop(0,   `hsla(${p.hue}, 90%, 75%, ${alpha * 0.45})`);
        nodeGlow.addColorStop(0.5, `hsla(${p.hue}, 80%, 65%, ${alpha * 0.15})`);
        nodeGlow.addColorStop(1,   'transparent');
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, r * 4, 0, Math.PI * 2);
        ctx.fillStyle = nodeGlow;
        ctx.fill();

        /* core dot */
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 90%, 82%, ${alpha})`;
        ctx.fill();
      });

      /* update node positions (drift) */
      nodes.forEach(n => {
        n.x += n.vx; n.y += n.vy; n.z += n.vz;
        if (Math.abs(n.x) > SPREAD / 2) n.vx *= -1;
        if (Math.abs(n.y) > SPREAD / 2) n.vy *= -1;
        if (Math.abs(n.z) > SPREAD / 2) n.vz *= -1;
      });

      time++;
      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouse);
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

/* ── Stats ──────────────────────────────────────────────────── */
const stats = [
  { value: '50%',    label: 'Yearly Return' },
  { value: 'LKR 300K', label: 'Min. Investment' },
  { value: '100%',   label: 'Capital Secured' },
  { value: '10Y',    label: 'Wealth Plan' },
];

/* ── Features ───────────────────────────────────────────────── */
const features = [
  { icon: FiTrendingUp, title: 'High Returns',        desc: 'Earn up to 50% yearly return with our Fixed 1-Year Plan.' },
  { icon: FiShield,     title: 'Capital Protected',   desc: 'Your capital is fully secured with an official signed agreement.' },
  { icon: FiZap,        title: 'Monthly Payouts',     desc: 'Receive 2.5–3% monthly returns directly to your account.' },
  { icon: FiBarChart2,  title: 'Long-Term Wealth',    desc: 'Build generational wealth with our 10-Year Wealth Plan.' },
];

/* ══════════════════════════════════════════════════════════════
   LANDING PAGE
   ══════════════════════════════════════════════════════════════ */
export default function Landing() {
  return (
    <div className="w-full overflow-hidden" style={{ background: '#04020e' }}>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative min-h-[94vh] flex flex-col items-center justify-center overflow-hidden">
        {/* 3-D particle canvas */}
        <ParticleNetworkCanvas />

        {/* Vignette top */}
        <div className="absolute top-0 left-0 right-0 h-40 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, #04020e 0%, transparent 100%)' }} />
        {/* Vignette bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-56 pointer-events-none"
          style={{ background: 'linear-gradient(to top, #04020e 0%, transparent 100%)' }} />
        {/* Side vignettes */}
        <div className="absolute inset-y-0 left-0 w-32 pointer-events-none"
          style={{ background: 'linear-gradient(to right, #04020e 0%, transparent 100%)' }} />
        <div className="absolute inset-y-0 right-0 w-32 pointer-events-none"
          style={{ background: 'linear-gradient(to left, #04020e 0%, transparent 100%)' }} />

        {/* Hero content */}
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full text-xs font-semibold tracking-widest uppercase"
              style={{
                background: 'rgba(130, 60, 255, 0.12)',
                border: '1px solid rgba(130, 60, 255, 0.35)',
                color: '#c4a0ff',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
              Grow More Lanka · Investment Consultancy
            </motion.div>

            {/* Headline */}
            <h1 className="font-black leading-[1.04] mb-6 tracking-tight"
              style={{ fontSize: 'clamp(2.8rem, 7vw, 6rem)' }}>
              <span className="text-white block">Today Invest,</span>
              <span className="block" style={{
                background: 'linear-gradient(135deg, #00b4ff 0%, #4dcfff 35%, #a060ff 70%, #60c0ff 100%)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                animation: 'shimmerText 5s linear infinite',
              }}>
                Tomorrow Grow.
              </span>
            </h1>

            {/* Sub */}
            <p className="max-w-xl mx-auto mb-12 leading-relaxed"
              style={{ color: 'rgba(255,255,255,0.52)', fontSize: 'clamp(1rem, 2vw, 1.2rem)' }}>
              Sri Lanka's most trusted investment consultancy — delivering fixed, high-return investment plans with full transparency and signed agreements.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/plans"
                className="group relative overflow-hidden inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-sm tracking-wide transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                style={{
                  background: 'linear-gradient(135deg, #00b4ff, #4dcfff)',
                  color: '#04020e',
                  boxShadow: '0 0 40px rgba(0,180,255,0.35)',
                }}>
                {/* shimmer on hover */}
                <span className="absolute inset-0 bg-white/0 group-hover:bg-white/15 transition-all duration-300 rounded-2xl" />
                <span className="relative">Start Investing</span>
                <FiArrowRight className="relative w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link to="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-sm tracking-wide transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: 'rgba(255,255,255,0.85)',
                  backdropFilter: 'blur(12px)',
                  boxShadow: '0 0 30px rgba(100,60,255,0.08)',
                }}>
                Contact Now
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Stats bar ───────────────────────────────────────── */}
      <section className="relative z-10 py-12 px-6"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.025)' }}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s, i) => (
            <motion.div key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}>
              <p className="text-3xl md:text-4xl font-black mb-1" style={{ color: '#00b4ff' }}>{s.value}</p>
              <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.38)' }}>{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────── */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-28">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-widest mb-4 block" style={{ color: '#9b6fff' }}>Why Choose Us</span>
          <h2 className="text-white font-black mb-4" style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)' }}>Built for Real Wealth</h2>
          <p className="max-w-lg mx-auto text-lg" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Professional investment management with transparent returns and guaranteed agreements.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <motion.div key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative rounded-2xl p-7 transition-all duration-400 hover:-translate-y-1 cursor-default overflow-hidden"
              style={{
                background: 'rgba(255,255,255,0.035)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(110,50,255,0.10)';
                e.currentTarget.style.border = '1px solid rgba(150,100,255,0.22)';
                e.currentTarget.style.boxShadow = '0 0 60px rgba(110,50,255,0.12)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.035)';
                e.currentTarget.style.border = '1px solid rgba(255,255,255,0.07)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* top glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(150,100,255,0.8), transparent)' }} />

              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 flex-shrink-0"
                style={{ background: 'rgba(150,80,255,0.12)', border: '1px solid rgba(150,80,255,0.2)' }}>
                <f.icon className="w-5 h-5" style={{ color: '#00b4ff' }} />
              </div>
              <h3 className="font-bold text-lg mb-2 text-white">{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────── */}
      <section className="relative z-10 pb-28 px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto rounded-3xl p-14 text-center relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(100,30,220,0.22) 0%, rgba(20,5,60,0.7) 100%)',
            border: '1px solid rgba(150,80,255,0.2)',
            boxShadow: '0 0 120px rgba(100,30,220,0.15), inset 0 1px 0 rgba(255,255,255,0.06)',
          }}
        >
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 60% 50% at 50% -10%, rgba(130,50,255,0.28) 0%, transparent 70%)' }} />
          <h2 className="text-white font-black mb-4 relative z-10" style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}>
            Ready to Grow Your Wealth?
          </h2>
          <p className="mb-10 text-lg relative z-10" style={{ color: 'rgba(255,255,255,0.50)' }}>
            Join hundreds of clients who trust Grow More Lanka for transparent, high-return investments.
          </p>
          <div className="flex flex-wrap gap-4 justify-center relative z-10">
            <Link to="/plans"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-sm text-[#04020e] transition-all hover:-translate-y-0.5 hover:shadow-2xl"
              style={{ background: 'linear-gradient(135deg,#00b4ff,#4dcfff)', boxShadow: '0 0 40px rgba(0,180,255,0.35)' }}>
              View Investment Plans <FiArrowRight />
            </Link>
            <Link to="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-sm text-white border border-white/15 bg-white/06 hover:bg-white/12 transition-all hover:-translate-y-0.5"
              style={{ backdropFilter: 'blur(10px)' }}>
              Talk to an Advisor
            </Link>
          </div>
        </motion.div>
      </section>

      {/* shimmer keyframe */}
      <style>{`
        @keyframes shimmerText {
          0%   { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
      `}</style>
    </div>
  );
}

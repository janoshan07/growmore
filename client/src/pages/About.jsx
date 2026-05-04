import { motion } from 'framer-motion';
import { FiShield, FiTrendingUp, FiUsers, FiAward } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.12, duration: 0.7, ease: [0.22,1,0.36,1] } }),
};

const values = [
  { icon: FiShield,     title: 'Transparency',       desc: 'Every transaction and return is clearly documented and shared with our clients.' },
  { icon: FiTrendingUp, title: 'High Returns',        desc: 'We consistently deliver industry-leading returns through expert market strategies.' },
  { icon: FiUsers,      title: 'Client First',        desc: 'Our dedicated team is always available to support and guide you through your journey.' },
  { icon: FiAward,      title: 'Proven Track Record', desc: 'Years of trusted investment management with a growing portfolio of satisfied clients.' },
];

const CardGlass = ({ children, className = '', hover = true }) => (
  <div
    className={`relative rounded-2xl overflow-hidden transition-all duration-400 ${hover ? 'hover:-translate-y-1' : ''} ${className}`}
    style={{ background: 'rgba(255,255,255,0.035)', border: '1px solid rgba(255,255,255,0.07)' }}
    onMouseEnter={hover ? e => {
      e.currentTarget.style.background = 'rgba(110,50,255,0.10)';
      e.currentTarget.style.border = '1px solid rgba(150,100,255,0.22)';
      e.currentTarget.style.boxShadow = '0 0 60px rgba(110,50,255,0.1)';
    } : undefined}
    onMouseLeave={hover ? e => {
      e.currentTarget.style.background = 'rgba(255,255,255,0.035)';
      e.currentTarget.style.border = '1px solid rgba(255,255,255,0.07)';
      e.currentTarget.style.boxShadow = 'none';
    } : undefined}
  >
    {children}
  </div>
);

export default function About() {
  return (
    <div className="w-full overflow-hidden" style={{ background: '#04020e' }}>

      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="relative py-32 px-6 text-center overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 30%, rgba(110,30,220,0.22) 0%, transparent 70%)' }} />
        {/* Grid lines */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="relative z-10 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-6"
            style={{ background: 'rgba(130,60,255,0.12)', border: '1px solid rgba(130,60,255,0.35)', color: '#c4a0ff' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
            About Us
          </span>
          <h1 className="font-black leading-tight mb-6 text-white" style={{ fontSize: 'clamp(2.5rem,6vw,5rem)' }}>
            Grow More Lanka<br />
            <span style={{
              background: 'linear-gradient(135deg,#00b4ff,#4dcfff,#a060ff)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>Investment Consultancy</span>
          </h1>
          <p className="text-lg leading-relaxed max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.52)' }}>
            A trusted investment consultancy based in Sri Lanka, helping individuals grow their wealth through transparent, professional, and high-return investment plans.
          </p>
        </motion.div>
      </section>

      {/* ── Story + Info ───────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-10 items-start">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <span className="text-xs font-bold uppercase tracking-widest mb-3 block" style={{ color: '#00b4ff' }}>Our Story</span>
            <h2 className="text-3xl font-black text-white mb-6">Building Wealth,<br />Building Trust</h2>
            <div className="space-y-4" style={{ color: 'rgba(255,255,255,0.50)' }}>
              <p className="leading-relaxed">Grow More Lanka Investment Consultancy was founded with a single vision — to provide Sri Lankans with a reliable, transparent, and profitable avenue for growing their savings.</p>
              <p className="leading-relaxed">Operating from the heart of Sri Lanka, we have helped hundreds of clients achieve financial freedom through structured investment plans tailored to every life stage.</p>
              <p className="leading-relaxed">Our team of experienced financial advisors works tirelessly to ensure every investor's capital is managed with the utmost care, integrity, and professionalism.</p>
            </div>
          </motion.div>

          <motion.div custom={1} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <CardGlass hover={false} className="p-8">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px"
                style={{ background: 'linear-gradient(90deg,transparent,rgba(0,180,255,0.6),transparent)' }} />
              {[
                { label: 'Official Name',    value: 'Grow More Lanka Investment Consultancy' },
                { label: 'Location',         value: 'Sri Lanka 🇱🇰' },
                { label: 'Established',      value: 'Proudly Serving Since Day One' },
                { label: 'Specialisation',   value: 'Fixed-Return & Long-Term Wealth Plans' },
              ].map((row, i) => (
                <div key={row.label} className={`${i < 3 ? 'border-b pb-5 mb-5' : ''}`}
                  style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
                  <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#00b4ff' }}>{row.label}</p>
                  <p className="font-semibold text-white">{row.value}</p>
                </div>
              ))}
            </CardGlass>
          </motion.div>
        </div>
      </section>

      {/* ── Mission & Vision ───────────────────────────────── */}
      <section className="py-20 px-6" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
          {[
            { label: 'Our Mission', text: 'To empower every Sri Lankan with access to structured, high-return investment plans that generate real, measurable wealth — built on a foundation of trust, transparency, and proven results.' },
            { label: 'Our Vision',  text: 'To become the most trusted investment consultancy in Sri Lanka, recognised for delivering consistent returns, fostering long-term client relationships, and transforming financial futures.' },
          ].map((item, i) => (
            <motion.div key={item.label} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <CardGlass className="p-8 h-full">
                <div className="absolute top-0 left-0 right-0 h-px"
                  style={{ background: 'linear-gradient(90deg,transparent,rgba(130,60,255,0.5),transparent)' }} />
                <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-5"
                  style={{ background: 'rgba(130,60,255,0.15)', color: '#c4a0ff', border: '1px solid rgba(130,60,255,0.25)' }}>
                  {item.label}
                </span>
                <p className="leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>{item.text}</p>
              </CardGlass>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Why Choose Us ──────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-widest mb-3 block" style={{ color: '#9b6fff' }}>Why Us</span>
          <h2 className="font-black text-white" style={{ fontSize: 'clamp(2rem,4vw,3rem)' }}>Why Choose Grow More Lanka?</h2>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {values.map((v, i) => (
            <motion.div key={v.title} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <CardGlass className="p-7 h-full">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-px opacity-0 hover:opacity-100 transition-opacity"
                  style={{ background: 'linear-gradient(90deg,transparent,rgba(150,100,255,0.8),transparent)' }} />
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: 'rgba(150,80,255,0.12)', border: '1px solid rgba(150,80,255,0.2)' }}>
                  <v.icon className="w-5 h-5" style={{ color: '#00b4ff' }} />
                </div>
                <h3 className="font-bold text-lg mb-2 text-white">{v.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>{v.desc}</p>
              </CardGlass>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────── */}
      <section className="pb-24 px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          className="max-w-3xl mx-auto rounded-3xl p-12 text-center relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg,rgba(100,30,220,0.22),rgba(20,5,60,0.7))', border: '1px solid rgba(150,80,255,0.2)', boxShadow: '0 0 120px rgba(100,30,220,0.12)' }}>
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 60% 50% at 50% -10%,rgba(130,50,255,0.28),transparent 70%)' }} />
          <h2 className="text-3xl font-black text-white mb-4 relative z-10">Ready to Start Investing?</h2>
          <p className="mb-8 relative z-10" style={{ color: 'rgba(255,255,255,0.50)' }}>View our plans and take your first step toward financial freedom.</p>
          <div className="flex flex-wrap gap-4 justify-center relative z-10">
            <Link to="/plans" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm text-[#04020e] transition-all hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(135deg,#00b4ff,#4dcfff)', boxShadow: '0 0 40px rgba(0,180,255,0.35)' }}>
              View Investment Plans
            </Link>
            <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm text-white border border-white/15 bg-white/06 hover:bg-white/12 transition-all hover:-translate-y-0.5">
              Contact Us
            </Link>
          </div>
        </motion.div>
      </section>

    </div>
  );
}

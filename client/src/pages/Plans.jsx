import { motion } from 'framer-motion';
import { FiArrowRight, FiCheck } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.12, duration: 0.7, ease: [0.22,1,0.36,1] } }),
};

const plans = [
  {
    badge: 'Most Popular',
    name: 'Fixed 1-Year Plan',
    tagline: 'Maximum returns, guaranteed.',
    return: '50%',
    period: 'yearly return',
    min: 'LKR 300,000',
    accentColor: '#00b4ff',
    glowColor: 'rgba(0,180,255,0.18)',
    borderColor: 'rgba(0,180,255,0.35)',
    features: [
      'Capital locked for 1 year',
      '50% yearly return guaranteed',
      'Capital + profit paid at year end',
      'Minimum investment: LKR 300,000',
      'Official signed agreement provided',
    ],
  },
  {
    badge: 'Monthly Income',
    name: 'Monthly Returns Plan',
    tagline: 'Regular income every month.',
    return: '30–36%',
    period: 'yearly return',
    min: 'LKR 300,000',
    accentColor: '#9b6fff',
    glowColor: 'rgba(130,60,255,0.18)',
    borderColor: 'rgba(130,60,255,0.35)',
    features: [
      'Capital locked for 1 year',
      '30%–36% yearly return',
      'Monthly payout of 2.5%–3%',
      'Minimum investment: LKR 300,000',
      'Official signed agreement provided',
    ],
  },
  {
    badge: 'Long Term',
    name: '10-Year Wealth Plan',
    tagline: 'Build lasting generational wealth.',
    return: '40%',
    period: 'bonus on total investment',
    min: 'From LKR 1,000/mo',
    accentColor: '#60c0ff',
    glowColor: 'rgba(60,150,255,0.15)',
    borderColor: 'rgba(60,150,255,0.30)',
    features: [
      'Long-term savings plan (10 years)',
      'Monthly increasing contribution',
      '40% bonus on total investment',
      'Paid in full at end of 10 years',
      'Official signed agreement provided',
    ],
  },
];

export default function Plans() {
  return (
    <div className="w-full overflow-hidden" style={{ background: '#04020e' }}>

      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="relative py-32 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 30%,rgba(110,30,220,0.22),transparent 70%)' }} />
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)', backgroundSize: '60px 60px' }} />

        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="relative z-10 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-6"
            style={{ background: 'rgba(130,60,255,0.12)', border: '1px solid rgba(130,60,255,0.35)', color: '#c4a0ff' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
            Investment Plans
          </span>
          <h1 className="font-black leading-tight mb-6 text-white" style={{ fontSize: 'clamp(2.5rem,6vw,5rem)' }}>
            Plans Designed to<br />
            <span style={{
              background: 'linear-gradient(135deg,#00b4ff,#4dcfff,#a060ff)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>Grow Your Wealth</span>
          </h1>
          <p className="text-lg leading-relaxed max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.52)' }}>
            Choose from our structured investment plans — each designed to deliver real, measurable returns with full transparency and security.
          </p>
        </motion.div>
      </section>

      {/* ── Plan Cards ─────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-10 pb-24">
        <div className="grid md:grid-cols-3 gap-7">
          {plans.map((plan, i) => (
            <motion.div key={plan.name} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
              className="relative rounded-2xl overflow-hidden flex flex-col transition-all duration-400 hover:-translate-y-2"
              style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${plan.borderColor}`, boxShadow: `0 0 60px ${plan.glowColor}` }}>
              {/* top glow bar */}
              <div className="h-1 w-full" style={{ background: `linear-gradient(90deg,transparent,${plan.accentColor},transparent)` }} />
              {/* top accent line */}
              <div className="absolute top-0 left-0 right-0 h-px"
                style={{ background: `linear-gradient(90deg,transparent,${plan.accentColor},transparent)` }} />

              <div className="p-8 flex flex-col flex-1">
                {/* Badge */}
                <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-5 w-fit"
                  style={{ background: `${plan.accentColor}18`, color: plan.accentColor, border: `1px solid ${plan.accentColor}40` }}>
                  {plan.badge}
                </span>

                <h2 className="text-2xl font-black text-white mb-1">{plan.name}</h2>
                <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.40)' }}>{plan.tagline}</p>

                {/* Return */}
                <div className="rounded-xl p-5 mb-6" style={{ background: `${plan.accentColor}10`, border: `1px solid ${plan.accentColor}25` }}>
                  <p className="font-black leading-none" style={{ fontSize: '3.5rem', color: plan.accentColor }}>{plan.return}</p>
                  <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.40)' }}>{plan.period}</p>
                  <p className="text-xs mt-2" style={{ color: 'rgba(255,255,255,0.30)' }}>
                    Minimum: <span className="font-semibold text-white/60">{plan.min}</span>
                  </p>
                </div>

                {/* Features */}
                <ul className="flex flex-col gap-3 mb-8 flex-1">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-3 text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
                      <FiCheck className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: plan.accentColor }} />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link to="/contact"
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5"
                  style={{ background: `linear-gradient(135deg, ${plan.accentColor}, ${plan.accentColor}cc)`, color: '#04020e', boxShadow: `0 0 30px ${plan.glowColor}` }}>
                  Get Started <FiArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Disclaimer ─────────────────────────────────────── */}
      <section className="pb-20 px-6 text-center">
        <p className="text-sm max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.28)' }}>
          All plans require a signed official investment agreement. Returns are based on agreed terms.{' '}
          <Link to="/contact" className="hover:underline transition-colors" style={{ color: '#00b4ff' }}>Contact us</Link>{' '}
          for full details before investing.
        </p>
      </section>

    </div>
  );
}

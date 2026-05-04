import { motion } from 'framer-motion';
import { FiMessageCircle, FiFileText, FiDollarSign, FiTrendingUp, FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.12, duration: 0.7, ease: [0.22,1,0.36,1] } }),
};

const steps = [
  { icon: FiMessageCircle, title: 'Contact Us',         desc: 'Reach out via phone, WhatsApp, or our contact form. Our advisor will schedule a free consultation to understand your financial goals.', accent: '#00b4ff' },
  { icon: FiTrendingUp,    title: 'Choose Your Plan',   desc: 'Select from our Fixed 1-Year, Monthly Returns, or 10-Year Wealth Plan — whichever aligns with your investment goals and timeline.', accent: '#9b6fff' },
  { icon: FiDollarSign,    title: 'Deposit Your Funds', desc: 'Transfer your investment amount securely to our company bank account. Minimum investment starts at LKR 300,000.', accent: '#60c0ff' },
  { icon: FiFileText,      title: 'Receive Agreement',  desc: 'We issue you an official signed investment agreement detailing your capital, returns, payout schedule, and terms.', accent: '#00b4ff' },
  { icon: FiTrendingUp,    title: 'Start Earning',      desc: 'Sit back and watch your money grow. Receive your returns monthly or at the end of your plan term — exactly as agreed.', accent: '#9b6fff' },
];

export default function HowItWorks() {
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
            How It Works
          </span>
          <h1 className="font-black leading-tight mb-6 text-white" style={{ fontSize: 'clamp(2.5rem,6vw,5rem)' }}>
            Start Investing in<br />
            <span style={{ background: 'linear-gradient(135deg,#00b4ff,#4dcfff,#a060ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              5 Simple Steps
            </span>
          </h1>
          <p className="text-lg leading-relaxed max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.52)' }}>
            Getting started with Grow More Lanka is simple, transparent, and fully guided by our expert team.
          </p>
        </motion.div>
      </section>

      {/* ── Steps ──────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-6 py-10 pb-28">
        <div className="relative flex flex-col gap-6">
          {/* Vertical connector line */}
          <div className="absolute left-6 top-10 bottom-10 w-px hidden md:block"
            style={{ background: 'linear-gradient(to bottom, #c9a84c, rgba(130,60,255,0.4), transparent)' }} />

          {steps.map((step, i) => (
            <motion.div key={step.title} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
              className="flex gap-6 items-start group">
              {/* Icon bubble */}
              <div className="relative flex-shrink-0 z-10"
                style={{ filter: `drop-shadow(0 0 16px ${step.accent}60)` }}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                  style={{ background: `${step.accent}15`, border: `2px solid ${step.accent}50` }}>
                  <step.icon className="w-5 h-5" style={{ color: step.accent }} />
                </div>
              </div>

              {/* Card */}
              <div className="relative flex-1 rounded-2xl p-7 overflow-hidden transition-all duration-400 group-hover:-translate-y-0.5"
                style={{ background: 'rgba(255,255,255,0.035)', border: '1px solid rgba(255,255,255,0.07)' }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = `${step.accent}0d`;
                  e.currentTarget.style.border = `1px solid ${step.accent}30`;
                  e.currentTarget.style.boxShadow = `0 0 60px ${step.accent}15`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.035)';
                  e.currentTarget.style.border = '1px solid rgba(255,255,255,0.07)';
                  e.currentTarget.style.boxShadow = 'none';
                }}>
                {/* top accent */}
                <div className="absolute top-0 left-0 right-0 h-px"
                  style={{ background: `linear-gradient(90deg,transparent,${step.accent}60,transparent)` }} />
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-black tracking-[0.25em] uppercase" style={{ color: step.accent }}>
                    0{i + 1}
                  </span>
                  <h3 className="text-lg font-bold text-white">{step.title}</h3>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.50)' }}>{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────── */}
      <section className="pb-28 px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          className="max-w-3xl mx-auto rounded-3xl p-12 text-center relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg,rgba(100,30,220,0.22),rgba(20,5,60,0.7))', border: '1px solid rgba(150,80,255,0.2)', boxShadow: '0 0 120px rgba(100,30,220,0.12)' }}>
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 60% 50% at 50% -10%,rgba(130,50,255,0.28),transparent 70%)' }} />
          <h2 className="text-3xl font-black text-white mb-4 relative z-10">Ready to Take the First Step?</h2>
          <p className="mb-8 relative z-10" style={{ color: 'rgba(255,255,255,0.50)' }}>Contact us today and start your investment journey with Grow More Lanka.</p>
          <Link to="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-sm text-[#04020e] transition-all hover:-translate-y-0.5 relative z-10"
            style={{ background: 'linear-gradient(135deg,#00b4ff,#4dcfff)', boxShadow: '0 0 40px rgba(0,180,255,0.35)' }}>
            Contact Us Now <FiArrowRight />
          </Link>
        </motion.div>
      </section>

    </div>
  );
}

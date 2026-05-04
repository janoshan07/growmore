import { motion } from 'framer-motion';
import { FiArrowUpRight } from 'react-icons/fi';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.7, ease: [0.22,1,0.36,1] } }),
};

const ventures = [
  { name: 'GML Real Estate',   category: 'Property & Land', desc: 'Investing in high-growth real estate across Sri Lanka, from residential developments to commercial properties.', status: 'Active',      accent: '#00b4ff' },
  { name: 'GML Agri Fund',     category: 'Agriculture',     desc: 'Funding sustainable agricultural ventures that produce both financial returns and social impact for local communities.', status: 'Active',  accent: '#4cde80' },
  { name: 'GML Tech Ventures', category: 'Technology',      desc: 'Backing early-stage Sri Lankan tech startups with growth potential in fintech, e-commerce, and digital services.', status: 'Growing',    accent: '#60c0ff' },
  { name: 'GML Trade Hub',     category: 'Import & Export', desc: 'Building a diversified trade portfolio across key commodities, connecting local suppliers with international markets.', status: 'Active',  accent: '#9b6fff' },
  { name: 'GML SME Partners',  category: 'Small Business',  desc: 'Providing capital and mentorship to small and medium enterprises in Sri Lanka to accelerate their growth.', status: 'Expanding',         accent: '#ff8c60' },
  { name: 'GML Education Fund',category: 'Education',       desc: 'Investing in educational institutions and EdTech platforms to uplift human capital across Sri Lanka.', status: 'Coming Soon',           accent: '#c4a0ff' },
];

const statusStyle = {
  'Active':      { bg: 'rgba(76,222,128,0.12)', text: '#4cde80', border: 'rgba(76,222,128,0.25)' },
  'Growing':     { bg: 'rgba(96,192,255,0.12)', text: '#60c0ff', border: 'rgba(96,192,255,0.25)' },
  'Expanding':   { bg: 'rgba(255,140,96,0.12)', text: '#ff8c60', border: 'rgba(255,140,96,0.25)' },
  'Coming Soon': { bg: 'rgba(255,255,255,0.06)', text: 'rgba(255,255,255,0.40)', border: 'rgba(255,255,255,0.12)' },
};

export default function Ventures() {
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
            Ventures Builders
          </span>
          <h1 className="font-black leading-tight mb-6 text-white" style={{ fontSize: 'clamp(2.5rem,6vw,5rem)' }}>
            Where Capital Meets<br />
            <span style={{ background: 'linear-gradient(135deg,#00b4ff,#4dcfff,#a060ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Opportunity
            </span>
          </h1>
          <p className="text-lg leading-relaxed max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.52)' }}>
            Beyond personal investment plans, Grow More Lanka actively builds and backs ventures across multiple sectors — creating diverse, sustainable wealth ecosystems.
          </p>
        </motion.div>
      </section>

      {/* ── Cards ──────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-10 pb-24">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-14">
          <h2 className="font-black text-white mb-3" style={{ fontSize: 'clamp(1.8rem,4vw,3rem)' }}>Our Venture Portfolio</h2>
          <p className="max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.42)' }}>Each venture is carefully selected for its growth potential and contribution to Sri Lanka's economic development.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {ventures.map((v, i) => {
            const ss = statusStyle[v.status];
            return (
              <motion.div key={v.name} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                className="group relative rounded-2xl p-7 overflow-hidden flex flex-col gap-4 transition-all duration-400 hover:-translate-y-1 cursor-default"
                style={{ background: 'rgba(255,255,255,0.035)', border: '1px solid rgba(255,255,255,0.07)' }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = `${v.accent}0d`;
                  e.currentTarget.style.border = `1px solid ${v.accent}35`;
                  e.currentTarget.style.boxShadow = `0 0 60px ${v.accent}18`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.035)';
                  e.currentTarget.style.border = '1px solid rgba(255,255,255,0.07)';
                  e.currentTarget.style.boxShadow = 'none';
                }}>
                {/* top accent line */}
                <div className="absolute top-0 left-0 right-0 h-px transition-opacity duration-300"
                  style={{ background: `linear-gradient(90deg,transparent,${v.accent},transparent)`, opacity: 0 }}
                  ref={el => el && el.parentElement.addEventListener('mouseenter', () => el.style.opacity = '1') && el.parentElement.addEventListener('mouseleave', () => el.style.opacity = '0')} />

                <div className="flex items-start justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest" style={{ color: v.accent }}>{v.category}</span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{ background: ss.bg, color: ss.text, border: `1px solid ${ss.border}` }}>
                    {v.status}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2 group-hover:text-[#00b4ff] transition-colors duration-300">
                    {v.name}
                    <FiArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-[-4px] group-hover:translate-x-0" />
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>{v.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── Join CTA ───────────────────────────────────────── */}
      <section className="pb-28 px-6" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          className="max-w-2xl mx-auto text-center pt-20">
          <h2 className="text-3xl font-black text-white mb-4">Have a Venture Idea?</h2>
          <p className="mb-8" style={{ color: 'rgba(255,255,255,0.45)' }}>We partner with ambitious entrepreneurs and businesses. If you have a solid idea and need capital, let's talk.</p>
          <a href="mailto:growmorelanka@gmail.com"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-sm text-[#04020e] transition-all hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg,#00b4ff,#4dcfff)', boxShadow: '0 0 40px rgba(0,180,255,0.25)' }}>
            Pitch Your Idea
          </a>
        </motion.div>
      </section>

    </div>
  );
}

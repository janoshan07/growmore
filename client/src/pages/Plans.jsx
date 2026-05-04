import { motion } from 'framer-motion';
import { FiArrowRight, FiCheck } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const plans = [
  {
    badge: 'Most Popular',
    name: 'Fixed 1-Year Plan',
    tagline: 'Maximum returns, guaranteed.',
    return: '50%',
    period: 'yearly return',
    min: 'LKR 300,000',
    color: '#c9a84c',
    features: [
      'Capital locked for 1 year',
      '50% yearly return guaranteed',
      'Capital + profit paid at year end',
      'Minimum investment: LKR 300,000',
      'Official agreement provided',
    ],
  },
  {
    badge: 'Monthly Income',
    name: 'Monthly Returns Plan',
    tagline: 'Regular income every month.',
    return: '30–36%',
    period: 'yearly return',
    min: 'LKR 300,000',
    color: '#1a4b8b',
    features: [
      'Capital locked for 1 year',
      '30%–36% yearly return',
      'Monthly payout of 2.5%–3%',
      'Minimum investment: LKR 300,000',
      'Official agreement provided',
    ],
  },
  {
    badge: 'Long Term',
    name: '10-Year Wealth Plan',
    tagline: 'Build lasting generational wealth.',
    return: '40%',
    period: 'bonus on total investment',
    min: 'Start from LKR 1,000/mo',
    color: '#0f1c3f',
    features: [
      'Long-term savings plan (10 years)',
      'Monthly increasing contribution',
      '40% bonus on total investment',
      'Paid in full at end of 10 years',
      'Official agreement provided',
    ],
  },
];

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.15, duration: 0.6 } }) };

export default function Plans() {
  return (
    <div className="w-full bg-gray-50 overflow-hidden">

      {/* Hero */}
      <section className="relative bg-[#0f1c3f] text-white py-24 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_#c9a84c_0%,_transparent_70%)]" />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="relative z-10 max-w-3xl mx-auto">
          <span className="inline-block bg-[#c9a84c]/20 border border-[#c9a84c]/40 text-[#c9a84c] text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6">Investment Plans</span>
          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
            Plans Designed to<br />
            <span className="text-[#c9a84c]">Grow Your Wealth</span>
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Choose from our structured investment plans — each designed to deliver real, measurable returns with full transparency and security.
          </p>
        </motion.div>
      </section>

      {/* Plan Cards */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <motion.div key={plan.name} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
              className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-400 flex flex-col">
              {/* Top accent bar */}
              <div className="h-1.5 w-full" style={{ backgroundColor: plan.color }} />
              <div className="p-8 flex flex-col flex-1">
                <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-5"
                  style={{ backgroundColor: plan.color + '18', color: plan.color }}>
                  {plan.badge}
                </span>
                <h2 className="text-2xl font-black text-[#0f1c3f] mb-2">{plan.name}</h2>
                <p className="text-gray-500 text-sm mb-6">{plan.tagline}</p>

                {/* Return highlight */}
                <div className="rounded-xl p-5 mb-6" style={{ backgroundColor: plan.color + '12' }}>
                  <p className="text-5xl font-black" style={{ color: plan.color }}>{plan.return}</p>
                  <p className="text-gray-500 text-sm mt-1">{plan.period}</p>
                  <p className="text-xs text-gray-400 mt-2">Minimum: <span className="font-semibold text-gray-600">{plan.min}</span></p>
                </div>

                {/* Features */}
                <ul className="flex flex-col gap-3 mb-8 flex-1">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-3 text-sm text-gray-600">
                      <FiCheck className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: plan.color }} />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link to="/contact"
                  className="btn-primary flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold"
                  style={{ backgroundColor: plan.color, border: 'none' }}>
                  Get Started <FiArrowRight className="btn-icon" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Disclaimer */}
      <section className="max-w-4xl mx-auto px-6 pb-20 text-center">
        <p className="text-gray-400 text-sm">
          All plans require a signed official investment agreement. Returns are based on agreed terms. 
          Please <Link to="/contact" className="text-[#c9a84c] hover:underline">contact us</Link> for full details before investing.
        </p>
      </section>

    </div>
  );
}

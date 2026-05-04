import { motion } from 'framer-motion';
import { FiMessageCircle, FiFileText, FiDollarSign, FiTrendingUp } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const steps = [
  {
    number: '01',
    icon: FiMessageCircle,
    title: 'Contact Us',
    desc: 'Reach out via phone, WhatsApp, or our contact form. Our advisor will schedule a free consultation to understand your financial goals.',
  },
  {
    number: '02',
    icon: FiTrendingUp,
    title: 'Choose Your Plan',
    desc: 'Select from our Fixed 1-Year, Monthly Returns, or 10-Year Wealth Plan — whichever aligns with your investment goals and timeline.',
  },
  {
    number: '03',
    icon: FiDollarSign,
    title: 'Deposit Your Funds',
    desc: 'Transfer your investment amount securely to our company bank account. Minimum investment starts at LKR 300,000.',
  },
  {
    number: '04',
    icon: FiFileText,
    title: 'Receive Agreement',
    desc: 'We issue you an official signed investment agreement detailing your capital, returns, payout schedule, and terms.',
  },
  {
    number: '05',
    icon: FiTrendingUp,
    title: 'Start Earning',
    desc: 'Sit back and watch your money grow. Receive your returns monthly or at the end of your plan term — exactly as agreed.',
  },
];

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.12, duration: 0.6 } }) };

export default function HowItWorks() {
  return (
    <div className="w-full bg-gray-50 overflow-hidden">

      {/* Hero */}
      <section className="relative bg-[#0f1c3f] text-white py-24 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_#c9a84c_0%,_transparent_70%)]" />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="relative z-10 max-w-3xl mx-auto">
          <span className="inline-block bg-[#c9a84c]/20 border border-[#c9a84c]/40 text-[#c9a84c] text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6">How It Works</span>
          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
            Start Investing in<br />
            <span className="text-[#c9a84c]">5 Simple Steps</span>
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Getting started with Grow More Lanka is simple, transparent, and fully guided by our expert team.
          </p>
        </motion.div>
      </section>

      {/* Steps */}
      <section className="max-w-4xl mx-auto px-6 py-24">
        <div className="relative">
          {/* Vertical line connector */}
          <div className="absolute left-[28px] top-8 bottom-8 w-0.5 bg-gradient-to-b from-[#c9a84c] via-[#c9a84c]/30 to-transparent hidden md:block" />

          <div className="flex flex-col gap-12">
            {steps.map((step, i) => (
              <motion.div key={step.number} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                className="flex gap-8 items-start group">
                {/* Step circle */}
                <div className="relative flex-shrink-0">
                  <div className="w-14 h-14 rounded-full bg-[#0f1c3f] border-2 border-[#c9a84c] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 z-10 relative">
                    <step.icon className="w-6 h-6 text-[#c9a84c]" />
                  </div>
                </div>

                {/* Content */}
                <div className="bg-white border border-gray-200 rounded-2xl p-7 flex-1 hover:shadow-lg hover:border-[#c9a84c]/30 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-black text-[#c9a84c] tracking-[0.25em] uppercase">{step.number}</span>
                    <h3 className="text-xl font-bold text-[#0f1c3f]">{step.title}</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0f1c3f] py-20 px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to take the first step?</h2>
          <p className="text-white/60 mb-8">Contact us today and start your investment journey with Grow More Lanka.</p>
          <Link to="/contact" className="inline-flex items-center gap-2 bg-[#c9a84c] hover:bg-[#b8973d] text-[#0f1c3f] font-bold px-8 py-3.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5 shadow-lg">
            Contact Us Now
          </Link>
        </motion.div>
      </section>

    </div>
  );
}

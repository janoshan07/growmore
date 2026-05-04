import { motion } from 'framer-motion';
import { FiShield, FiTrendingUp, FiUsers, FiAward } from 'react-icons/fi';

const values = [
  { icon: FiShield, title: 'Transparency', desc: 'Every transaction and return is clearly documented and shared with our clients.' },
  { icon: FiTrendingUp, title: 'High Returns', desc: 'We consistently deliver industry-leading returns through expert market strategies.' },
  { icon: FiUsers, title: 'Client First', desc: 'Our dedicated team is always available to support and guide you through your journey.' },
  { icon: FiAward, title: 'Proven Track Record', desc: 'Years of trusted investment management with a growing portfolio of satisfied clients.' },
];

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6 } }) };

export default function About() {
  return (
    <div className="w-full bg-gray-50 overflow-hidden">

      {/* Hero */}
      <section className="relative bg-[#0f1c3f] text-white py-24 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_#c9a84c_0%,_transparent_70%)]" />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="relative z-10 max-w-3xl mx-auto">
          <span className="inline-block bg-[#c9a84c]/20 border border-[#c9a84c]/40 text-[#c9a84c] text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6">About Us</span>
          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
            Grow More Lanka<br />
            <span className="text-[#c9a84c]">Investment Consultancy</span>
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            A trusted investment consultancy based in Sri Lanka, helping individuals grow their wealth through transparent, professional, and high-return investment plans.
          </p>
        </motion.div>
      </section>

      {/* Company Story */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <span className="text-[#c9a84c] font-semibold text-sm uppercase tracking-widest">Our Story</span>
            <h2 className="text-3xl font-bold text-[#0f1c3f] mt-3 mb-6">Building Wealth, Building Trust</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Grow More Lanka Investment Consultancy was founded with a single vision — to provide Sri Lankans with a reliable, transparent, and profitable avenue for growing their savings.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              Operating from the heart of Sri Lanka, we have helped hundreds of clients achieve financial freedom through structured investment plans tailored to every life stage.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Our team of experienced financial advisors works tirelessly to ensure every investor's capital is managed with the utmost care, integrity, and professionalism.
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
            className="bg-[#0f1c3f] rounded-2xl p-10 text-white flex flex-col gap-6">
            <div>
              <p className="text-[#c9a84c] text-sm font-semibold uppercase tracking-wider mb-1">Official Name</p>
              <p className="text-lg font-bold">Grow More Lanka Investment Consultancy</p>
            </div>
            <div>
              <p className="text-[#c9a84c] text-sm font-semibold uppercase tracking-wider mb-1">Location</p>
              <p className="text-lg font-bold">Sri Lanka</p>
            </div>
            <div>
              <p className="text-[#c9a84c] text-sm font-semibold uppercase tracking-wider mb-1">Established</p>
              <p className="text-lg font-bold">Proudly Serving Since Day One</p>
            </div>
            <div>
              <p className="text-[#c9a84c] text-sm font-semibold uppercase tracking-wider mb-1">Specialisation</p>
              <p className="text-lg font-bold">Fixed-Return & Long-Term Wealth Plans</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10">
          {[
            { label: 'Our Mission', text: 'To empower every Sri Lankan with access to structured, high-return investment plans that generate real, measurable wealth — built on a foundation of trust, transparency, and proven results.' },
            { label: 'Our Vision', text: 'To become the most trusted investment consultancy in Sri Lanka, recognised for delivering consistent returns, fostering long-term client relationships, and transforming financial futures.' },
          ].map((item, i) => (
            <motion.div key={item.label} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
              className="border border-gray-200 rounded-2xl p-8 hover:shadow-lg hover:border-[#c9a84c]/30 transition-all duration-300">
              <span className="inline-block bg-[#c9a84c]/10 text-[#c9a84c] text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">{item.label}</span>
              <p className="text-gray-700 leading-relaxed text-base">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <span className="text-[#c9a84c] font-semibold text-sm uppercase tracking-widest">Why Us</span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#0f1c3f] mt-3">Why Choose Grow More Lanka?</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, i) => (
            <motion.div key={v.title} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
              className="bg-white border border-gray-200 rounded-2xl p-7 hover:shadow-xl hover:border-[#c9a84c]/30 hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-12 h-12 bg-[#c9a84c]/10 rounded-xl flex items-center justify-center mb-5 group-hover:bg-[#c9a84c]/20 transition-colors">
                <v.icon className="w-5 h-5 text-[#c9a84c]" />
              </div>
              <h3 className="font-bold text-[#0f1c3f] text-lg mb-3">{v.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

    </div>
  );
}

import { motion } from 'framer-motion';
import { FiArrowUpRight } from 'react-icons/fi';

const ventures = [
  {
    name: 'GML Real Estate',
    category: 'Property & Land',
    desc: 'Investing in high-growth real estate across Sri Lanka, from residential developments to commercial properties.',
    status: 'Active',
  },
  {
    name: 'GML Agri Fund',
    category: 'Agriculture',
    desc: 'Funding sustainable agricultural ventures that produce both financial returns and social impact for local communities.',
    status: 'Active',
  },
  {
    name: 'GML Tech Ventures',
    category: 'Technology',
    desc: 'Backing early-stage Sri Lankan tech startups with growth potential in fintech, e-commerce, and digital services.',
    status: 'Growing',
  },
  {
    name: 'GML Trade Hub',
    category: 'Import & Export',
    desc: 'Building a diversified trade portfolio across key commodities, connecting local suppliers with international markets.',
    status: 'Active',
  },
  {
    name: 'GML SME Partners',
    category: 'Small Business',
    desc: 'Providing capital and mentorship to small and medium enterprises in Sri Lanka to accelerate their growth.',
    status: 'Expanding',
  },
  {
    name: 'GML Education Fund',
    category: 'Education',
    desc: 'Investing in educational institutions and EdTech platforms to uplift human capital across Sri Lanka.',
    status: 'Coming Soon',
  },
];

const statusColor = {
  'Active': 'bg-green-100 text-green-700',
  'Growing': 'bg-blue-100 text-blue-700',
  'Expanding': 'bg-purple-100 text-purple-700',
  'Coming Soon': 'bg-gray-100 text-gray-500',
};

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6 } }) };

export default function Ventures() {
  return (
    <div className="w-full bg-gray-50 overflow-hidden">

      {/* Hero */}
      <section className="relative bg-[#0f1c3f] text-white py-24 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_#c9a84c_0%,_transparent_70%)]" />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="relative z-10 max-w-3xl mx-auto">
          <span className="inline-block bg-[#c9a84c]/20 border border-[#c9a84c]/40 text-[#c9a84c] text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6">Ventures Builders</span>
          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
            Where Capital Meets<br />
            <span className="text-[#c9a84c]">Opportunity</span>
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Beyond personal investment plans, Grow More Lanka actively builds and backs ventures across multiple sectors — creating diverse, sustainable wealth ecosystems.
          </p>
        </motion.div>
      </section>

      {/* Venture Cards */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0f1c3f]">Our Venture Portfolio</h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto">Each venture is carefully selected for its growth potential and contribution to Sri Lanka's economic development.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ventures.map((v, i) => (
            <motion.div key={v.name} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
              className="bg-white border border-gray-200 rounded-2xl p-7 hover:shadow-xl hover:border-[#c9a84c]/30 hover:-translate-y-1 transition-all duration-300 group flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <span className="text-xs font-semibold text-[#c9a84c] uppercase tracking-widest">{v.category}</span>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColor[v.status]}`}>{v.status}</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#0f1c3f] group-hover:text-[#c9a84c] transition-colors flex items-center gap-2">
                  {v.name} <FiArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mt-2">{v.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Join CTA */}
      <section className="bg-white border-t border-gray-200 py-20 px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-[#0f1c3f] mb-4">Have a Venture Idea?</h2>
          <p className="text-gray-600 mb-8">We partner with ambitious entrepreneurs and businesses. If you have a solid idea and need capital, let's talk.</p>
          <a href="mailto:growmorelanka@gmail.com"
            className="inline-flex items-center gap-2 bg-[#0f1c3f] hover:bg-[#1a2f5a] text-white font-semibold px-8 py-3.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5 shadow-lg">
            Pitch Your Idea
          </a>
        </motion.div>
      </section>

    </div>
  );
}

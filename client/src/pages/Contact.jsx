import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiPhone, FiMail, FiMapPin, FiInstagram, FiFacebook, FiSend } from 'react-icons/fi';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.12, duration: 0.7, ease: [0.22,1,0.36,1] } }),
};

const WHATSAPP_NUMBER = '94770055313';
const MAP_URL = 'https://www.google.com/maps/search/?api=1&query=Sri+Lanka';

const InfoCard = ({ icon: Icon, label, children, accent = '#c9a84c' }) => (
  <div
    className="flex items-start gap-4 p-5 rounded-2xl transition-all duration-300 hover:-translate-y-0.5"
    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
    onMouseEnter={e => {
      e.currentTarget.style.background = `${accent}0d`;
      e.currentTarget.style.border = `1px solid ${accent}35`;
      e.currentTarget.style.boxShadow = `0 0 40px ${accent}15`;
    }}
    onMouseLeave={e => {
      e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
      e.currentTarget.style.border = '1px solid rgba(255,255,255,0.08)';
      e.currentTarget.style.boxShadow = 'none';
    }}
  >
    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
      style={{ background: `${accent}15`, border: `1px solid ${accent}35` }}>
      <Icon className="w-4 h-4" style={{ color: accent }} />
    </div>
    <div>
      <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.35)' }}>{label}</p>
      {children}
    </div>
  </div>
);

export default function Contact() {
  const [form, setForm] = useState({ name: '', phone: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = e => {
    e.preventDefault();
    const msg = encodeURIComponent(`Hi, I'm ${form.name}.\nPhone: ${form.phone}\n\n${form.message}`);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  const inputStyle = {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: 'white',
    borderRadius: '12px',
    padding: '14px 16px',
    width: '100%',
    outline: 'none',
    fontSize: '14px',
    transition: 'all 0.2s',
  };

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
            Contact Us
          </span>
          <h1 className="font-black leading-tight mb-6 text-white" style={{ fontSize: 'clamp(2.5rem,6vw,5rem)' }}>
            Let's Start Your<br />
            <span style={{ background: 'linear-gradient(135deg,#00b4ff,#4dcfff,#a060ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Investment Journey
            </span>
          </h1>
          <p className="text-lg leading-relaxed max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.52)' }}>
            Reach out to our team — available on WhatsApp, phone, and email to answer all your questions.
          </p>
        </motion.div>
      </section>

      {/* ── Content ────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-10 pb-28">
        <div className="grid lg:grid-cols-2 gap-12">

          {/* ── Info Column ──────────────────────────────── */}
          <motion.div custom={0} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="flex flex-col gap-5">

            <div className="mb-2">
              <h2 className="text-2xl font-bold text-white mb-2">Get In Touch</h2>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.42)' }}>We'd love to hear from you. Here are all the ways to reach us.</p>
            </div>

            <InfoCard icon={FiPhone} label="Phone / WhatsApp" accent="#00b4ff">
              <a href="tel:+94770055313" className="block font-bold text-white hover:text-[#00b4ff] transition-colors text-base">0770 055 313</a>
              <a href="tel:+94751854545" className="block font-bold text-white hover:text-[#00b4ff] transition-colors text-base">0751 854 545</a>
            </InfoCard>

            <InfoCard icon={FiMail} label="Email" accent="#9b6fff">
              <a href="mailto:growmorelanka@gmail.com" className="font-bold text-white hover:text-[#9b6fff] transition-colors text-base">
                growmorelanka@gmail.com
              </a>
            </InfoCard>

            <InfoCard icon={FiMapPin} label="Location" accent="#60c0ff">
              <a href={MAP_URL} target="_blank" rel="noopener noreferrer"
                className="font-bold text-white hover:text-[#60c0ff] transition-colors hover:underline text-base">
                Sri Lanka 🇱🇰
              </a>
            </InfoCard>

            {/* Social */}
            <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'rgba(255,255,255,0.35)' }}>Follow Us</p>
              <div className="flex gap-3">
                {[
                  { href: 'https://www.instagram.com/grow_more_lanka_07', label: 'Instagram', bg: 'linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)', icon: FiInstagram },
                  { href: 'https://www.facebook.com', label: 'Facebook', bg: '#1877f2', icon: FiFacebook },
                ].map(s => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold hover:-translate-y-0.5 transition-transform"
                    style={{ background: s.bg }}>
                    <s.icon className="w-4 h-4" /> {s.label}
                  </a>
                ))}
                <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold hover:-translate-y-0.5 transition-transform"
                  style={{ background: 'linear-gradient(135deg,#25d366,#128c7e)' }}>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.558 4.122 1.532 5.855L0 24l6.335-1.654A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.374l-.36-.214-3.727.973.994-3.634-.235-.374A9.818 9.818 0 112 12c0-5.413 4.405-9.818 9.818-9.818S21.818 6.587 21.818 12 17.413 21.818 12 21.818z"/></svg>
                  WhatsApp
                </a>
              </div>
            </div>
          </motion.div>

          {/* ── Form Column ──────────────────────────────── */}
          <motion.div custom={1} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <div className="relative rounded-2xl p-8 overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              {/* top glow line */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px"
                style={{ background: 'linear-gradient(90deg,transparent,rgba(0,180,255,0.7),transparent)' }} />
              <div className="absolute top-0 right-0 w-64 h-64 pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(130,60,255,0.08) 0%, transparent 70%)' }} />

              <h2 className="text-2xl font-bold text-white mb-1">Send Us a Message</h2>
              <p className="text-sm mb-8" style={{ color: 'rgba(255,255,255,0.40)' }}>Fill in the form — we'll connect you on WhatsApp instantly.</p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {[
                  { name: 'name',    label: 'Full Name',     placeholder: 'Your name',       type: 'text' },
                  { name: 'phone',   label: 'Phone Number',  placeholder: '07X XXX XXXX',    type: 'tel' },
                ].map(field => (
                  <div key={field.name}>
                    <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.40)' }}>
                      {field.label}
                    </label>
                    <input
                      name={field.name}
                      type={field.type}
                      value={form[field.name]}
                      onChange={handleChange}
                      required
                      placeholder={field.placeholder}
                      style={inputStyle}
                      onFocus={e => {
                        e.target.style.border = '1px solid rgba(0,180,255,0.5)';
                        e.target.style.boxShadow = '0 0 20px rgba(0,180,255,0.12)';
                      }}
                      onBlur={e => {
                        e.target.style.border = '1px solid rgba(255,255,255,0.1)';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                ))}

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.40)' }}>Message</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Tell us about your investment interest..."
                    style={{ ...inputStyle, resize: 'none' }}
                    onFocus={e => {
                      e.target.style.border = '1px solid rgba(0,180,255,0.5)';
                      e.target.style.boxShadow = '0 0 20px rgba(0,180,255,0.12)';
                    }}
                    onBlur={e => {
                      e.target.style.border = '1px solid rgba(255,255,255,0.1)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

                <button type="submit"
                  className="relative overflow-hidden flex items-center justify-center gap-2 w-full py-4 rounded-xl font-bold text-sm text-[#04020e] transition-all hover:-translate-y-0.5 active:scale-95"
                  style={{ background: 'linear-gradient(135deg,#00b4ff,#4dcfff)', boxShadow: '0 0 40px rgba(0,180,255,0.3)' }}>
                  <span className="absolute inset-0 bg-white/0 hover:bg-white/15 transition-all duration-300" />
                  {sent
                    ? '✅ Sent! We\'ll be in touch soon.'
                    : (<><FiSend className="w-4 h-4" /> <span className="relative">Send via WhatsApp</span></>)
                  }
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}

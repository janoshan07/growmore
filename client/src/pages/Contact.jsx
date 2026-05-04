import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiPhone, FiMail, FiMapPin, FiInstagram, FiFacebook, FiSend } from 'react-icons/fi';

const WHATSAPP_NUMBER = '94770055313';
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;
const MAP_URL = 'https://www.google.com/maps/search/?api=1&query=Sri+Lanka';

export default function Contact() {
  const [form, setForm] = useState({ name: '', phone: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const msg = encodeURIComponent(`Hi, I'm ${form.name}.\nPhone: ${form.phone}\n\n${form.message}`);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <div className="w-full bg-gray-50 overflow-hidden">

      {/* Hero */}
      <section className="relative bg-[#0f1c3f] text-white py-24 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_#c9a84c_0%,_transparent_70%)]" />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="relative z-10 max-w-3xl mx-auto">
          <span className="inline-block bg-[#c9a84c]/20 border border-[#c9a84c]/40 text-[#c9a84c] text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6">Contact Us</span>
          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
            Let's Start Your<br />
            <span className="text-[#c9a84c]">Investment Journey</span>
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Reach out to our team — we're available on WhatsApp, phone, and email to answer all your questions.
          </p>
        </motion.div>
      </section>

      {/* Content */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-14">

          {/* Contact Info */}
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
            className="flex flex-col gap-8">

            <div>
              <h2 className="text-2xl font-bold text-[#0f1c3f] mb-2">Get In Touch</h2>
              <p className="text-gray-500">We'd love to hear from you. Here are all the ways to reach us.</p>
            </div>

            {/* Phone */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 flex items-start gap-4 hover:shadow-lg hover:border-[#c9a84c]/30 transition-all">
              <div className="w-12 h-12 bg-[#c9a84c]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <FiPhone className="w-5 h-5 text-[#c9a84c]" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Phone / WhatsApp</p>
                <a href="tel:+94770055313" className="block text-[#0f1c3f] font-bold text-lg hover:text-[#c9a84c] transition-colors">0770 055 313</a>
                <a href="tel:+94751854545" className="block text-[#0f1c3f] font-bold text-lg hover:text-[#c9a84c] transition-colors">0751 854 545</a>
              </div>
            </div>

            {/* Email */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 flex items-start gap-4 hover:shadow-lg hover:border-[#c9a84c]/30 transition-all">
              <div className="w-12 h-12 bg-[#c9a84c]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <FiMail className="w-5 h-5 text-[#c9a84c]" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Email</p>
                <a href="mailto:growmorelanka@gmail.com" className="text-[#0f1c3f] font-bold text-lg hover:text-[#c9a84c] transition-colors">
                  growmorelanka@gmail.com
                </a>
              </div>
            </div>

            {/* Location */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 flex items-start gap-4 hover:shadow-lg hover:border-[#c9a84c]/30 transition-all">
              <div className="w-12 h-12 bg-[#c9a84c]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <FiMapPin className="w-5 h-5 text-[#c9a84c]" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Location</p>
                <a href={MAP_URL} target="_blank" rel="noopener noreferrer"
                  className="text-[#0f1c3f] font-bold text-lg hover:text-[#c9a84c] transition-colors hover:underline">
                  Sri Lanka 🇱🇰
                </a>
              </div>
            </div>

            {/* Social */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Follow Us</p>
              <div className="flex gap-4">
                <a href="https://www.instagram.com/grow_more_lanka_07" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white text-sm font-semibold hover:-translate-y-0.5 transition-transform shadow-md">
                  <FiInstagram className="w-4 h-4" /> Instagram
                </a>
                <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:-translate-y-0.5 transition-transform shadow-md">
                  <FiFacebook className="w-4 h-4" /> Facebook
                </a>
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-500 text-white text-sm font-semibold hover:-translate-y-0.5 transition-transform shadow-md">
                  WhatsApp
                </a>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-[#0f1c3f] mb-2">Send Us a Message</h2>
              <p className="text-gray-500 text-sm mb-8">Fill in the form below and we'll connect you on WhatsApp instantly.</p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Full Name</label>
                  <input name="name" value={form.name} onChange={handleChange} required
                    placeholder="Your name"
                    className="input-field" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Phone Number</label>
                  <input name="phone" value={form.phone} onChange={handleChange} required
                    placeholder="07X XXX XXXX"
                    className="input-field" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Message</label>
                  <textarea name="message" value={form.message} onChange={handleChange} required rows={5}
                    placeholder="Tell us about your investment interest..."
                    className="input-field resize-none" />
                </div>

                <button type="submit"
                  className="btn-primary flex items-center justify-center gap-2 w-full py-3.5 text-base"
                  style={{ backgroundColor: '#0f1c3f' }}>
                  {sent ? '✅ Message Sent!' : (<><FiSend className="btn-icon" /> Send via WhatsApp</>)}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}

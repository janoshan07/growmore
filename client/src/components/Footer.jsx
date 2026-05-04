import { Link } from 'react-router-dom';
import { FiMail, FiMapPin, FiPhone, FiInstagram, FiFacebook, FiArrowUpRight } from 'react-icons/fi';

const quickLinks = [
  { to: '/',            label: 'Home' },
  { to: '/about',       label: 'About Us' },
  { to: '/plans',       label: 'Investment Plans' },
  { to: '/how-it-works',label: 'How It Works' },
  { to: '/ventures',    label: 'Ventures Builders' },
  { to: '/contact',     label: 'Contact' },
];

const legalLinks = [
  { to: '/legal#terms',    label: 'Terms & Conditions' },
  { to: '/legal#risk',     label: 'Risk Disclosure' },
  { to: '/legal#refund',   label: 'Withdrawal Policy' },
  { to: '/legal#agreement',label: 'Investment Agreement' },
];

const WHATSAPP = 'https://wa.me/94770055313';
const MAP_URL  = 'https://www.google.com/maps/search/?api=1&query=Sri+Lanka';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{ background: '#07071a', borderTop: '1px solid rgba(255,255,255,0.07)' }}
      className="mt-auto"
    >
      {/* ── Main grid ───────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="lg:col-span-1 flex flex-col gap-5">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group w-fit select-none">
              <div className="relative w-10 h-10 flex-shrink-0">
                <svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <circle cx="22" cy="22" r="21" fill="#0f1c3f" stroke="#c9a84c" strokeWidth="1.5"/>
                  <text x="9" y="28" fontFamily="Georgia,serif" fontWeight="700" fontSize="18" fill="#c9a84c">G</text>
                  <rect x="26" y="23" width="3.5" height="7"  rx="0.8" fill="#c9a84c"/>
                  <rect x="30.5" y="19" width="3.5" height="11" rx="0.8" fill="#c9a84c"/>
                  <rect x="35"   y="15" width="3.5" height="15" rx="0.8" fill="#c9a84c"/>
                </svg>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-[16px] font-black text-white tracking-widest uppercase" style={{ letterSpacing: '0.12em' }}>GROW MORE</span>
                <span className="text-[10px] font-bold text-[#c9a84c] uppercase" style={{ letterSpacing: '0.32em' }}>LANKA</span>
              </div>
            </Link>

            <p className="text-white/40 text-sm leading-relaxed max-w-xs">
              Sri Lanka's trusted investment consultancy. Delivering transparent, high-return plans with fully signed agreements.
            </p>

            {/* Tagline badge */}
            <div className="inline-flex items-center gap-2 border border-[#c9a84c]/30 bg-[#c9a84c]/08 px-3 py-1.5 rounded-full w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c9a84c] animate-pulse" />
              <span className="text-[#c9a84c] text-xs font-semibold tracking-wide">Today Invest, Tomorrow Grow</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-[0.15em] mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map(l => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="group flex items-center gap-1.5 text-white/50 hover:text-[#c9a84c] text-sm transition-colors duration-200"
                  >
                    <span className="w-0 group-hover:w-3 overflow-hidden transition-all duration-200 text-[#c9a84c]">›</span>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-[0.15em] mb-6">Legal</h4>
            <ul className="space-y-3">
              {legalLinks.map(l => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="group flex items-center gap-1.5 text-white/50 hover:text-[#c9a84c] text-sm transition-colors duration-200"
                  >
                    <span className="w-0 group-hover:w-3 overflow-hidden transition-all duration-200 text-[#c9a84c]">›</span>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-[0.15em] mb-6">Get In Touch</h4>
            <ul className="space-y-4">
              <li>
                <a href="tel:+94770055313" className="flex items-start gap-3 text-white/50 hover:text-[#c9a84c] text-sm transition-colors group">
                  <span className="w-8 h-8 rounded-lg bg-white/05 border border-white/08 flex items-center justify-center flex-shrink-0 group-hover:border-[#c9a84c]/40 transition-colors">
                    <FiPhone className="w-3.5 h-3.5" />
                  </span>
                  <span className="pt-1.5">0770 055 313 / 0751 854 545</span>
                </a>
              </li>
              <li>
                <a href="mailto:growmorelanka@gmail.com" className="flex items-start gap-3 text-white/50 hover:text-[#c9a84c] text-sm transition-colors group">
                  <span className="w-8 h-8 rounded-lg bg-white/05 border border-white/08 flex items-center justify-center flex-shrink-0 group-hover:border-[#c9a84c]/40 transition-colors">
                    <FiMail className="w-3.5 h-3.5" />
                  </span>
                  <span className="pt-1.5">growmorelanka@gmail.com</span>
                </a>
              </li>
              <li>
                <a href={MAP_URL} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 text-white/50 hover:text-[#c9a84c] text-sm transition-colors group">
                  <span className="w-8 h-8 rounded-lg bg-white/05 border border-white/08 flex items-center justify-center flex-shrink-0 group-hover:border-[#c9a84c]/40 transition-colors">
                    <FiMapPin className="w-3.5 h-3.5" />
                  </span>
                  <span className="pt-1.5">Sri Lanka 🇱🇰</span>
                </a>
              </li>
            </ul>

            {/* Social icons */}
            <div className="flex gap-3 mt-6">
              <a href="https://www.instagram.com/grow_more_lanka_07" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg border border-white/10 bg-white/05 flex items-center justify-center text-white/50 hover:text-white hover:border-[#c9a84c]/50 hover:bg-[#c9a84c]/10 transition-all duration-200 hover:-translate-y-0.5">
                <FiInstagram className="w-4 h-4" />
              </a>
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg border border-white/10 bg-white/05 flex items-center justify-center text-white/50 hover:text-white hover:border-[#c9a84c]/50 hover:bg-[#c9a84c]/10 transition-all duration-200 hover:-translate-y-0.5">
                <FiFacebook className="w-4 h-4" />
              </a>
              <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg border border-white/10 bg-white/05 flex items-center justify-center text-white/50 hover:text-green-400 hover:border-green-500/40 hover:bg-green-500/08 transition-all duration-200 hover:-translate-y-0.5"
                title="WhatsApp">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.558 4.122 1.532 5.855L0 24l6.335-1.654A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.374l-.36-.214-3.727.973.994-3.634-.235-.374A9.818 9.818 0 112 12c0-5.413 4.405-9.818 9.818-9.818S21.818 6.587 21.818 12 17.413 21.818 12 21.818z"/></svg>
              </a>
            </div>
          </div>

        </div>

        {/* ── Divider ─────────────────────────────── */}
        <div className="mt-14 pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/30 text-sm">
              © {year} <span className="text-[#c9a84c]/70">Grow More Lanka</span> Investment Consultancy. All rights reserved.
            </p>
            <div className="flex items-center gap-1 text-white/25 text-sm">
              <span>Powered by</span>
              <span className="text-[#c9a84c]/60 font-semibold">GML Tech</span>
              <FiArrowUpRight className="w-3 h-3 text-[#c9a84c]/40" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

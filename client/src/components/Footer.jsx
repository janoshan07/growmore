import { Link } from 'react-router-dom';
import { FiMail, FiMapPin, FiPhone, FiInstagram, FiFacebook, FiLinkedin } from 'react-icons/fi';

const navLinks = [
  { to: '/',             label: 'Home' },
  { to: '/about',        label: 'About Us' },
  { to: '/plans',        label: 'Investment Plans' },
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/ventures',     label: 'Ventures Builders' },
  { to: '/contact',      label: 'Contact' },
];

const legalLinks = [
  { to: '/legal#terms',    label: 'Terms & Conditions' },
  { to: '/legal#risk',     label: 'Risk Disclosure' },
  { to: '/legal#refund',   label: 'Withdrawal Policy' },
  { to: '/legal#agreement',label: 'Investment Agreement' },
  { to: '/legal#privacy',  label: 'Privacy Policy' },
];

const WHATSAPP = 'https://wa.me/94770055313';
const MAP_URL  = 'https://www.google.com/maps/search/?api=1&query=Sri+Lanka';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto px-4 pb-5 pt-3" style={{ background: '#04020e' }}>
      {/* ── Card container (Voxr style) ──────────────────── */}
      <div
        className="max-w-7xl mx-auto rounded-2xl px-8 py-10"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        {/* ── Top grid ─────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-10"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>

          {/* Brand column */}
          <div className="md:col-span-1 flex flex-col gap-5">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group w-fit select-none">
              <div className="relative w-9 h-9 flex-shrink-0">
                <svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <circle cx="22" cy="22" r="21" fill="#0f1c3f" stroke="#00b4ff" strokeWidth="1.5"/>
                  <text x="9" y="28" fontFamily="Georgia,serif" fontWeight="700" fontSize="18" fill="#00b4ff">G</text>
                  <rect x="26" y="23" width="3.5" height="7"  rx="0.8" fill="#00b4ff"/>
                  <rect x="30.5" y="19" width="3.5" height="11" rx="0.8" fill="#00b4ff"/>
                  <rect x="35"   y="15" width="3.5" height="15" rx="0.8" fill="#00b4ff"/>
                </svg>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-[14px] font-black text-white tracking-widest uppercase" style={{ letterSpacing: '0.1em' }}>GROW MORE</span>
                <span className="text-[9px] font-bold uppercase" style={{ letterSpacing: '0.3em', color: '#00b4ff' }}>LANKA</span>
              </div>
            </Link>

            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.38)' }}>
              Sri Lanka's trusted investment consultancy. Delivering transparent, high-return plans with signed agreements.
            </p>

            {/* Social icons */}
            <div className="flex gap-2.5">
              {[
                { href: 'https://www.linkedin.com', Icon: FiLinkedin, label: 'LinkedIn' },
                { href: 'https://www.facebook.com', Icon: FiFacebook, label: 'Facebook' },
                { href: 'https://www.instagram.com/grow_more_lanka_07', Icon: FiInstagram, label: 'Instagram' },
                { href: WHATSAPP, Icon: null, label: 'WhatsApp' },
              ].map(({ href, Icon, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5 hover:border-white/30"
                  style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  {Icon
                    ? <Icon className="w-4 h-4 text-white/60" />
                    : (
                      <svg className="w-4 h-4 text-white/60" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.558 4.122 1.532 5.855L0 24l6.335-1.654A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.374l-.36-.214-3.727.973.994-3.634-.235-.374A9.818 9.818 0 112 12c0-5.413 4.405-9.818 9.818-9.818S21.818 6.587 21.818 12 17.413 21.818 12 21.818z"/>
                      </svg>
                    )
                  }
                </a>
              ))}
            </div>
          </div>

          {/* Legal column */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-5">Legal</h4>
            <ul className="space-y-3">
              {legalLinks.map(l => (
                <li key={l.to}>
                  <Link to={l.to}
                    className="text-sm transition-colors duration-200 hover:text-white"
                    style={{ color: 'rgba(255,255,255,0.50)' }}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation column */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-5">Navigation</h4>
            <ul className="space-y-3">
              {navLinks.map(l => (
                <li key={l.to}>
                  <Link to={l.to}
                    className="text-sm transition-colors duration-200 hover:text-white"
                    style={{ color: 'rgba(255,255,255,0.50)' }}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact column */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-5">Contact Information</h4>
            <div className="flex flex-col gap-4">
              <a href="tel:+94770055313"
                className="flex items-start gap-2.5 text-sm transition-colors hover:text-white group"
                style={{ color: 'rgba(255,255,255,0.50)' }}>
                <FiPhone className="w-4 h-4 mt-0.5 flex-shrink-0 text-white/30 group-hover:text-[#00b4ff] transition-colors" />
                <span>0770 055 313 / 0751 854 545</span>
              </a>
              <a href="mailto:growmorelanka@gmail.com"
                className="flex items-start gap-2.5 text-sm transition-colors hover:text-white group"
                style={{ color: 'rgba(255,255,255,0.50)' }}>
                <FiMail className="w-4 h-4 mt-0.5 flex-shrink-0 text-white/30 group-hover:text-[#00b4ff] transition-colors" />
                <span>growmorelanka@gmail.com</span>
              </a>
              <a href={MAP_URL} target="_blank" rel="noopener noreferrer"
                className="flex items-start gap-2.5 text-sm transition-colors hover:text-white group"
                style={{ color: 'rgba(255,255,255,0.50)' }}>
                <FiMapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-white/30 group-hover:text-[#00b4ff] transition-colors" />
                <span>Sri Lanka 🇱🇰</span>
              </a>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ──────────────────────────────────── */}
        <div className="pt-7 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.28)' }}>
            © {year} Grow More Lanka Investment Consultancy. All rights reserved
          </p>
          <div className="flex items-center gap-1.5 text-sm" style={{ color: 'rgba(255,255,255,0.25)' }}>
            <span>Powered by</span>
            <span className="font-bold tracking-wider" style={{ color: '#00b4ff', opacity: 0.7 }}>GML TECH</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

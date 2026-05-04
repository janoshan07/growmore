import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { FiMenu, FiX, FiChevronDown, FiLogOut, FiUser } from 'react-icons/fi';

const publicLinks = [
  { to: '/',             label: 'Home' },
  { to: '/about',        label: 'About' },
  { to: '/plans',        label: 'Investment Plans' },
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/ventures',     label: 'Ventures Builders' },
  { to: '/contact',      label: 'Contact' },
];

const privateLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/market',    label: 'Market' },
  { to: '/portfolio', label: 'Portfolio' },
];

export default function Header() {
  const { user, logout } = useAuth();
  const location  = useLocation();
  const navigate  = useNavigate();
  const [mobileOpen,    setMobileOpen]    = useState(false);
  const [dropdownOpen,  setDropdownOpen]  = useState(false);
  const [scrolled,      setScrolled]      = useState(false);

  // shrink / darken on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // close mobile menu on route change
  useEffect(() => { setMobileOpen(false); setDropdownOpen(false); }, [location.pathname]);

  const handleLogout = () => { logout(); navigate('/'); };
  const navLinks = user ? privateLinks : publicLinks;

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-400 ${
          scrolled
            ? 'bg-[#07071a]/95 backdrop-blur-xl shadow-2xl shadow-black/40'
            : 'bg-[#07071a]/80 backdrop-blur-md'
        }`}
        style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-[72px] gap-6">

            {/* ── Logo ─────────────────────────────── */}
            <Link to={user ? '/dashboard' : '/'} className="flex items-center gap-3 group select-none flex-shrink-0">
              <div className="relative w-10 h-10">
                <svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full drop-shadow-lg group-hover:scale-105 transition-transform duration-300">
                  <circle cx="22" cy="22" r="21" fill="#0f1c3f" stroke="#c9a84c" strokeWidth="1.5"/>
                  <text x="9" y="28" fontFamily="Georgia,serif" fontWeight="700" fontSize="18" fill="#c9a84c">G</text>
                  <rect x="26" y="23" width="3.5" height="7"  rx="0.8" fill="#c9a84c"/>
                  <rect x="30.5" y="19" width="3.5" height="11" rx="0.8" fill="#c9a84c"/>
                  <rect x="35"   y="15" width="3.5" height="15" rx="0.8" fill="#c9a84c"/>
                </svg>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-[15px] font-black text-white tracking-widest uppercase" style={{ letterSpacing: '0.12em' }}>GROW MORE</span>
                <span className="text-[9px] font-bold text-[#c9a84c] uppercase" style={{ letterSpacing: '0.35em' }}>LANKA</span>
              </div>
            </Link>

            {/* ── Desktop Nav ──────────────────────── */}
            <nav className="hidden lg:flex items-center gap-1 mx-auto">
              {navLinks.map(({ to, label }) => {
                const isActive = location.pathname === to;
                return (
                  <Link
                    key={to}
                    to={to}
                    className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap group
                      ${isActive
                        ? 'text-[#c9a84c]'
                        : 'text-white/65 hover:text-white'
                      }`}
                  >
                    {/* active pill background */}
                    {isActive && (
                      <motion.span
                        layoutId="activePill"
                        className="absolute inset-0 rounded-lg"
                        style={{ background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.25)' }}
                        transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                      />
                    )}
                    {/* hover bg */}
                    <span className="absolute inset-0 rounded-lg bg-white/0 group-hover:bg-white/05 transition-colors duration-200" />
                    <span className="relative z-10">{label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* ── Right side ───────────────────────── */}
            <div className="hidden lg:flex items-center gap-3 ml-auto flex-shrink-0">
              {!user ? (
                <>
                  <Link to="/login"
                    className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors">
                    Client Login
                  </Link>
                  <Link to="/register"
                    className="px-5 py-2 rounded-xl text-sm font-bold text-[#07071a] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#c9a84c]/30"
                    style={{ background: 'linear-gradient(135deg, #c9a84c, #e8c96b)' }}>
                    Get Started
                  </Link>
                </>
              ) : (
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(o => !o)}
                    className="flex items-center gap-2.5 px-4 py-2 rounded-xl text-sm font-medium text-white border border-white/10 bg-white/05 hover:bg-white/10 hover:border-white/20 transition-all"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#c9a84c]/20 border border-[#c9a84c]/40 flex items-center justify-center">
                      <FiUser className="w-3 h-3 text-[#c9a84c]" />
                    </div>
                    <span>{user.name}</span>
                    <FiChevronDown className={`w-3.5 h-3.5 text-white/50 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {dropdownOpen && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.96 }}
                          transition={{ duration: 0.18 }}
                          className="absolute right-0 mt-2 w-52 rounded-2xl overflow-hidden z-50 shadow-2xl shadow-black/60"
                          style={{ background: '#0f1320', border: '1px solid rgba(255,255,255,0.1)' }}
                        >
                          <div className="px-4 py-3.5 border-b border-white/08">
                            <p className="text-xs text-white/40 uppercase tracking-wider mb-0.5">Balance</p>
                            <p className="font-bold text-[#c9a84c]">
                              ${user.balance?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </p>
                          </div>
                          <div className="p-2">
                            <button
                              onClick={handleLogout}
                              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                            >
                              <FiLogOut className="w-4 h-4" /> Logout
                            </button>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* ── Mobile hamburger ─────────────────── */}
            <button
              className="lg:hidden ml-auto p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/08 transition-all"
              onClick={() => setMobileOpen(o => !o)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* ── Mobile Menu ────────────────────────── */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="lg:hidden overflow-hidden"
              style={{ borderTop: '1px solid rgba(255,255,255,0.07)', background: '#0a0a1f' }}
            >
              <div className="px-4 py-5 flex flex-col gap-1">
                {navLinks.map(({ to, label }) => {
                  const isActive = location.pathname === to;
                  return (
                    <Link key={to} to={to}
                      className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                        isActive ? 'text-[#c9a84c] bg-[#c9a84c]/10' : 'text-white/70 hover:text-white hover:bg-white/05'
                      }`}>
                      {label}
                    </Link>
                  );
                })}

                <div className="pt-3 mt-2 border-t border-white/08 flex flex-col gap-2">
                  {!user ? (
                    <>
                      <Link to="/login" className="px-4 py-2.5 text-sm font-medium text-white/70 hover:text-white transition-colors">Client Login</Link>
                      <Link to="/register"
                        className="px-4 py-2.5 rounded-xl text-sm font-bold text-center text-[#07071a]"
                        style={{ background: 'linear-gradient(135deg,#c9a84c,#e8c96b)' }}>
                        Get Started
                      </Link>
                    </>
                  ) : (
                    <button onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-colors">
                      <FiLogOut className="w-4 h-4" /> Logout
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}

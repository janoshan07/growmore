import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { FiMenu, FiX, FiChevronDown } from 'react-icons/fi';

// Mega menu data
const megaMenus = {
  'who-we-are': {
    title: 'Who We Are',
    link: '/who-we-are',
    sublinks: [
      { to: '/who-we-are/culture', label: 'Our Culture' },
      { to: '/who-we-are/leadership', label: 'Leadership Team' },
      { to: '/who-we-are/civic', label: 'Civic Leadership' },
      { to: '/who-we-are/locations', label: 'Office Locations' },
    ]
  },
  'what-we-do': {
    title: 'What We Do',
    link: '/what-we-do',
    sublinks: [
      { to: '/what-we-do/commodities', label: 'Commodities' },
      { to: '/what-we-do/credit', label: 'Credit and Convertibles' },
      { to: '/what-we-do/equities', label: 'Equities' },
      { to: '/what-we-do/fixed-income', label: 'Fixed Income and Macro' },
      { to: '/what-we-do/quant', label: 'Global Quantitative Strategies' },
    ]
  }
};

export default function Header() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [hoveredMenu, setHoveredMenu] = useState(null);

  const handleLogout = () => {
    logout();
    navigate('/');
    setProfileDropdownOpen(false);
  };

  // Public links replicating the Citadel style exactly
  const publicLinks = [
    { to: '/who-we-are', label: 'Who We Are' },
    { to: '/what-we-do', label: 'What We Do' },
    { to: '/news', label: 'News' },
    { to: '/careers', label: 'Careers' },
  ];

  // Private links for the trading app
  const privateLinks = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/market', label: 'Market' },
    { to: '/portfolio', label: 'Portfolio' },
  ];

  const navLinks = user ? privateLinks : publicLinks;

  return (
    <header 
      className="sticky top-0 z-50 bg-white border-b border-gray-200 transition-all duration-300 relative"
      onMouseLeave={() => setHoveredMenu(null)}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-20">
          
          {/* Logo — Grow More Lanka */}
          <Link to={user ? '/dashboard' : '/'} className="flex items-center gap-3 group mr-auto select-none">
            {/* Circular emblem */}
            <div className="relative w-11 h-11 flex-shrink-0">
              <svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md group-hover:drop-shadow-lg transition-all duration-300">
                {/* Outer circle */}
                <circle cx="22" cy="22" r="21" fill="#0f1c3f" stroke="#c9a84c" strokeWidth="1.5"/>
                {/* G letter */}
                <text x="9" y="28" fontFamily="Georgia, serif" fontWeight="700" fontSize="18" fill="#c9a84c" letterSpacing="-0.5">G</text>
                {/* Bar chart bars */}
                <rect x="26" y="23" width="3.5" height="7" rx="0.8" fill="#c9a84c"/>
                <rect x="30.5" y="19" width="3.5" height="11" rx="0.8" fill="#c9a84c"/>
                <rect x="35" y="15" width="3.5" height="15" rx="0.8" fill="#c9a84c"/>
              </svg>
            </div>

            {/* Brand text */}
            <div className="flex flex-col leading-none">
              <span
                className="text-[18px] font-black text-[#0f1c3f] tracking-widest uppercase group-hover:text-primary-700 transition-colors duration-200"
                style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '0.12em' }}
              >
                GROW MORE
              </span>
              <span
                className="text-[11px] font-bold tracking-[0.3em] text-[#c9a84c] uppercase mt-0.5"
                style={{ letterSpacing: '0.32em' }}
              >
                LANKA
              </span>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 mx-auto absolute left-1/2 -translate-x-1/2 h-full">
            {navLinks.map(({ to, label }) => {
              const menuId = label.toLowerCase().replace(/ /g, '-');
              return (
                <div
                  key={to}
                  className="h-full flex items-center border-b-2 border-transparent hover:border-primary-900 transition-colors cursor-pointer"
                  onMouseEnter={() => setHoveredMenu(['who-we-are', 'what-we-do'].includes(menuId) ? menuId : null)}
                >
                  <Link
                    to={to}
                    onClick={() => setHoveredMenu(null)}
                    className={`text-sm font-medium transition-colors duration-200
                      ${location.pathname === to
                        ? 'text-primary-900 font-bold'
                        : 'text-primary-900 hover:text-primary-600'
                      }`}
                  >
                    {label}
                  </Link>
                </div>
              );
            })}
          </nav>

          {/* Right Section: Client Login or Profile */}
          <div className="hidden md:flex items-center ml-auto h-full">
            {!user ? (
              <Link to="/login" className="text-sm font-medium text-primary-900 hover:text-primary-600 transition-colors">
                Client Login
              </Link>
            ) : (
              <div className="relative h-full flex items-center">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 text-sm font-medium text-primary-900 hover:text-primary-600 transition-colors focus:outline-none"
                >
                  {user.name}
                  <FiChevronDown className={`w-4 h-4 transition-transform ${profileDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Profile Dropdown */}
                <AnimatePresence>
                  {profileDropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setProfileDropdownOpen(false)}></div>
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 top-[70%] mt-4 w-48 bg-white border border-gray-200 shadow-lg z-50 py-2"
                      >
                        <div className="px-4 py-2 border-b border-gray-100 mb-1">
                          <p className="text-xs text-gray-500 uppercase tracking-wider">Balance</p>
                          <p className="text-sm font-semibold text-primary-900">
                            ${user.balance?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </p>
                        </div>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 transition-colors"
                        >
                          Logout
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden ml-auto text-primary-900 hover:text-primary-600 p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mega Menu Dropdown */}
      <AnimatePresence>
        {hoveredMenu && megaMenus[hoveredMenu] && !user && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 w-full bg-[#f8f9fa] shadow-xl z-40 border-t border-gray-200"
          >
            <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 py-14 relative">
              <button 
                onClick={() => setHoveredMenu(null)}
                className="absolute top-8 right-0 text-[#1a4b8b] hover:text-primary-600 p-2"
              >
                <FiX className="w-6 h-6 stroke-[3]" />
              </button>
              
              <div className="grid grid-cols-2 gap-16 items-start">
                {/* Left Side */}
                <div className="flex flex-col gap-6 pl-10">
                  <h2 className="text-[42px] text-[#1a4b8b]" style={{ fontFamily: 'Times New Roman, serif' }}>
                    {megaMenus[hoveredMenu].title}
                  </h2>
                  <Link 
                    to={megaMenus[hoveredMenu].link} 
                    onClick={() => setHoveredMenu(null)}
                    className="bg-[#1a4b8b] hover:bg-[#153a6b] text-white px-7 py-3 w-fit text-sm font-medium transition-colors"
                  >
                    Learn More
                  </Link>
                </div>
                
                {/* Right Side */}
                <div className="flex flex-col gap-5 pt-3">
                  {megaMenus[hoveredMenu].sublinks.map(link => (
                    <Link 
                      key={link.label} 
                      to={link.to} 
                      onClick={() => setHoveredMenu(null)}
                      className="text-[15px] font-medium text-[#1a4b8b] hover:text-primary-600 transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-200 overflow-hidden absolute top-full left-0 w-full"
          >
            <div className="px-6 py-4 flex flex-col gap-4 shadow-md">
              {navLinks.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className="text-base font-medium text-primary-900"
                >
                  {label}
                </Link>
              ))}
              
              <div className="pt-4 border-t border-gray-100 mt-2">
                {!user ? (
                  <Link 
                    to="/login" 
                    onClick={() => setMobileOpen(false)} 
                    className="text-base font-medium text-primary-900"
                  >
                    Client Login
                  </Link>
                ) : (
                  <button
                    onClick={() => { handleLogout(); setMobileOpen(false); }}
                    className="text-base font-medium text-red-600 text-left w-full"
                  >
                    Logout
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

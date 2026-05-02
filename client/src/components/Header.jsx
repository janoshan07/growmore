import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { FiMenu, FiX, FiChevronDown } from 'react-icons/fi';

export default function Header() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

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
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 transition-all duration-300">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-20">
          
          {/* Logo (Citadel Style) */}
          <Link to={user ? '/dashboard' : '/'} className="flex items-center gap-4 group mr-auto">
            <div className="flex flex-col items-center justify-center gap-0.5 w-10">
              {/* Geometric blocks imitating Citadel logo */}
              <div className="flex gap-1">
                <div className="w-2.5 h-2.5 bg-primary-900"></div>
                <div className="w-2.5 h-2.5 bg-primary-900"></div>
                <div className="w-2.5 h-2.5 bg-primary-900"></div>
              </div>
              <div className="w-full h-1.5 bg-primary-900 mt-0.5"></div>
              <div className="w-full h-1.5 bg-primary-900 mt-0.5"></div>
            </div>
            <span className="text-[26px] tracking-wide text-primary-900" style={{ fontFamily: 'Times New Roman, serif' }}>
              GROW MORE
            </span>
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 mx-auto absolute left-1/2 -translate-x-1/2">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`text-sm font-medium transition-colors duration-200
                  ${location.pathname === to
                    ? 'text-primary-900 font-bold'
                    : 'text-primary-900 hover:text-primary-600'
                  }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Right Section: Client Login or Profile */}
          <div className="hidden md:flex items-center ml-auto">
            {!user ? (
              <Link to="/login" className="text-sm font-medium text-primary-900 hover:text-primary-600 transition-colors">
                Client Login
              </Link>
            ) : (
              <div className="relative">
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
                        className="absolute right-0 mt-4 w-48 bg-white border border-gray-200 shadow-lg z-50 py-2"
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

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-200 overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
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

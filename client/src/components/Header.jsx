import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  FiBarChart2, FiPieChart, FiTrendingUp, FiLogOut,
  FiMenu, FiX, FiShield, FiUser, FiHome, FiChevronDown
} from 'react-icons/fi';

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

  // Define navigation links based on auth state
  const navLinks = user
    ? [
        { to: '/dashboard', label: 'Dashboard', icon: FiBarChart2 },
        { to: '/market', label: 'Market', icon: FiTrendingUp },
        { to: '/portfolio', label: 'Portfolio', icon: FiPieChart },
      ]
    : [
        { to: '/', label: 'Home', icon: FiHome },
      ];

  return (
    <header className="sticky top-0 z-50 bg-dark-100/80 backdrop-blur-md border-b border-gray-700/50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to={user ? '/dashboard' : '/'} className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105">
              <FiTrendingUp className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-xl text-white tracking-tight">
              Grow<span className="text-primary-400">More</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-2">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${location.pathname === to
                    ? 'bg-primary-500/10 text-primary-400'
                    : 'text-gray-400 hover:text-gray-100 hover:bg-white/5'
                  }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
            
            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${location.pathname === '/admin'
                    ? 'bg-purple-500/10 text-purple-400'
                    : 'text-gray-400 hover:text-gray-100 hover:bg-white/5'
                  }`}
              >
                <FiShield className="w-4 h-4" />
                Admin
              </Link>
            )}
          </nav>

          {/* Right Section: Auth Buttons or User Profile */}
          <div className="hidden md:flex items-center gap-4">
            {!user ? (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors px-3 py-2">
                  Login
                </Link>
                <Link to="/register" className="btn-primary py-2 px-4 text-sm shadow-lg shadow-primary-500/20">
                  Get Started
                </Link>
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-3 p-1.5 pr-3 rounded-xl border border-gray-700/50 hover:bg-white/5 transition-colors focus:outline-none"
                >
                  <div className="w-8 h-8 bg-primary-500/20 rounded-lg flex items-center justify-center">
                    <FiUser className="text-primary-400 w-4 h-4" />
                  </div>
                  <div className="text-left hidden lg:block">
                    <p className="text-sm font-semibold text-white leading-tight">{user.name}</p>
                    <p className="text-xs text-primary-400 font-mono">
                      ${user.balance?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <FiChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${profileDropdownOpen ? 'rotate-180' : ''}`} />
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
                        className="absolute right-0 mt-2 w-48 bg-dark-100 border border-gray-700/50 rounded-xl shadow-xl z-50 overflow-hidden"
                      >
                        <div className="px-4 py-3 border-b border-gray-700/50 lg:hidden">
                          <p className="text-sm font-medium text-white">{user.name}</p>
                          <p className="text-xs text-primary-400 font-mono mt-0.5">
                            ${user.balance?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </p>
                        </div>
                        <div className="py-1">
                          <Link to="/dashboard" onClick={() => setProfileDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors">
                            <FiBarChart2 className="w-4 h-4" /> Dashboard
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
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

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors"
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
            className="md:hidden bg-dark-200 border-t border-gray-700/50 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors
                    ${location.pathname === to 
                      ? 'bg-primary-500/10 text-primary-400' 
                      : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}
                >
                  <Icon className="w-5 h-5" /> {label}
                </Link>
              ))}
              
              {!user ? (
                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-700/50">
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-secondary text-center py-2.5">
                    Login
                  </Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)} className="btn-primary text-center py-2.5">
                    Get Started
                  </Link>
                </div>
              ) : (
                <div className="pt-4 mt-2 border-t border-gray-700/50">
                  <button
                    onClick={() => { handleLogout(); setMobileOpen(false); }}
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl text-sm font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 transition-colors"
                  >
                    <FiLogOut className="w-5 h-5" /> Logout
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

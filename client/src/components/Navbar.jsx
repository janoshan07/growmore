import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  FiBarChart2, FiPieChart, FiTrendingUp, FiLogOut,
  FiMenu, FiX, FiShield, FiUser, FiDollarSign,
} from 'react-icons/fi';

const navLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: FiBarChart2 },
  { to: '/market',    label: 'Market',    icon: FiTrendingUp },
  { to: '/portfolio', label: 'Portfolio', icon: FiPieChart },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'rgba(4,15,28,0.92)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(0,229,255,0.1)',
      boxShadow: '0 1px 20px rgba(0,0,0,0.4)',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 62 }}>

          {/* ── Logo ── */}
          <Link to="/dashboard" style={{
            display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none',
          }}>
            <svg viewBox="0 0 44 44" fill="none" width="32" height="32">
              <circle cx="22" cy="22" r="21" fill="#0f1c3f" stroke="#00b4ff" strokeWidth="1.5"/>
              <text x="9" y="28" fontFamily="Georgia,serif" fontWeight="700" fontSize="18" fill="#00b4ff">G</text>
              <rect x="26" y="23" width="3.5" height="7"  rx="0.8" fill="#00b4ff"/>
              <rect x="30.5" y="19" width="3.5" height="11" rx="0.8" fill="#00b4ff"/>
              <rect x="35"   y="15" width="3.5" height="15" rx="0.8" fill="#00b4ff"/>
            </svg>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
              <span style={{ fontSize: 13, fontWeight: 900, color: '#e0f7fa', letterSpacing: '0.1em' }}>GROW MORE</span>
              <span style={{ fontSize: 8, fontWeight: 700, color: '#00b4ff', letterSpacing: '0.3em' }}>LANKA</span>
            </div>
          </Link>

          {/* ── Desktop nav links ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="hidden-mobile">
            {navLinks.map(({ to, label, icon: Icon }) => {
              const active = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 7,
                    padding: '7px 14px', borderRadius: 10, textDecoration: 'none',
                    fontSize: 13, fontWeight: 600, transition: 'all 0.2s',
                    background: active ? 'rgba(0,229,255,0.12)' : 'transparent',
                    border: `1px solid ${active ? 'rgba(0,229,255,0.3)' : 'transparent'}`,
                    color: active ? '#00e5ff' : '#7ecfda',
                  }}
                  onMouseEnter={(e) => { if (!active) { e.currentTarget.style.background = 'rgba(0,229,255,0.06)'; e.currentTarget.style.color = '#e0f7fa'; }}}
                  onMouseLeave={(e) => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#7ecfda'; }}}
                >
                  <Icon style={{ width: 15, height: 15 }} />
                  {label}
                </Link>
              );
            })}
            {user?.role === 'admin' && (
              <Link
                to="/admin"
                style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  padding: '7px 14px', borderRadius: 10, textDecoration: 'none',
                  fontSize: 13, fontWeight: 600, transition: 'all 0.2s',
                  background: location.pathname === '/admin' ? 'rgba(139,92,246,0.15)' : 'transparent',
                  border: `1px solid ${location.pathname === '/admin' ? 'rgba(139,92,246,0.35)' : 'transparent'}`,
                  color: location.pathname === '/admin' ? '#a78bfa' : '#7ecfda',
                }}
              >
                <FiShield style={{ width: 15, height: 15 }} />
                Admin
              </Link>
            )}
          </div>

          {/* ── User info + logout (desktop) ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }} className="hidden-mobile">
            {/* Balance */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '6px 12px', borderRadius: 10,
              background: 'rgba(0,229,255,0.06)',
              border: '1px solid rgba(0,229,255,0.15)',
            }}>
              <FiDollarSign style={{ color: '#00e5ff', width: 13, height: 13 }} />
              <span style={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 700, color: '#00e5ff' }}>
                {user?.balance?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>

            {/* Avatar + name */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: 'rgba(0,229,255,0.12)',
                border: '1px solid rgba(0,229,255,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <FiUser style={{ color: '#00e5ff', width: 14, height: 14 }} />
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#e0f7fa' }}>{user?.name}</span>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              title="Logout"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 34, height: 34, borderRadius: 10, cursor: 'pointer',
                background: 'transparent', border: '1px solid rgba(248,113,113,0.2)',
                color: '#f87171', transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(248,113,113,0.1)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            >
              <FiLogOut style={{ width: 14, height: 14 }} />
            </button>
          </div>

          {/* ── Mobile hamburger ── */}
          <button
            className="show-mobile"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              background: 'transparent', border: '1px solid rgba(0,229,255,0.2)',
              borderRadius: 8, padding: 7, cursor: 'pointer',
              color: '#7ecfda', display: 'none',
            }}
          >
            {mobileOpen ? <FiX style={{ width: 18, height: 18 }} /> : <FiMenu style={{ width: 18, height: 18 }} />}
          </button>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              overflow: 'hidden',
              borderTop: '1px solid rgba(0,229,255,0.1)',
              background: 'rgba(4,15,28,0.98)',
            }}
          >
            <div style={{ padding: '12px 20px 16px', display: 'flex', flexDirection: 'column', gap: 4 }}>
              {navLinks.map(({ to, label, icon: Icon }) => {
                const active = location.pathname === to;
                return (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setMobileOpen(false)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '10px 14px', borderRadius: 10, textDecoration: 'none',
                      fontSize: 13, fontWeight: 600,
                      background: active ? 'rgba(0,229,255,0.1)' : 'transparent',
                      color: active ? '#00e5ff' : '#7ecfda',
                    }}
                  >
                    <Icon style={{ width: 15, height: 15 }} />
                    {label}
                  </Link>
                );
              })}
              <button
                onClick={handleLogout}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 14px', borderRadius: 10, cursor: 'pointer',
                  background: 'rgba(248,113,113,0.08)', border: 'none',
                  color: '#f87171', fontSize: 13, fontWeight: 600,
                  marginTop: 4,
                }}
              >
                <FiLogOut style={{ width: 15, height: 15 }} /> Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Responsive helpers */}
      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile   { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}

import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  FiSearch, FiBell, FiChevronDown, FiLogOut, FiChevronRight,
} from 'react-icons/fi';

// ── Page meta ────────────────────────────────────────────────────────────────
const PAGE_META = {
  '/dashboard': { name: 'Overview',   welcome: true },
  '/market':    { name: 'Market',     welcome: false },
  '/portfolio': { name: 'Portfolio',  welcome: false },
  '/admin':     { name: 'Admin',      welcome: false },
};

// ── Avatar ────────────────────────────────────────────────────────────────────
function UserAvatar({ name, size = 30 }) {
  const initials = name ? name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() : '?';
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: 'linear-gradient(135deg,#006064,#00bcd4)',
      border: '2px solid rgba(0,229,255,0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.36, fontWeight: 800, color: '#e0f7fa',
      flexShrink: 0, boxShadow: '0 0 10px rgba(0,229,255,0.2)',
    }}>
      {initials}
    </div>
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [search, setSearch] = useState('');

  const handleLogout = () => { logout(); navigate('/'); };

  const meta = PAGE_META[location.pathname] || { name: 'Overview', welcome: false };

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'rgba(4,15,28,0.95)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(0,229,255,0.1)',
      boxShadow: '0 1px 20px rgba(0,0,0,0.4)',
    }}>
      <div style={{ padding: '0 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68 }}>

        {/* ── LEFT: Breadcrumb + Welcome ── */}
        <div>
          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
            <span style={{ fontSize: 12, color: '#7ecfda', fontWeight: 500 }}>Grow More Lanka</span>
            <FiChevronRight style={{ color: '#7ecfda', width: 12, height: 12, opacity: 0.6 }}/>
            <span style={{ fontSize: 12, color: '#b0cdd6', fontWeight: 600 }}>{meta.name}</span>
          </div>
          {/* Title */}
          {meta.welcome ? (
            <h1 style={{ fontSize: 18, fontWeight: 800, color: '#e0f7fa', margin: 0, lineHeight: 1 }}>
              Welcome back, <span style={{ color: '#00e5ff' }}>{user?.name?.split(' ')[0]}</span>
            </h1>
          ) : (
            <h1 style={{ fontSize: 18, fontWeight: 800, color: '#e0f7fa', margin: 0, lineHeight: 1 }}>
              {meta.name}
            </h1>
          )}
        </div>

        {/* ── RIGHT: Search + Bell + Profile ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>

          {/* Search */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'rgba(0,229,255,0.05)',
            border: '1px solid rgba(0,229,255,0.15)',
            borderRadius: 10, padding: '7px 14px',
          }}>
            <FiSearch style={{ color: '#7ecfda', width: 13, height: 13, flexShrink: 0 }}/>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search here..."
              style={{
                background: 'none', border: 'none', outline: 'none',
                color: '#e0f7fa', fontSize: 12, width: 150,
              }}
            />
          </div>

          {/* Bell */}
          <div style={{ position: 'relative' }}>
            <button style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'rgba(0,229,255,0.06)',
              border: '1px solid rgba(0,229,255,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#7ecfda',
            }}>
              <FiBell style={{ width: 16, height: 16 }}/>
            </button>
            <span style={{
              position: 'absolute', top: 6, right: 6, width: 7, height: 7,
              borderRadius: '50%', background: '#0ecb81',
              border: '1.5px solid rgba(4,15,28,0.9)',
            }}/>
          </div>

          {/* Profile dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setDropdownOpen(o => !o)}
              style={{
                display: 'flex', alignItems: 'center', gap: 9,
                padding: '5px 12px 5px 6px', borderRadius: 40,
                background: 'rgba(0,229,255,0.06)',
                border: '1px solid rgba(0,229,255,0.2)',
                cursor: 'pointer', transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,229,255,0.1)'; }}
              onMouseLeave={e => { if (!dropdownOpen) e.currentTarget.style.background = 'rgba(0,229,255,0.06)'; }}
            >
              <UserAvatar name={user?.name} size={30}/>
              <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#e0f7fa', margin: 0 }}>{user?.name}</p>
                <p style={{ fontSize: 10, color: '#7ecfda', margin: 0, fontFamily: 'monospace' }}>
                  ${user?.balance?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <FiChevronDown style={{
                color: '#7ecfda', width: 12, height: 12,
                transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s',
              }}/>
            </button>

            {/* Dropdown */}
            <AnimatePresence>
              {dropdownOpen && (
                <>
                  <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setDropdownOpen(false)}/>
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.16 }}
                    style={{
                      position: 'absolute', right: 0, top: 'calc(100% + 10px)',
                      width: 220, borderRadius: 16, overflow: 'hidden', zIndex: 50,
                      background: 'linear-gradient(160deg,#071a2e,#0a2240)',
                      border: '1px solid rgba(0,229,255,0.2)',
                      boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
                    }}
                  >
                    {/* Profile header */}
                    <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid rgba(0,229,255,0.1)', display: 'flex', alignItems: 'center', gap: 10 }}>
                      <UserAvatar name={user?.name} size={40}/>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 700, color: '#e0f7fa', margin: 0 }}>{user?.name}</p>
                        <p style={{ fontSize: 10, color: '#7ecfda', margin: '2px 0 0', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{user?.role || 'Investor'}</p>
                      </div>
                    </div>
                    {/* Balance */}
                    <div style={{ padding: '10px 16px', borderBottom: '1px solid rgba(0,229,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 11, color: '#7ecfda', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Balance</span>
                      <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#00e5ff', fontSize: 13 }}>
                        ${user?.balance?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    {/* Logout */}
                    <div style={{ padding: '8px' }}>
                      <button onClick={handleLogout}
                        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 10, cursor: 'pointer', background: 'transparent', border: 'none', color: '#f87171', fontSize: 13, fontWeight: 600, transition: 'background 0.2s' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(248,113,113,0.1)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
                        <FiLogOut style={{ width: 14, height: 14 }}/> Logout
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </nav>
  );
}

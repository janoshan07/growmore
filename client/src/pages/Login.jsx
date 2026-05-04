import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';

export default function Login() {
  const { login } = useAuth();
  const navigate   = useNavigate();
  const [form,     setForm]     = useState({ email: '', password: '' });
  const [showPwd,  setShowPwd]  = useState(false);
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: 'white',
    borderRadius: '12px',
    padding: '13px 16px 13px 44px',
    width: '100%',
    outline: 'none',
    fontSize: '14px',
    transition: 'all 0.2s',
  };

  const onFocus = e => {
    e.target.style.border = '1px solid rgba(0,180,255,0.5)';
    e.target.style.boxShadow = '0 0 20px rgba(0,180,255,0.1)';
  };
  const onBlur = e => {
    e.target.style.border = '1px solid rgba(255,255,255,0.1)';
    e.target.style.boxShadow = 'none';
  };

  return (
    <div className="flex-grow w-full flex items-center justify-center px-4 py-16 relative overflow-hidden"
      style={{ background: '#04020e' }}>

      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 20%, rgba(110,30,220,0.18) 0%, transparent 70%)' }} />
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)', backgroundSize: '60px 60px' }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md z-10"
      >
        {/* Logo + heading */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 group mb-6 select-none">
            <div className="relative w-10 h-10">
              <svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full drop-shadow-lg group-hover:scale-105 transition-transform duration-300">
                <circle cx="22" cy="22" r="21" fill="#0f1c3f" stroke="#00b4ff" strokeWidth="1.5"/>
                <text x="9" y="28" fontFamily="Georgia,serif" fontWeight="700" fontSize="18" fill="#00b4ff">G</text>
                <rect x="26" y="23" width="3.5" height="7"  rx="0.8" fill="#00b4ff"/>
                <rect x="30.5" y="19" width="3.5" height="11" rx="0.8" fill="#00b4ff"/>
                <rect x="35"   y="15" width="3.5" height="15" rx="0.8" fill="#00b4ff"/>
              </svg>
            </div>
            <div className="flex flex-col leading-none text-left">
              <span className="text-[14px] font-black text-white tracking-widest uppercase" style={{ letterSpacing: '0.1em' }}>GROW MORE</span>
              <span className="text-[9px] font-bold uppercase" style={{ letterSpacing: '0.3em', color: '#00b4ff' }}>LANKA</span>
            </div>
          </Link>

          <h1 className="text-3xl font-black text-white mb-2">Welcome Back</h1>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Sign in to your Grow More Lanka account
          </p>
        </div>

        {/* Card */}
        <div className="relative rounded-2xl p-8 overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          {/* Top accent */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px"
            style={{ background: 'linear-gradient(90deg,transparent,rgba(0,180,255,0.6),transparent)' }} />
          {/* Corner glow */}
          <div className="absolute top-0 right-0 w-48 h-48 pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(110,30,220,0.1) 0%, transparent 70%)' }} />

          {/* Demo credentials */}
          <div className="mb-6 rounded-xl p-4 relative overflow-hidden"
            style={{ background: 'rgba(0,180,255,0.06)', border: '1px solid rgba(0,180,255,0.15)' }}>
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#00b4ff' }}>Demo Credentials</p>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Email: <span className="font-mono text-white/80">demo@growmore.com</span>
            </p>
            <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Password: <span className="font-mono text-white/80">Demo@1234</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Email */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2"
                style={{ color: 'rgba(255,255,255,0.40)' }}>
                Email Address
              </label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
                  style={{ color: 'rgba(255,255,255,0.30)' }} />
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  required
                  style={inputStyle}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2"
                style={{ color: 'rgba(255,255,255,0.40)' }}>
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
                  style={{ color: 'rgba(255,255,255,0.30)' }} />
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  required
                  style={{ ...inputStyle, paddingRight: '44px' }}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors hover:text-white"
                  style={{ color: 'rgba(255,255,255,0.35)' }}>
                  {showPwd ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="relative overflow-hidden flex items-center justify-center gap-2 w-full py-4 rounded-xl font-bold text-sm text-[#04020e] transition-all hover:-translate-y-0.5 active:scale-95 mt-1 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg,#00b4ff,#4dcfff)', boxShadow: '0 0 40px rgba(0,180,255,0.25)' }}
            >
              <span className="absolute inset-0 bg-white/0 hover:bg-white/10 transition-all duration-300" />
              <span className="relative">{loading ? 'Signing in…' : 'Sign In'}</span>
              {!loading && <FiArrowRight className="relative w-4 h-4" />}
            </button>
          </form>

          {/* Footer link */}
          <p className="text-center text-sm mt-6" style={{ color: 'rgba(255,255,255,0.38)' }}>
            Don't have an account?{' '}
            <Link to="/register"
              className="font-semibold transition-colors hover:underline"
              style={{ color: '#00b4ff' }}>
              Create one
            </Link>
          </p>
        </div>

        {/* Back to home */}
        <p className="text-center mt-5 text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
          <Link to="/" className="hover:text-white/60 transition-colors">← Back to Home</Link>
        </p>
      </motion.div>
    </div>
  );
}

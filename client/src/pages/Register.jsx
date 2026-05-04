import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiCheck } from 'react-icons/fi';

export default function Register() {
  const { register } = useAuth();
  const navigate      = useNavigate();
  const [form,    setForm]    = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [showCfm, setShowCfm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) return toast.error('Passwords do not match');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success('Account created! Welcome to Grow More 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
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

  const fields = [
    { key: 'name',     label: 'Full Name',        icon: FiUser, type: 'text',     placeholder: 'Your full name' },
    { key: 'email',    label: 'Email Address',     icon: FiMail, type: 'email',    placeholder: 'you@example.com' },
  ];

  return (
    <div className="flex-grow w-full flex items-center justify-center px-4 py-14 relative overflow-hidden"
      style={{ background: '#04020e' }}>

      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 55% at 50% 15%, rgba(110,30,220,0.18) 0%, transparent 70%)' }} />
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

          <h1 className="text-3xl font-black text-white mb-2">Create Account</h1>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Join Grow More Lanka and start your investment journey
          </p>
        </div>

        {/* Card */}
        <div className="relative rounded-2xl p-8 overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          {/* Top accent line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px"
            style={{ background: 'linear-gradient(90deg,transparent,rgba(0,180,255,0.6),transparent)' }} />
          {/* Corner glow */}
          <div className="absolute top-0 right-0 w-52 h-52 pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(110,30,220,0.1) 0%, transparent 70%)' }} />

          {/* Perks strip */}
          <div className="flex items-center gap-4 mb-6 px-4 py-3 rounded-xl"
            style={{ background: 'rgba(0,180,255,0.06)', border: '1px solid rgba(0,180,255,0.12)' }}>
            {['Secure Account', 'Free to Join', 'Expert Guidance'].map(p => (
              <span key={p} className="flex items-center gap-1.5 text-xs font-semibold whitespace-nowrap"
                style={{ color: '#00b4ff' }}>
                <FiCheck className="w-3 h-3" /> {p}
              </span>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Name + Email */}
            {fields.map(f => (
              <div key={f.key}>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2"
                  style={{ color: 'rgba(255,255,255,0.40)' }}>
                  {f.label}
                </label>
                <div className="relative">
                  <f.icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
                    style={{ color: 'rgba(255,255,255,0.30)' }} />
                  <input
                    type={f.type}
                    value={form[f.key]}
                    onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                    placeholder={f.placeholder}
                    required
                    style={inputStyle}
                    onFocus={onFocus}
                    onBlur={onBlur}
                  />
                </div>
              </div>
            ))}

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
                  placeholder="Min. 6 characters"
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

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2"
                style={{ color: 'rgba(255,255,255,0.40)' }}>
                Confirm Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
                  style={{ color: 'rgba(255,255,255,0.30)' }} />
                <input
                  type={showCfm ? 'text' : 'password'}
                  value={form.confirm}
                  onChange={e => setForm({ ...form, confirm: e.target.value })}
                  placeholder="Repeat your password"
                  required
                  style={{ ...inputStyle, paddingRight: '44px' }}
                  onFocus={onFocus}
                  onBlur={e => {
                    onBlur(e);
                    if (form.password && form.confirm && form.password !== e.target.value) {
                      e.target.style.border = '1px solid rgba(255,80,80,0.5)';
                      e.target.style.boxShadow = '0 0 16px rgba(255,80,80,0.1)';
                    }
                  }}
                />
                <button type="button" onClick={() => setShowCfm(!showCfm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors hover:text-white"
                  style={{ color: 'rgba(255,255,255,0.35)' }}>
                  {showCfm ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                </button>
              </div>
              {/* Password mismatch hint */}
              {form.confirm && form.password !== form.confirm && (
                <p className="text-xs mt-1.5" style={{ color: 'rgba(255,100,100,0.8)' }}>
                  Passwords don't match
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="relative overflow-hidden flex items-center justify-center gap-2 w-full py-4 rounded-xl font-bold text-sm text-[#04020e] transition-all hover:-translate-y-0.5 active:scale-95 mt-1 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg,#00b4ff,#4dcfff)', boxShadow: '0 0 40px rgba(0,180,255,0.25)' }}
            >
              <span className="absolute inset-0 bg-white/0 hover:bg-white/10 transition-all duration-300" />
              <span className="relative">{loading ? 'Creating Account…' : 'Create Account'}</span>
              {!loading && <FiArrowRight className="relative w-4 h-4" />}
            </button>
          </form>

          {/* Footer link */}
          <p className="text-center text-sm mt-6" style={{ color: 'rgba(255,255,255,0.38)' }}>
            Already have an account?{' '}
            <Link to="/login"
              className="font-semibold transition-colors hover:underline"
              style={{ color: '#00b4ff' }}>
              Sign in
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

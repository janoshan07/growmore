import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import GoogleSignInButton from '../components/GoogleSignInButton';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiShield, FiArrowLeft, FiRefreshCw } from 'react-icons/fi';

/* ─── Shared styles ───────────────────────────── */
const slide = {
  enter: d => ({ x: d > 0 ? 50 : -50, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.38, ease: [0.22,1,0.36,1] } },
  exit:   d => ({ x: d > 0 ? -50 : 50, opacity: 0, transition: { duration: 0.25 } }),
};

/* ─── OTP box component ───────────────────────── */
function OtpStep({ email, onVerify, onResend, onBack, loading, title, subtitle }) {
  const [digits,   setDigits]  = useState(['','','','','','']);
  const [resendCD, setCD]      = useState(0);
  const refs = useRef([]);

  const handleDigit = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...digits]; next[i] = val; setDigits(next);
    if (val && i < 5) refs.current[i+1]?.focus();
  };
  const handleKey = (i, e) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) refs.current[i-1]?.focus();
  };
  const handlePaste = e => {
    const p = e.clipboardData.getData('text').replace(/\D/g,'').slice(0,6);
    if (p.length === 6) { setDigits(p.split('')); refs.current[5]?.focus(); }
  };

  const handleResend = async () => {
    if (resendCD > 0) return;
    await onResend();
    setDigits(['','','','','','']);
    setCD(60);
    const t = setInterval(() => setCD(c => { if (c<=1){clearInterval(t);return 0;} return c-1; }), 1000);
  };

  const code = digits.join('');

  return (
    <>
      <div className="flex items-center justify-center w-14 h-14 rounded-2xl mb-4 mx-auto"
        style={{background:'rgba(0,180,255,0.1)',border:'1px solid rgba(0,180,255,0.25)'}}>
        <FiShield className="w-7 h-7" style={{color:'#00b4ff'}}/>
      </div>
      <h2 className="text-2xl font-black text-white mb-1 text-center">{title}</h2>
      <p className="text-sm mb-1 text-center" style={{color:'rgba(255,255,255,0.42)'}}>{subtitle}</p>
      <p className="text-sm font-bold text-center mb-6" style={{color:'#00b4ff'}}>{email}</p>

      <form onSubmit={e => { e.preventDefault(); if (code.length === 6) onVerify(code); }}
        className="flex flex-col items-center gap-5">
        <div className="flex gap-2.5" onPaste={handlePaste}>
          {digits.map((d,i) => (
            <input key={i} ref={el => refs.current[i]=el}
              type="text" inputMode="numeric" maxLength={1} value={d}
              onChange={e => handleDigit(i,e.target.value)} onKeyDown={e => handleKey(i,e)}
              autoFocus={i===0}
              style={{
                width:'46px', height:'56px', textAlign:'center',
                fontSize:'22px', fontWeight:800, outline:'none',
                background: d?'rgba(0,180,255,0.1)':'rgba(255,255,255,0.05)',
                border:`2px solid ${d?'rgba(0,180,255,0.5)':'rgba(255,255,255,0.1)'}`,
                borderRadius:'10px', color:'white',
                boxShadow: d?'0 0 14px rgba(0,180,255,0.15)':'none', transition:'all 0.2s',
              }}
              onFocus={e => { e.target.style.border='2px solid rgba(0,180,255,0.7)'; e.target.style.boxShadow='0 0 18px rgba(0,180,255,0.2)'; }}
              onBlur={e => { e.target.style.border=`2px solid ${d?'rgba(0,180,255,0.5)':'rgba(255,255,255,0.1)'}`; e.target.style.boxShadow=d?'0 0 14px rgba(0,180,255,0.15)':'none'; }}
            />
          ))}
        </div>

        <button type="submit" disabled={loading || code.length<6}
          className="relative overflow-hidden flex items-center justify-center gap-2 w-full py-4 rounded-xl font-bold text-sm text-[#04020e] transition-all hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ background: 'linear-gradient(135deg,#00b4ff,#4dcfff)', boxShadow: '0 0 40px rgba(0,180,255,0.25)' }}>
          <span className="relative">{loading ? 'Verifying…' : 'Verify & Login'}</span>
        </button>

        <div className="flex items-center justify-between w-full">
          <button type="button" onClick={onBack}
            className="text-sm flex items-center gap-1 transition-colors"
            style={{color:'rgba(255,255,255,0.38)'}}>
            <FiArrowLeft className="w-3.5 h-3.5"/> Back
          </button>
          <button type="button" onClick={handleResend} disabled={resendCD>0}
            className="text-sm flex items-center gap-1.5 font-semibold disabled:opacity-40"
            style={{color:'#00b4ff'}}>
            <FiRefreshCw className="w-3.5 h-3.5"/>
            {resendCD>0 ? `Resend in ${resendCD}s` : 'Resend code'}
          </button>
        </div>
      </form>
    </>
  );
}

export default function Login() {
  const { login, verifyLoginOtp, googleSignIn } = useAuth();
  const navigate   = useNavigate();
  
  const [step,     setStep]     = useState(0); // 0 = login, 1 = otp
  const [dir,      setDir]      = useState(1);
  const [form,     setForm]     = useState({ email: '', password: '' });
  const [showPwd,  setShowPwd]  = useState(false);
  const [loading,  setLoading]  = useState(false);

  const go = d => { setDir(d); setStep(s => s + d); };

  const handleGoogle = async (credential) => {
    setLoading(true);
    try {
      const result = await googleSignIn(credential);
      if (result.status === 'logged_in') {
        toast.success('Welcome back!');
        navigate('/dashboard');
      } else {
        toast('No account found. Please sign up first.', { icon: 'ℹ️' });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Google sign-in failed');
    } finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(form.email, form.password);
      if (data.status === 'otp_required') {
        toast.success(data.message || 'Verification code sent!');
        go(1);
      } else {
        toast.success('Welcome back!');
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (code) => {
    setLoading(true);
    try {
      await verifyLoginOtp(form.email, code);
      toast.success('Login successful! 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid code');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      await login(form.email, form.password);
      toast.success('New code sent!');
    } catch {
      toast.error('Failed to resend code');
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

          {step === 0 && (
            <>
              <h1 className="text-3xl font-black text-white mb-2">Welcome Back</h1>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>
                Sign in to your Grow More Lanka account
              </p>
            </>
          )}
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

          <AnimatePresence mode="wait" custom={dir}>
            {/* ── Step 0: Login Form ────────────────── */}
            {step === 0 && (
              <motion.div key="login-form" custom={dir} variants={slide} initial="enter" animate="center" exit="exit">
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

                {/* Google Sign-In */}
                <div className="mb-5">
                  <GoogleSignInButton onCredential={handleGoogle} />
                </div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex-1 h-px" style={{background:'rgba(255,255,255,0.08)'}}/>
                  <span className="text-xs font-semibold" style={{color:'rgba(255,255,255,0.3)'}}>OR</span>
                  <div className="flex-1 h-px" style={{background:'rgba(255,255,255,0.08)'}}/>
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
                    <span className="relative">{loading ? 'Logging in…' : 'Login'}</span>
                    {!loading && <FiArrowRight className="relative w-4 h-4" />}
                  </button>
                </form>
              </motion.div>
            )}

            {/* ── Step 1: Verify OTP ────────────────── */}
            {step === 1 && (
              <motion.div key="otp-form" custom={dir} variants={slide} initial="enter" animate="center" exit="exit">
                <OtpStep
                  email={form.email}
                  onVerify={handleVerifyOtp}
                  onResend={handleResendOtp}
                  onBack={() => go(-1)}
                  loading={loading}
                  title="Check your email"
                  subtitle="We sent a 2FA login code to"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer link */}
          {step === 0 && (
            <p className="text-center text-sm mt-6" style={{ color: 'rgba(255,255,255,0.38)' }}>
              Don't have an account?{' '}
              <Link to="/register"
                className="font-semibold transition-colors hover:underline"
                style={{ color: '#00b4ff' }}>
                Create one
              </Link>
            </p>
          )}
        </div>

        {/* Back to home */}
        <p className="text-center mt-5 text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
          <Link to="/" className="hover:text-white/60 transition-colors">← Back to Home</Link>
        </p>
      </motion.div>
    </div>
  );
}

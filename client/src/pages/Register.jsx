import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import GoogleSignInButton from '../components/GoogleSignInButton';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiArrowLeft, FiShield, FiRefreshCw } from 'react-icons/fi';

/* ─── Shared styles ───────────────────────────── */
const slide = {
  enter: d => ({ x: d > 0 ? 50 : -50, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.38, ease: [0.22,1,0.36,1] } },
  exit:   d => ({ x: d > 0 ? -50 : 50, opacity: 0, transition: { duration: 0.25 } }),
};

function GMLogo() {
  return (
    <Link to="/" className="flex items-center gap-2.5 select-none mb-8">
      <svg viewBox="0 0 44 44" fill="none" width="34" height="34">
        <circle cx="22" cy="22" r="21" fill="#0f1c3f" stroke="#00b4ff" strokeWidth="1.5"/>
        <text x="9" y="28" fontFamily="Georgia,serif" fontWeight="700" fontSize="18" fill="#00b4ff">G</text>
        <rect x="26" y="23" width="3.5" height="7"  rx="0.8" fill="#00b4ff"/>
        <rect x="30.5" y="19" width="3.5" height="11" rx="0.8" fill="#00b4ff"/>
        <rect x="35" y="15" width="3.5" height="15" rx="0.8" fill="#00b4ff"/>
      </svg>
      <div className="flex flex-col leading-none">
        <span className="text-[13px] font-black text-white" style={{letterSpacing:'0.1em'}}>GROW MORE</span>
        <span className="text-[8px] font-bold" style={{letterSpacing:'0.3em',color:'#00b4ff'}}>LANKA</span>
      </div>
    </Link>
  );
}

function Field({ icon: Icon, showToggle, onToggle, show, value, onChange, ...rest }) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="relative">
      <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none z-10"
        style={{ color: focused ? '#00b4ff' : 'rgba(255,255,255,0.30)' }} />
      <input value={value} onChange={onChange}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          background: 'rgba(255,255,255,0.05)',
          border: `1px solid ${focused ? 'rgba(0,180,255,0.55)' : 'rgba(255,255,255,0.1)'}`,
          boxShadow: focused ? '0 0 0 3px rgba(0,180,255,0.08)' : 'none',
          color:'white', borderRadius:'10px',
          padding:`13px ${showToggle?'44px':'16px'} 13px 44px`,
          width:'100%', outline:'none', fontSize:'15px', transition:'all 0.2s',
        }} {...rest} />
      {showToggle && (
        <button type="button" onClick={onToggle}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10"
          style={{color:'rgba(255,255,255,0.35)'}}>
          {show ? <FiEyeOff className="w-4 h-4"/> : <FiEye className="w-4 h-4"/>}
        </button>
      )}
    </div>
  );
}

function PrimaryBtn({ loading, children, disabled, ...p }) {
  return (
    <button {...p} disabled={loading||disabled}
      style={{
        background:'linear-gradient(135deg,#00b4ff,#4dcfff)',
        boxShadow:'0 0 36px rgba(0,180,255,0.28)',
        color:'#04020e', fontWeight:700, fontSize:'14px', border:'none',
        borderRadius:'10px', padding:'14px', width:'100%',
        cursor:(loading||disabled)?'not-allowed':'pointer',
        opacity:(loading||disabled)?0.55:1, transition:'all 0.2s',
      }}>{children}</button>
  );
}

function BackBtn({ onClick }) {
  return (
    <button type="button" onClick={onClick}
      className="flex items-center gap-1.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all shrink-0"
      style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',color:'rgba(255,255,255,0.6)'}}>
      <FiArrowLeft className="w-4 h-4"/> Back
    </button>
  );
}

function Divider() {
  return (
    <div className="flex items-center gap-3 my-5">
      <div className="flex-1 h-px" style={{background:'rgba(255,255,255,0.08)'}}/>
      <span className="text-xs font-semibold" style={{color:'rgba(255,255,255,0.3)'}}>OR</span>
      <div className="flex-1 h-px" style={{background:'rgba(255,255,255,0.08)'}}/>
    </div>
  );
}

function Card({ children }) {
  return (
    <div style={{
      background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.09)',
      borderRadius:'20px', padding:'36px 32px', position:'relative', overflow:'hidden',
    }}>
      <div style={{position:'absolute',top:0,left:'50%',transform:'translateX(-50%)',
        width:'160px',height:'1px',background:'linear-gradient(90deg,transparent,rgba(0,180,255,0.6),transparent)'}}/>
      {children}
    </div>
  );
}

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

        <PrimaryBtn type="submit" loading={loading} disabled={code.length<6}>
          <span className="flex items-center justify-center gap-2">
            {loading ? 'Verifying…' : 'Verify & Create Account'}
          </span>
        </PrimaryBtn>

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

/* ══════════════════════════════════════════════
   MAIN REGISTER PAGE
   Steps: 0=name, 1=email, 2=password, 3=otp(email), 4=otp(google)
   ══════════════════════════════════════════════ */
const STEPS = ['Name','Email','Password','Verify'];

export default function Register() {
  const { sendOtp, completeRegistration, googleSignIn, googleCompleteRegistration } = useAuth();
  const navigate = useNavigate();

  const [step,    setStep]    = useState(0);
  const [dir,     setDir]     = useState(1);
  const [data,    setData]    = useState({ name:'', email:'', password:'', confirm:'' });
  const [loading, setLoading] = useState(false);
  const [showP,   setShowP]   = useState(false);
  const [showC,   setShowC]   = useState(false);
  // Google flow state
  const [gEmail,  setGEmail]  = useState('');
  const [gName,   setGName]   = useState('');
  const [isGoogleFlow, setIsGoogleFlow] = useState(false);

  const go = d => { setDir(d); setStep(s => s + d); };

  /* ── Email/password steps ─────────────── */
  const submitName = e => { e.preventDefault(); if (data.name.trim()) go(1); };
  const submitEmail = e => {
    e.preventDefault();
    const cleanEmail = data.email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) return toast.error('Enter a valid email');
    setData({ ...data, email: cleanEmail });
    go(1);
  };
  const submitPassword = async e => {
    e.preventDefault();
    if (data.password.length < 6) return toast.error('Password must be at least 6 characters');
    if (data.password !== data.confirm) return toast.error('Passwords do not match');
    setLoading(true);
    try {
      await sendOtp(data.name, data.email, data.password);
      toast.success('Verification code sent!');
      setIsGoogleFlow(false);
      go(1);
    } catch (err) {
      toast.error(err.friendlyMessage || err.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally { setLoading(false); }
  };

  const verifyEmailOtp = async (code) => {
    setLoading(true);
    try {
      await completeRegistration(data.email, code);
      toast.success('Account created! Welcome 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.friendlyMessage || err.response?.data?.message || 'Invalid code. Please try again.');
    } finally { setLoading(false); }
  };

  const resendEmailOtp = async () => {
    try { await sendOtp(data.name, data.email, data.password); toast.success('New code sent!'); }
    catch { toast.error('Failed to resend'); }
  };

  /* ── Google OAuth flow ────────────────── */
  const handleGoogleCredential = async (accessToken) => {
    setLoading(true);
    try {
      const result = await googleSignIn(accessToken);
      if (result.status === 'logged_in') {
        toast.success('Welcome back!');
        navigate('/dashboard');
      } else if (result.status === 'otp_required') {
        toast.success('Verification code sent to your Gmail!');
        setGEmail(result.email);
        setGName(result.name);
        setIsGoogleFlow(true);
        setDir(1);
        setStep(4);
      }
    } catch (err) {
      toast.error(err.friendlyMessage || err.response?.data?.message || 'Google sign-in failed');
    } finally { setLoading(false); }
  };

  const verifyGoogleOtp = async (code) => {
    setLoading(true);
    try {
      await googleCompleteRegistration(gEmail, code);
      toast.success('Google account verified! Welcome 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid code');
    } finally { setLoading(false); }
  };

  const resendGoogleOtp = async () => {
    // Re-trigger by calling google sign-in again isn't possible without credential
    // So we just notify user — they'll need to click Google again
    toast('Please click "Continue with Google" again to get a new code.', { icon: 'ℹ️' });
  };

  // Progress bar: steps 0-3 for email flow, step 4 for google otp
  const progressStep = step > 3 ? 3 : step;

  return (
    <div className="flex-grow flex items-center justify-center px-4 py-12 relative overflow-hidden"
      style={{ background: '#04020e' }}>
      <div className="absolute inset-0 pointer-events-none"
        style={{background:'radial-gradient(ellipse 65% 55% at 50% 10%,rgba(110,30,220,0.18),transparent 70%)'}}/>
      <div className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{backgroundImage:'linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)',backgroundSize:'60px 60px'}}/>

      <motion.div className="w-full max-w-[420px] z-10 relative"
        initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{duration:0.7,ease:[0.22,1,0.36,1]}}>

        <GMLogo />

        {/* Progress bar (email/password flow only) */}
        {step < 4 && (
          <div className="flex items-center gap-2 mb-6">
            {STEPS.map((_,i) => (
              <div key={i} style={{
                height:'4px', borderRadius:'2px', transition:'all 0.4s',
                flex: i === progressStep ? 2 : 1,
                background: i <= progressStep ? '#00b4ff' : 'rgba(255,255,255,0.12)',
              }}/>
            ))}
          </div>
        )}

        <Card>
          <AnimatePresence mode="wait" custom={dir}>

            {/* ── Step 0: Name ────────────────── */}
            {step === 0 && (
              <motion.div key="s0" custom={dir} variants={slide} initial="enter" animate="center" exit="exit">
                <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{color:'rgba(255,255,255,0.35)'}}>Step 1 of 4</p>
                <h2 className="text-2xl font-black text-white mb-1">Create your account</h2>
                <p className="text-sm mb-5" style={{color:'rgba(255,255,255,0.42)'}}>What should we call you?</p>

                {/* Google Sign-In */}
                <GoogleSignInButton onCredential={handleGoogleCredential} />
                <Divider />

                <form onSubmit={submitName} className="flex flex-col gap-4">
                  <Field icon={FiUser} type="text" placeholder="Full name" required
                    value={data.name} onChange={e => setData({...data,name:e.target.value})} autoFocus />
                  <PrimaryBtn type="submit">
                    <span className="flex items-center justify-center gap-2">Continue <FiArrowRight/></span>
                  </PrimaryBtn>
                </form>
              </motion.div>
            )}

            {/* ── Step 1: Email ────────────────── */}
            {step === 1 && (
              <motion.div key="s1" custom={dir} variants={slide} initial="enter" animate="center" exit="exit">
                <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{color:'rgba(255,255,255,0.35)'}}>Step 2 of 4</p>
                <h2 className="text-2xl font-black text-white mb-1">Your email</h2>
                <p className="text-sm mb-5" style={{color:'rgba(255,255,255,0.42)'}}>We'll send a verification code here.</p>
                <form onSubmit={submitEmail} className="flex flex-col gap-4">
                  <Field icon={FiMail} type="email" placeholder="you@example.com" required
                    value={data.email} onChange={e => setData({...data,email:e.target.value})} autoFocus />
                  <div className="flex gap-3">
                    <BackBtn onClick={() => go(-1)} />
                    <PrimaryBtn type="submit">
                      <span className="flex items-center justify-center gap-2">Continue <FiArrowRight/></span>
                    </PrimaryBtn>
                  </div>
                </form>
              </motion.div>
            )}

            {/* ── Step 2: Password ─────────────── */}
            {step === 2 && (
              <motion.div key="s2" custom={dir} variants={slide} initial="enter" animate="center" exit="exit">
                <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{color:'rgba(255,255,255,0.35)'}}>Step 3 of 4</p>
                <h2 className="text-2xl font-black text-white mb-1">Create password</h2>
                <p className="text-sm mb-5" style={{color:'rgba(255,255,255,0.42)'}}>Use 6+ characters with letters and numbers.</p>
                <form onSubmit={submitPassword} className="flex flex-col gap-4">
                  <Field icon={FiLock} type={showP?'text':'password'} placeholder="Password (min. 6)" required
                    value={data.password} onChange={e => setData({...data,password:e.target.value})} autoFocus
                    showToggle onToggle={() => setShowP(!showP)} show={showP} />
                  <Field icon={FiLock} type={showC?'text':'password'} placeholder="Confirm password" required
                    value={data.confirm} onChange={e => setData({...data,confirm:e.target.value})}
                    showToggle onToggle={() => setShowC(!showC)} show={showC} />
                  {data.confirm && data.password !== data.confirm && (
                    <p className="text-xs -mt-2" style={{color:'rgba(255,100,100,0.8)'}}>Passwords don't match</p>
                  )}
                  <div className="flex gap-3">
                    <BackBtn onClick={() => go(-1)} />
                    <PrimaryBtn type="submit" loading={loading}>
                      <span className="flex items-center justify-center gap-2">
                        {loading ? 'Sending…' : <><span>Send Code</span><FiArrowRight/></>}
                      </span>
                    </PrimaryBtn>
                  </div>
                </form>
              </motion.div>
            )}

            {/* ── Step 3: OTP (email/password flow) ── */}
            {step === 3 && (
              <motion.div key="s3" custom={dir} variants={slide} initial="enter" animate="center" exit="exit">
                <OtpStep
                  email={data.email}
                  onVerify={verifyEmailOtp}
                  onResend={resendEmailOtp}
                  onBack={() => go(-1)}
                  loading={loading}
                  title="Check your email"
                  subtitle="We sent a 6-digit code to"
                />
              </motion.div>
            )}

            {/* ── Step 4: OTP (Google flow) ─────── */}
            {step === 4 && (
              <motion.div key="s4" custom={dir} variants={slide} initial="enter" animate="center" exit="exit">
                <OtpStep
                  email={gEmail}
                  onVerify={verifyGoogleOtp}
                  onResend={resendGoogleOtp}
                  onBack={() => { setStep(0); setDir(-1); }}
                  loading={loading}
                  title="Verify your Gmail"
                  subtitle="We sent a code to confirm your Google account:"
                />
              </motion.div>
            )}

          </AnimatePresence>
        </Card>

        <p className="text-center text-sm mt-5" style={{color:'rgba(255,255,255,0.35)'}}>
          Already have an account?{' '}
          <Link to="/login" className="font-semibold hover:underline" style={{color:'#00b4ff'}}>Login</Link>
        </p>
        <p className="text-center mt-3 text-xs" style={{color:'rgba(255,255,255,0.2)'}}>
          <Link to="/" className="hover:opacity-60 transition-opacity">← Back to Home</Link>
        </p>
      </motion.div>
    </div>
  );
}

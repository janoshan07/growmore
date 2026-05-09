import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('gm_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);

  // Sync user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('gm_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('gm_user');
    }
  }, [user]);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    return data; // returns status: 'otp_required'
  };

  const verifyLoginOtp = async (email, otp) => {
    const { data } = await api.post('/auth/login/verify-otp', { email, otp });
    localStorage.setItem('gm_token', data.token);
    setUser(data.user);
    return data;
  };

  /* Step 1 — send OTP to email */
  const sendOtp = async (name, email, password) => {
    const { data } = await api.post('/auth/send-otp', { name, email, password });
    return data;
  };

  /* Step 2 — verify OTP, create account, auto-login */
  const completeRegistration = async (email, otp) => {
    const { data } = await api.post('/auth/verify-otp', { email, otp });
    localStorage.setItem('gm_token', data.token);
    setUser(data.user);
    return data;
  };

  /* Google OAuth Step 1 — verify Google access token, get OTP or login */
  const googleSignIn = async (accessToken) => {
    const { data } = await api.post('/auth/google', { accessToken });
    if (data.status === 'logged_in') {
      localStorage.setItem('gm_token', data.token);
      setUser(data.user);
    }
    return data; // caller checks data.status
  };

  /* Google OAuth Step 2 — verify OTP sent to Gmail, create account */
  const googleCompleteRegistration = async (email, otp) => {
    const { data } = await api.post('/auth/google/verify-otp', { email, otp });
    localStorage.setItem('gm_token', data.token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('gm_token');
    localStorage.removeItem('gm_user');
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const { data } = await api.get('/auth/me');
      setUser(data.user);
    } catch {
      logout();
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, verifyLoginOtp, sendOtp, completeRegistration, googleSignIn, googleCompleteRegistration, logout, refreshUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

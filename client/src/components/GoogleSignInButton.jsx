import { useRef, useCallback } from 'react';

/**
 * A custom "Continue with Google" button that ALWAYS opens Google's
 * full account picker (like Binance, Airbnb, etc.) — no locked sessions.
 *
 * Uses the OAuth2 Token Client (implicit grant) with prompt='select_account'.
 * The returned access token is verified server-side via Google's tokeninfo API.
 *
 * @param {function} onCredential - called with the Google access token string
 */
export default function GoogleSignInButton({ onCredential }) {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const tokenClientRef = useRef(null);

  const isConfigured =
    clientId &&
    !clientId.startsWith('your_') &&
    clientId.includes('.apps.googleusercontent.com');

  const handleClick = useCallback(() => {
    if (!window.google?.accounts?.oauth2) return;

    // Initialise (or reuse) the token client each click so prompt is fresh
    if (!tokenClientRef.current) {
      tokenClientRef.current = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: 'openid email profile',
        callback: (response) => {
          if (response?.access_token) {
            onCredential(response.access_token);
          }
        },
      });
    }

    // 'select_account' forces the full account picker every time
    tokenClientRef.current.requestAccessToken({ prompt: 'select_account' });
  }, [clientId, onCredential]);

  if (!isConfigured) return null;

  return (
    <button
      type="button"
      onClick={handleClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        width: '100%',
        padding: '11px 16px',
        background: '#ffffff',
        border: '1px solid #dadce0',
        borderRadius: '4px',
        cursor: 'pointer',
        fontFamily: "'Google Sans', Roboto, Arial, sans-serif",
        fontSize: '14px',
        fontWeight: 600,
        color: '#3c4043',
        letterSpacing: '0.01em',
        transition: 'box-shadow 0.15s, background 0.15s',
        boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.18)';
        e.currentTarget.style.background = '#f8f8f8';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.08)';
        e.currentTarget.style.background = '#ffffff';
      }}
    >
      {/* Official Google 'G' SVG logo */}
      <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
        <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
        <path d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
        <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
      </svg>
      Continue with Google
    </button>
  );
}

import { useEffect, useRef, useCallback } from 'react';

/**
 * Renders a styled "Continue with Google" button using Google Identity Services.
 * @param {function} onCredential - called with the raw Google credential (JWT)
 */
export default function GoogleSignInButton({ onCredential, label = 'Continue with Google' }) {
  const containerRef = useRef(null);
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const handleResponse = useCallback((response) => {
    if (response?.credential) onCredential(response.credential);
  }, [onCredential]);

  useEffect(() => {
    if (!window.google || !clientId) return;

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: handleResponse,
      auto_select: false,
      cancel_on_tap_outside: true,
    });

    // Render the styled Google button inside our container
    window.google.accounts.id.renderButton(containerRef.current, {
      type: 'standard',
      theme: 'outline',
      size: 'large',
      text: 'continue_with',
      shape: 'rectangular',
      width: containerRef.current?.offsetWidth || 340,
    });
  }, [handleResponse, clientId]);

  if (!clientId) {
    return (
      <p className="text-center text-xs py-2" style={{ color: 'rgba(255,255,255,0.3)' }}>
        Google Sign-In not configured (missing VITE_GOOGLE_CLIENT_ID)
      </p>
    );
  }

  return (
    <div className="w-full">
      {/* GSI renders its own button iframe here */}
      <div ref={containerRef} className="w-full flex justify-center" />
    </div>
  );
}

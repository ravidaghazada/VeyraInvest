import { User } from '../types';

declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: { access_token?: string; error?: string; error_description?: string }) => void;
            error_callback?: (error: any) => void;
            prompt?: string;
          }) => {
            requestAccessToken: (overrideConfig?: { prompt?: string }) => void;
          };
        };
        id: {
          initialize: (config: any) => void;
          prompt: (notification?: any) => void;
        };
      };
    };
  }
}

export interface GoogleAuthConfig {
  success: boolean;
  clientId: string;
  hasClientId: boolean;
  callbackUrl: string;
  appUrl?: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  expiresAt?: number;
  error?: string;
  message?: string;
  callbackUrl?: string;
}

const PRODUCTION_URL = 'https://veyrainvest.vercel.app';

function getActiveOrigin(): string {
  if (typeof window === 'undefined') return PRODUCTION_URL;
  const origin = window.location.origin || '';
  if (origin.includes('veyrainvest.vercel.app') || origin.includes('veyrainvest.az')) {
    return PRODUCTION_URL;
  }
  return origin || PRODUCTION_URL;
}

export const authService = {
  // Fetch Google OAuth configuration from server
  async getGoogleConfig(): Promise<GoogleAuthConfig> {
    const origin = getActiveOrigin();
    const defaultCallback = `${origin}/api/auth/google/callback`;

    try {
      const res = await fetch('/api/auth/google/config');
      if (res.ok) {
        const data = await res.json();
        if (data && (data.clientId || data.hasClientId)) {
          return {
            success: true,
            clientId: data.clientId || '',
            hasClientId: Boolean(data.clientId || data.hasClientId),
            callbackUrl: data.callbackUrl || defaultCallback,
            appUrl: data.appUrl || origin,
          };
        }
      }
    } catch (err) {
      console.warn('Could not fetch server Google OAuth config:', err);
    }

    // Client-side Vite environment variable fallback
    const clientEnvId =
      (typeof import.meta !== 'undefined' &&
        ((import.meta as any).env?.VITE_GOOGLE_CLIENT_ID ||
          (import.meta as any).env?.GOOGLE_CLIENT_ID)) ||
      '';

    if (clientEnvId && clientEnvId.trim().length > 0) {
      return {
        success: true,
        clientId: clientEnvId.trim(),
        hasClientId: true,
        callbackUrl: defaultCallback,
        appUrl: origin,
      };
    }

    return {
      success: false,
      clientId: '',
      hasClientId: false,
      callbackUrl: defaultCallback,
      appUrl: origin,
    };
  },

  // Perform Real Google OAuth Login or Registration via standard OAuth 2.0 flow
  async startGoogleAuth(mode: 'login' | 'register' = 'login'): Promise<AuthResponse> {
    const currentOrigin = getActiveOrigin();
    let targetAuthUrl = '';
    let fallbackCallbackUrl = `${currentOrigin}/api/auth/google/callback`;

    try {
      // 1. Try to fetch direct Google auth URL from serverless endpoint
      try {
        const urlRes = await fetch(`/api/auth/google/url?mode=${mode}&origin=${encodeURIComponent(currentOrigin)}`);
        if (urlRes.ok) {
          const urlData = await urlRes.json();
          if (urlData.success && urlData.url) {
            targetAuthUrl = urlData.url;
            if (urlData.callbackUrl) fallbackCallbackUrl = urlData.callbackUrl;
          }
        }
      } catch (err) {
        console.warn('Failed to fetch Google auth URL from server:', err);
      }

      // 2. If server URL wasn't retrieved directly, consult config / client environment
      if (!targetAuthUrl) {
        const config = await this.getGoogleConfig();
        if (config.callbackUrl) fallbackCallbackUrl = config.callbackUrl;

        if (config.clientId) {
          const stateObj = {
            mode,
            origin: currentOrigin,
            nonce: Math.random().toString(36).substring(2, 10),
            timestamp: Date.now(),
          };
          const state = btoa(JSON.stringify(stateObj));
          const params = new URLSearchParams({
            client_id: config.clientId,
            redirect_uri: fallbackCallbackUrl,
            response_type: 'code',
            scope: 'openid email profile',
            access_type: 'offline',
            prompt: 'select_account',
            state,
          });
          targetAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
        } else {
          return {
            success: false,
            error: 'CONFIG_MISSING',
            message: 'Google OAuth Client ID təyin edilməyib. Zəhmət olmasa layihə tənzimləmələrində GOOGLE_CLIENT_ID və GOOGLE_CLIENT_SECRET mühit dəyişənlərini əlavə edin.',
            callbackUrl: fallbackCallbackUrl,
          };
        }
      }

      if (!targetAuthUrl) {
        return {
          success: false,
          error: 'OAUTH_URL_ERROR',
          message: 'Google OAuth keçid ünvanı alına bilmədi.',
          callbackUrl: fallbackCallbackUrl,
        };
      }

      // Calculate popup dimensions
      const width = 520;
      const height = 640;
      const left = Math.max(0, Math.round(window.screenX + (window.outerWidth - width) / 2));
      const top = Math.max(0, Math.round(window.screenY + (window.outerHeight - height) / 2));

      const popup = window.open(
        targetAuthUrl,
        'GoogleSignInPopup',
        `width=${width},height=${height},left=${left},top=${top},status=no,toolbar=no,menubar=no,location=yes,resizable=yes`
      );

      if (!popup || popup.closed || typeof popup.closed === 'undefined') {
        return {
          success: false,
          error: 'POPUP_BLOCKED',
          message: 'Brauzerinizin popup pəncərə bloklayıcısı Google pəncərəsini açmağa mane oldu. Zəhmət olmasa brauzer tənzimləmələrində popuplara icazə verin.',
        };
      }

      // Focus popup
      try {
        popup.focus();
      } catch {}

      // Listen for message from popup
      return await new Promise<AuthResponse>((resolve) => {
        let isResolved = false;

        const cleanup = () => {
          window.removeEventListener('message', handleMessage);
          if (pollInterval) clearInterval(pollInterval);
        };

        const handleMessage = (event: MessageEvent) => {
          if (event.data?.type === 'GOOGLE_AUTH_SUCCESS') {
            if (isResolved) return;
            isResolved = true;
            cleanup();
            resolve({
              success: true,
              user: event.data.user,
              token: event.data.token,
            });
          } else if (event.data?.type === 'GOOGLE_AUTH_ERROR') {
            if (isResolved) return;
            isResolved = true;
            cleanup();
            resolve({
              success: false,
              error: event.data.error || 'Google autentifikasiyası uğursuz oldu.',
            });
          }
        };

        window.addEventListener('message', handleMessage);

        // Detect if user closed the popup before completing authentication
        const pollInterval = setInterval(() => {
          if (popup.closed) {
            cleanup();
            if (!isResolved) {
              isResolved = true;
              resolve({
                success: false,
                error: 'POPUP_CLOSED',
                message: 'Google autentifikasiya pəncərəsi bağlandı.',
              });
            }
          }
        }, 800);

        // Safety timeout (5 minutes)
        setTimeout(() => {
          if (!isResolved) {
            cleanup();
            isResolved = true;
            resolve({
              success: false,
              error: 'TIMEOUT',
              message: 'Google autentifikasiya vaxtı bitdi. Zəhmət olmasa yenidən cəhd edin.',
            });
          }
        }, 300000);
      });
    } catch (err: any) {
      return {
        success: false,
        error: err.message || 'Gözlənilməz xəta baş verdi',
      };
    }
  },

  // Normal Email/Password Registration
  async registerWithEmail(name: string, email: string, pass: string): Promise<AuthResponse> {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password: pass }),
      });
      const data = await res.json();
      return data;
    } catch (err: any) {
      return { success: false, error: err.message || 'Serverlə əlaqə qurulmadı.' };
    }
  },

  // Normal Email/Password Login
  async loginWithEmail(email: string, pass: string): Promise<AuthResponse> {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass }),
      });
      const data = await res.json();
      return data;
    } catch (err: any) {
      return { success: false, error: err.message || 'Serverlə əlaqə qurulmadı.' };
    }
  },

  // Verify stored session token
  async verifySession(token: string): Promise<{ success: boolean; user?: User }> {
    try {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return await res.json();
    } catch {
      return { success: false };
    }
  },
};

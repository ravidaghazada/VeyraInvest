import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { VeyraLogo } from './VeyraLogo';
import { X, Mail, Lock, User, ShieldCheck, Eye, EyeOff, AlertCircle } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    loginWithGoogle,
    loginWithEmail,
    registerWithEmail,
  } = useApp();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [configTip, setConfigTip] = useState<{ callbackUrl?: string } | null>(null);

  // Synchronize internal mode with context state when modal opens
  useEffect(() => {
    if (isAuthModalOpen) {
      setMode(authModalMode || 'login');
      setError(null);
      setConfigTip(null);
    }
  }, [isAuthModalOpen, authModalMode]);

  if (!isAuthModalOpen) return null;

  // Real Google OAuth trigger - opens official Google account chooser
  const handleGoogleAuth = async () => {
    setGoogleLoading(true);
    setError(null);
    setConfigTip(null);

    try {
      const result = await loginWithGoogle(mode);
      if (!result.success) {
        if (result.error === 'CONFIG_MISSING') {
          setError(
            result.message ||
              'Google OAuth Client ID təyin edilməyib. Zəhmət olmasa layihə tənzimləmələrində GOOGLE_CLIENT_ID və GOOGLE_CLIENT_SECRET əlavə edin.'
          );
          if (result.callbackUrl) {
            setConfigTip({ callbackUrl: result.callbackUrl });
          }
        } else if (result.error === 'POPUP_BLOCKED') {
          setError(
            'Brauzerinizin popup bloklayıcısı Google pəncərəsini açmağa mane oldu. Zəhmət olmasa popuplara icazə verin və yenidən cəhd edin.'
          );
        } else if (result.error === 'POPUP_CLOSED') {
          setError('Google autentifikasiya pəncərəsi bağlandı.');
        } else {
          setError(result.message || result.error || 'Google hesabı ilə daxil olmaq mümkün olmadı.');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Google ilə əlaqə qurularkən xəta baş verdi.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      setError('Zəhmət olmasa e-poçt və şifrənizi daxil edin.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        const res = await loginWithEmail(cleanEmail, cleanPassword);
        if (!res.success) {
          setError(res.error || 'E-poçt və ya şifrə yanlışdır.');
        }
      } else {
        const cleanName = fullName.trim();
        if (!cleanName) {
          setError('Zəhmət olmasa ad və soyadınızı daxil edin.');
          setLoading(false);
          return;
        }
        const res = await registerWithEmail(cleanName, cleanEmail, cleanPassword);
        if (!res.success) {
          setError(res.error || 'Qeydiyyat zamanı xəta baş verdi.');
        }
      }
    } catch {
      setError('Əməliyyat zamanı xəta baş verdi. Yenidən cəhd edin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setIsAuthModalOpen(false);
        }
      }}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
      style={{ minHeight: '100vh' }}
    >
      <div
        className="relative w-full max-w-md rounded-3xl border border-[#D4AF37]/50 p-5 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.95)] bg-[#0B111B] text-white my-auto overflow-hidden"
        style={{
          boxShadow: '0 0 35px rgba(212, 175, 55, 0.15)',
        }}
      >
        {/* Background ambient glow inside card */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#0E1624] rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          id="auth-modal-close-btn"
          className="absolute top-4 right-4 p-2 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors z-10"
          aria-label="Bağla"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center mb-6 pt-1 relative z-10">
          <div className="inline-block mb-2">
            <VeyraLogo size="sm" showSlogan={false} />
          </div>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
            {mode === 'login' ? 'Hesabınıza Daxil Olun' : 'İnvestor Hesabı Yaradın'}
          </h3>
          <p className="text-xs text-neutral-400 mt-1">
            {mode === 'login'
              ? 'Veyra Invest portfelinizi idarə etmək üçün daxil olun'
              : 'Gələcəyə dəyər qatan investisiya ekosisteminə qoşulun'}
          </p>
        </div>

        {/* Tab Switcher: Daxil ol vs Qeydiyyat */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-white/5 border border-white/10 rounded-2xl mb-5 relative z-10">
          <button
            type="button"
            id="auth-tab-login"
            onClick={() => {
              setMode('login');
              setAuthModalMode('login');
              setError(null);
            }}
            className={`py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              mode === 'login'
                ? 'bg-gradient-to-r from-[#F6E09E] to-[#D4AF37] text-neutral-950 shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Daxil ol
          </button>
          <button
            type="button"
            id="auth-tab-register"
            onClick={() => {
              setMode('register');
              setAuthModalMode('register');
              setError(null);
            }}
            className={`py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              mode === 'register'
                ? 'bg-gradient-to-r from-[#F6E09E] to-[#D4AF37] text-neutral-950 shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Qeydiyyat
          </button>
        </div>

        <div className="space-y-4 relative z-10">
          {/* Official Google Authentication Button */}
          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={googleLoading || loading}
            id="auth-google-btn"
            className="w-full py-3 px-4 rounded-xl bg-white hover:bg-neutral-100 text-neutral-900 font-bold text-xs sm:text-sm flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-md cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {googleLoading ? (
              <div className="w-5 h-5 border-2 border-neutral-400 border-t-neutral-900 rounded-full animate-spin" />
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span>
              {googleLoading
                ? 'Google ilə əlaqə qurulur...'
                : mode === 'login'
                ? 'Google ilə daxil ol'
                : 'Google ilə qeydiyyatdan keç'}
            </span>
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center py-1">
            <div className="w-full border-t border-white/10" />
            <span className="absolute px-3 bg-[#0B111B] text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">
              və ya e-poçt ilə
            </span>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-800 text-rose-300 text-xs text-center font-medium">
              {error}
            </div>
          )}

          {/* Optional config guidance if Google Client ID is not configured yet */}
          {configTip && (
            <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-800/60 text-amber-200 text-[11px] space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-[#F6E09E]">
                <AlertCircle className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Google OAuth Tənzimləməsi:</span>
              </div>
              <p className="text-neutral-300">
                Google Cloud Console-da (OAuth 2.0 Client IDs) Authorized Redirect URI olaraq bu ünvanı təyin edin:
              </p>
              <div className="p-1.5 rounded bg-black/60 border border-white/10 font-mono text-[10px] break-all select-all text-[#F6E09E]">
                {configTip.callbackUrl}
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'register' && (
              <div>
                <label className="block text-[11px] font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                  Ad və Soyad
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Məsələn: Rəşad Əliyev"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-neutral-500 text-xs sm:text-sm focus:border-[#D4AF37] focus:outline-none transition-colors"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                E-poçt ünvanı
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  placeholder="adiniz@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-neutral-500 text-xs sm:text-sm focus:border-[#D4AF37] focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                Şifrə
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-neutral-500 text-xs sm:text-sm focus:border-[#D4AF37] focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || googleLoading}
              id="auth-submit-btn"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#F6E09E] via-[#D4AF37] to-[#B88E1D] text-neutral-950 font-bold text-xs sm:text-sm hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_4px_16px_rgba(212,175,55,0.3)] mt-2 cursor-pointer disabled:opacity-60"
            >
              {loading ? 'Yoxlanılır...' : mode === 'login' ? 'Daxil ol' : 'Qeydiyyatı Tamamla'}
            </button>
          </form>

          {/* Toggle Mode */}
          <div className="pt-2 text-center text-xs text-neutral-400">
            {mode === 'login' ? (
              <span>
                Hesabınız yoxdur?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setAuthModalMode('register');
                    setError(null);
                  }}
                  className="text-[#F6E09E] font-bold hover:underline cursor-pointer ml-1"
                >
                  Qeydiyyatdan keçin
                </button>
              </span>
            ) : (
              <span>
                Artıq hesabınız var?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setAuthModalMode('login');
                    setError(null);
                  }}
                  className="text-[#F6E09E] font-bold hover:underline cursor-pointer ml-1"
                >
                  Daxil olun
                </button>
              </span>
            )}
          </div>

          {/* Security Guarantee Notice */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-center gap-1.5 text-[10px] text-neutral-400 text-center">
            <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37] flex-shrink-0" />
            <span>Veyra Invest 256-bit SSL & İnvestisiya Zəmanəti ilə qorunur.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

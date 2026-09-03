import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { VeyraLogo } from './VeyraLogo';
import { X, Mail, Lock, User, ArrowRight, ShieldCheck, Eye, EyeOff } from 'lucide-react';

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
  const [error, setError] = useState<string | null>(null);

  const [showGoogleChooser, setShowGoogleChooser] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [customGoogleName, setCustomGoogleName] = useState('');

  // Synchronize internal mode with context state when modal opens
  useEffect(() => {
    if (isAuthModalOpen) {
      setMode(authModalMode || 'login');
      setError(null);
    }
  }, [isAuthModalOpen, authModalMode]);

  if (!isAuthModalOpen) return null;

  const handleSelectGoogleAccount = async (accountEmail: string, accountName: string) => {
    setLoading(true);
    setError(null);
    try {
      const success = await loginWithGoogle(accountEmail, accountName);
      if (!success) {
        setError('Google hesabı ilə daxil olmaq mümkün olmadı.');
      } else {
        setIsAuthModalOpen(false);
      }
    } catch {
      setError('Giriş zamanı xəta baş verdi.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    setShowGoogleChooser(true);
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
        const ok = await loginWithEmail(cleanEmail, cleanPassword);
        if (!ok) {
          setError('E-poçt və ya şifrə yanlışdır.');
        } else {
          setIsAuthModalOpen(false);
        }
      } else {
        const cleanName = fullName.trim();
        if (!cleanName) {
          setError('Zəhmət olmasa ad və soyadınızı daxil edin.');
          setLoading(false);
          return;
        }
        const ok = await registerWithEmail(cleanName, cleanEmail, cleanPassword);
        if (!ok) {
          setError('Qeydiyyat zamanı xəta baş verdi.');
        } else {
          setIsAuthModalOpen(false);
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
        {!showGoogleChooser && (
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
        )}

        {/* Google Account Chooser View */}
        {showGoogleChooser ? (
          <div className="space-y-4 relative z-10">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mx-auto mb-2 shadow-md">
                <svg width="24" height="24" viewBox="0 0 24 24">
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
              </div>
              <h4 className="text-base font-bold text-white">Google ilə Hesabınızı Seçin</h4>
              <p className="text-xs text-neutral-400 mt-1">
                Təhlükəsiz keçid üçün Google hesabınızla daxil olun
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-800 text-rose-300 text-xs text-center">
                {error}
              </div>
            )}

            {/* Default Verified Google User Account */}
            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => handleSelectGoogleAccount('ravidagayev3169@gmail.com', 'Ravid Ağayev')}
                disabled={loading}
                className="w-full p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-[#D4AF37]/50 hover:border-[#D4AF37] flex items-center justify-between transition-all group text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B88E1D] text-neutral-950 font-bold flex items-center justify-center text-sm shadow-md">
                    R
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-white group-hover:text-[#F6E09E]">
                        Ravid Ağayev
                      </span>
                      <span className="px-1.5 py-0.2 rounded text-[9px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Doğrulanmış
                      </span>
                    </div>
                    <span className="text-xs text-neutral-400">ravidagayev3169@gmail.com</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-[#D4AF37] group-hover:translate-x-1 transition-all" />
              </button>

              {/* Custom Google Account Section */}
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2.5">
                <span className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider block">
                  Və ya başqa Google ünvanı:
                </span>
                <input
                  type="text"
                  placeholder="Ad və Soyad"
                  value={customGoogleName}
                  onChange={(e) => setCustomGoogleName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-xs text-white placeholder-neutral-500 focus:border-[#D4AF37] focus:outline-none"
                />
                <input
                  type="email"
                  placeholder="adiniz@gmail.com"
                  value={customGoogleEmail}
                  onChange={(e) => setCustomGoogleEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-xs text-white placeholder-neutral-500 focus:border-[#D4AF37] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!customGoogleEmail) {
                      setError('Zəhmət olmasa Gmail ünvanınızı daxil edin');
                      return;
                    }
                    handleSelectGoogleAccount(customGoogleEmail, customGoogleName || customGoogleEmail.split('@')[0]);
                  }}
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#F6E09E] to-[#D4AF37] text-neutral-950 font-bold text-xs flex items-center justify-center gap-2 transition-all hover:brightness-110 active:scale-[0.98]"
                >
                  <span>{loading ? 'Daxil olunur...' : 'Bu Hesabla Daxil Ol'}</span>
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowGoogleChooser(false)}
              className="w-full py-2 text-center text-xs text-neutral-400 hover:text-white transition-colors"
            >
              ← Şifrə ilə giriş formuna qayıt
            </button>
          </div>
        ) : (
          <div className="space-y-4 relative z-10">
            {/* Google Authentication Button */}
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={loading}
              id="auth-google-btn"
              className="w-full py-3 px-4 rounded-xl bg-white hover:bg-neutral-100 text-neutral-900 font-bold text-xs sm:text-sm flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-md"
            >
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
              <span>Google ilə sürətli daxil ol</span>
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
                    placeholder="adiniz@gmail.com"
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
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                id="auth-submit-btn"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#F6E09E] via-[#D4AF37] to-[#B88E1D] text-neutral-950 font-bold text-xs sm:text-sm hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_4px_16px_rgba(212,175,55,0.3)] mt-2 cursor-pointer"
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
        )}
      </div>
    </div>
  );
};

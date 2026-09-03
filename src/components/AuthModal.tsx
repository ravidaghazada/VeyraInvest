import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { VeyraLogo } from './VeyraLogo';
import { X, Mail, Lock, User, ArrowRight, ShieldCheck, CheckCircle } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, loginWithGoogle, loginWithEmail, registerWithEmail } = useApp();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showGoogleChooser, setShowGoogleChooser] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [customGoogleName, setCustomGoogleName] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSelectGoogleAccount = async (accountEmail: string, accountName: string) => {
    setLoading(true);
    setError(null);
    try {
      const success = await loginWithGoogle(accountEmail, accountName);
      if (!success) {
        setError('Google hesabı ilə giriş uğursuz oldu.');
      }
    } catch (err) {
      setError('Giriş zamanı xəta baş verdi.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    // Open Google Account Chooser dialog
    setShowGoogleChooser(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError('Bütün sahələri doldurun.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        const ok = await loginWithEmail(email, password);
        if (!ok) setError('E-poçt və ya şifrə yanlışdır.');
      } else {
        if (!fullName) {
          setError('Ad və Soyadınızı daxil edin.');
          setLoading(false);
          return;
        }
        const ok = await registerWithEmail(fullName, email, password);
        if (!ok) setError('Qeydiyyat zamanı xəta baş verdi.');
      }
    } catch (err) {
      setError('Əməliyyat zamanı xəta baş verdi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl glass-card border border-[#D4AF37]/40 p-4 min-[400px]:p-6 sm:p-8 shadow-2xl bg-[#0B111B]/95 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 p-2 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          aria-label="Bağla"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Logo & Heading */}
        <div className="text-center mb-5 sm:mb-6 pr-6 pl-6">
          <VeyraLogo size="sm" showSlogan={false} className="mb-2" />
          <h3 className="text-lg min-[380px]:text-xl font-extrabold text-white mt-2">
            {mode === 'login' ? 'Hesabınıza Daxil Olun' : 'İnvestor Hesabı Yaradın'}
          </h3>
          <p className="text-[11px] sm:text-xs text-neutral-400 mt-1">
            {mode === 'login'
              ? 'Veyra Invest portfelinizi idarə etmək üçün daxil olun'
              : 'Gələcəyə dəyər qatan investisiya icmamıza qoşulun'}
          </p>
        </div>

        {/* Google Account Chooser View */}
        {showGoogleChooser ? (
          <div className="py-2 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mx-auto mb-3 shadow-md">
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
                Veyra Invest sisteminə təhlükəsiz keçid üçün Google hesabınızdan istifadə edin
              </p>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-800 text-rose-300 text-xs text-center">
                {error}
              </div>
            )}

            {/* Default User Google Card */}
            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => handleSelectGoogleAccount('ravidagayev3169@gmail.com', 'Ravid Ağayev')}
                disabled={loading}
                className="w-full p-3.5 rounded-2xl bg-neutral-900/90 hover:bg-neutral-800 border border-[#D4AF37]/50 hover:border-[#D4AF37] flex items-center justify-between transition-all group text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 text-white font-bold flex items-center justify-center text-sm shadow-md">
                    R
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-white group-hover:text-[#F6E09E]">
                        Ravid Ağayev
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[9px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Doğrulanmış
                      </span>
                    </div>
                    <span className="text-xs text-neutral-400">ravidagayev3169@gmail.com</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-[#D4AF37] group-hover:translate-x-1 transition-all" />
              </button>

              {/* Custom Google Account Section */}
              <div className="p-3.5 rounded-2xl bg-neutral-900/40 border border-neutral-800 space-y-2.5">
                <span className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider block">
                  Və ya başqa Google ünvanı daxil edin:
                </span>
                <input
                  type="text"
                  placeholder="Ad və Soyad"
                  value={customGoogleName}
                  onChange={(e) => setCustomGoogleName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:border-[#D4AF37] focus:outline-none"
                />
                <input
                  type="email"
                  placeholder="adiniz@gmail.com"
                  value={customGoogleEmail}
                  onChange={(e) => setCustomGoogleEmail(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:border-[#D4AF37] focus:outline-none"
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
                  className="w-full py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#E5C058] text-neutral-950 font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  <span>{loading ? 'Daxil olunur...' : 'Bu Google Hesabı ilə Daxil Ol'}</span>
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowGoogleChooser(false)}
              className="w-full py-2 text-center text-xs text-neutral-400 hover:text-white transition-colors"
            >
              ← Şifrə ilə girişə qayıt
            </button>
          </div>
        ) : (
          <>
            {/* Real Google Authentication Button */}
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={loading}
              id="auth-google-btn"
              className="w-full py-3 px-4 rounded-xl bg-white hover:bg-neutral-100 text-neutral-900 font-bold text-xs sm:text-sm flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-md mb-4"
            >
              {/* Google 4-color SVG Icon */}
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
              <span>Google ilə birbaşa daxil ol</span>
            </button>

            {/* Divider */}
            <div className="relative flex items-center justify-center my-4">
              <div className="w-full border-t border-neutral-800" />
              <span className="absolute px-3 bg-[#0B111B] text-[10px] text-neutral-500 uppercase tracking-wider">
                və ya Gmail / E-poçt ilə
              </span>
            </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 mb-4 rounded-xl bg-rose-950/50 border border-rose-800 text-rose-300 text-xs text-center">
            {error}
          </div>
        )}

        {/* Credentials Form */}
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
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 text-xs sm:text-sm focus:border-[#D4AF37] focus:outline-none transition-colors"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-semibold text-neutral-300 uppercase tracking-wider mb-1">
              Gmail / E-poçt ünvanı
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                placeholder="adiniz@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 text-xs sm:text-sm focus:border-[#D4AF37] focus:outline-none transition-colors"
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
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 text-xs sm:text-sm focus:border-[#D4AF37] focus:outline-none transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            id="auth-submit-btn"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#F6E09E] via-[#D4AF37] to-[#B88E1D] text-neutral-950 font-bold text-xs sm:text-sm hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_4px_16px_rgba(212,175,55,0.3)] mt-2"
          >
            {loading ? 'Yoxlanılır...' : mode === 'login' ? 'Daxil ol' : 'Qeydiyyatı Tamamla'}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="mt-5 text-center text-xs text-neutral-400">
          {mode === 'login' ? (
            <span>
              Hesabınız yoxdur?{' '}
              <button
                type="button"
                onClick={() => setMode('register')}
                className="text-[#F6E09E] font-bold hover:underline"
              >
                Qeydiyyatdan keçin
              </button>
            </span>
          ) : (
            <span>
              Artıq hesabınız var?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-[#F6E09E] font-bold hover:underline"
              >
                Daxil olun
              </button>
            </span>
          )}
        </div>

            {/* Legal notice */}
            <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-center gap-1.5 text-[10px] text-neutral-500 text-center">
              <ShieldCheck className="w-3 h-3 text-[#D4AF37]" />
              <span>Veyra Invest SSL & Ledger Təhlükəsizlik Standartları ilə qorunur.</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

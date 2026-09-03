import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { VeyraHomeVisualizer } from './VeyraHomeVisualizer';
import {
  Wallet,
  TrendingUp,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldCheck,
  Building,
  Clock,
  FileCheck,
  User,
  PlusCircle,
  AlertCircle,
  Sparkles,
  Layers,
  Lock,
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const {
    user,
    getUserHomeStage,
    getNextHomeStage,
    setIsDepositModalOpen,
    setIsWithdrawalModalOpen,
    loginWithGoogle,
    setIsAuthModalOpen,
    stages,
    depositRequests,
    withdrawalRequests,
    transactions: ledger,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'contracts' | 'history' | 'profile'>('overview');

  if (!user) {
    return (
      <div className="flex-1 min-h-[70vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-3xl glass-card border border-[#D4AF37]/40 bg-[#0B111B]/95 text-center shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center mx-auto mb-4 text-[#D4AF37]">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">İnvestor Kabineti</h2>
          <p className="text-xs text-neutral-400 mb-6 leading-relaxed">
            Şəxsi balansınızı, gündəlik gəlirlərinizi və Veyra Home layihənizi izləmək üçün hesabınıza daxil olun.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => loginWithGoogle()}
              className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-neutral-100 text-neutral-900 font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all active:scale-[0.98] shadow-md"
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Google ilə Sürətli Giriş</span>
            </button>
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="w-full py-3 px-4 rounded-xl bg-transparent border border-[#D4AF37]/50 text-[#F6E09E] font-bold text-xs hover:bg-[#D4AF37]/10 transition-all"
            >
              E-poçt və Şifrə ilə Daxil Ol
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentStage = getUserHomeStage();
  const { stage: nextStage, neededAmount } = getNextHomeStage();

  // User transactions
  const userLedger = ledger.filter((l) => l.userId === user.id);
  const userDeposits = depositRequests.filter((d) => d.userId === user.id);
  const userWithdrawals = withdrawalRequests.filter((w) => w.userId === user.id);

  // Weekly activity simulated dynamic values based on user's investment
  const weeklyActivity = [
    { day: 'B.E.', height: '40%', active: false, amount: '+1.20 AZN' },
    { day: 'Ç.A.', height: '65%', active: false, amount: '+1.85 AZN' },
    { day: 'Ç.', height: '50%', active: false, amount: '+1.50 AZN' },
    { day: 'C.A.', height: '85%', active: true, amount: '+2.40 AZN' },
    { day: 'C.', height: '70%', active: false, amount: '+2.10 AZN' },
    { day: 'Ş.', height: '95%', active: true, amount: '+2.90 AZN' },
    { day: 'B.', height: '60%', active: false, amount: '+1.75 AZN' },
  ];

  return (
    <div className="flex-1 p-4 sm:p-8 lg:p-10 max-w-7xl mx-auto w-full flex flex-col gap-8">
      {/* Top Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-[#D4AF37]/20 border border-[#D4AF37]/40 px-3 py-1 rounded-full text-[10px] font-bold text-[#F6E09E] uppercase tracking-widest mb-2">
            <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full animate-pulse" />
            Təsdiqlənmiş İnvestor Kabineti
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Xoş gəlmisiniz, <span className="text-[#F6E09E] font-serif">{user.name}</span>
          </h1>
          <p className="text-xs text-white/50 mt-0.5">
            {user.email} • ID: <span className="font-mono text-white/70">{user.id.slice(0, 10)}</span>
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsDepositModalOpen(true)}
            id="dash-deposit-btn"
            className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-[#D4AF37] text-[#070B11] font-bold text-xs uppercase tracking-wider hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_4px_16px_rgba(212,175,55,0.3)] flex items-center justify-center gap-2"
          >
            <PlusCircle className="w-4 h-4 stroke-[2.5]" />
            <span>Depozit et</span>
          </button>

          <button
            onClick={() => setIsWithdrawalModalOpen(true)}
            id="dash-withdraw-btn"
            className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-white/5 border border-white/20 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <ArrowUpRight className="w-4 h-4 text-[#D4AF37]" />
            <span>Vəsaiti çıxar</span>
          </button>
        </div>
      </div>

      {/* Main Immersive UI Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Left Column: Balance & Portfolio Dynamics (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Balance Card matching Immersive UI */}
          <div className="bg-gradient-to-br from-[#0E1624] to-[#070B11] border border-[#D4AF37]/30 rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 rounded-full -mr-16 -mt-16 blur-2xl" />
            
            <div>
              <p className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest mb-2">
                Ümumi Balans
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tighter text-white">
                {user.balance.toFixed(2)}{' '}
                <span className="text-base sm:text-lg font-light opacity-60 text-[#F6E09E]">AZN</span>
              </h2>

              <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-4 border-t border-white/5">
                <div>
                  <p className="text-[10px] text-white/40 uppercase mb-1">Ümumi Qazanc</p>
                  <p className="font-medium text-xs sm:text-sm text-[#F6E09E]">+{user.totalProfit.toFixed(2)} AZN</p>
                </div>
                <div>
                  <p className="text-[10px] text-white/40 uppercase mb-1">Yatırılan</p>
                  <p className="font-medium text-xs sm:text-sm text-emerald-400">{user.totalInvested.toFixed(2)} AZN</p>
                </div>
              </div>
            </div>

            <div className="flex gap-2.5 sm:gap-3 mt-6">
              <button
                onClick={() => setIsDepositModalOpen(true)}
                className="flex-1 bg-[#D4AF37] text-[#070B11] py-3 rounded-xl font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-[0_4px_16px_rgba(212,175,55,0.3)] transition-all min-h-[44px]"
              >
                Depozit
              </button>
              <button
                onClick={() => setIsWithdrawalModalOpen(true)}
                className="flex-1 border border-white/20 bg-white/5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-white/10 text-white transition-all min-h-[44px]"
              >
                Çıxarış
              </button>
            </div>
          </div>

          {/* Weekly Activity / Portfolio Tracker Card matching Immersive UI */}
          <div className="bg-[#0E1624]/60 border border-white/5 rounded-3xl p-5 sm:p-6 flex flex-col justify-between shadow-xl">
            <h3 className="text-xs sm:text-sm font-semibold mb-4 flex justify-between items-center text-white">
              <span>Həftəlik Portfel Dinamikası</span>
              <span className="text-[10px] text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-md font-bold whitespace-nowrap">
                +14.8% Bu həftə
              </span>
            </h3>

            {/* Dynamic Activity Bars */}
            <div className="h-36 sm:h-40 flex items-end justify-between gap-1 sm:gap-2 pt-4 px-1 sm:px-2">
              {weeklyActivity.map((bar, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 sm:gap-2 group relative">
                  <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity text-[9px] sm:text-[10px] bg-neutral-900 border border-white/10 px-1.5 py-0.5 rounded text-[#F6E09E] pointer-events-none whitespace-nowrap z-20">
                    {bar.amount}
                  </div>
                  <div className="w-full bg-white/5 rounded-t-md h-24 sm:h-28 flex items-end p-0.5">
                    <div
                      className={`w-full rounded-t-sm transition-all duration-500 group-hover:brightness-125 ${
                        bar.active
                          ? 'bg-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.4)]'
                          : 'bg-[#D4AF37]/35 group-hover:bg-[#D4AF37]/60'
                      }`}
                      style={{ height: bar.height }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between text-[9px] sm:text-[10px] text-white/40 uppercase font-bold mt-3 px-1 sm:px-2 border-t border-white/5 pt-2">
              {weeklyActivity.map((bar, idx) => (
                <span key={idx}>{bar.day}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Hero Stage Highlight & 4-Tier Preview (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Active Villa Stage Highlight Banner matching Immersive UI */}
          <div className="bg-[#0E1624]/40 border border-white/5 rounded-3xl p-5 sm:p-8 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
            <div className="absolute right-0 bottom-0 w-80 h-80 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

            <div className="z-10 max-w-md w-full text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-[#D4AF37]/20 border border-[#D4AF37]/40 px-3 py-1 rounded-full mb-3 sm:mb-4 text-[10px] font-bold text-[#F6E09E] uppercase tracking-widest">
                <span className="w-2 h-2 bg-[#D4AF37] rounded-full animate-pulse" />
                Mərhələ {currentStage.id} • {currentStage.badge}
              </div>

              <h3 className="text-2xl sm:text-4xl font-black mb-2 text-white italic tracking-tighter font-serif">
                {currentStage.name}
              </h3>
              <p className="text-white/60 text-xs sm:text-sm mb-4 sm:mb-5 leading-relaxed">
                {currentStage.description}
              </p>

              {/* Progress bar matching Immersive UI */}
              <div className="w-full bg-white/10 h-2 rounded-full mb-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#D4AF37] to-[#F6E09E] h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.max(15, (user.totalInvested / (nextStage?.minAmount || 1200)) * 100)
                    )}%`,
                  }}
                />
              </div>

              <div className="flex justify-between text-[10px] font-bold text-[#D4AF37] mb-5 sm:mb-6">
                <span>Mərhələ {currentStage.id}: {currentStage.minAmount} AZN</span>
                <span>
                  {nextStage
                    ? `Növbəti: ${nextStage.name} (${nextStage.minAmount} AZN)`
                    : 'Maksimum Səviyyə'}
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 sm:gap-3">
                <button
                  onClick={() => setActiveTab('overview')}
                  className="px-4 sm:px-5 py-2.5 rounded-xl bg-[#D4AF37] text-[#070B11] text-xs font-bold uppercase tracking-wider hover:brightness-110 shadow-[0_4px_16px_rgba(212,175,55,0.25)] transition-all min-h-[42px]"
                >
                  3D Modeli Aç
                </button>
                <button
                  onClick={() => setActiveTab('contracts')}
                  className="px-4 sm:px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-wider transition-all min-h-[42px]"
                >
                  Müqavilələr ({user.investments.length})
                </button>
              </div>
            </div>

            {/* Architectural 3D graphic badge from Immersive UI */}
            <div className="relative w-36 h-36 min-[380px]:w-44 min-[380px]:h-44 sm:w-52 sm:h-52 flex items-center justify-center flex-shrink-0">
              <div className="absolute inset-0 bg-[#D4AF37]/10 rounded-full blur-2xl" />
              <div className="w-full h-full rounded-3xl bg-gradient-to-tr from-[#1C283C] to-[#0A101A] border border-[#D4AF37]/40 p-4 sm:p-5 flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden group">
                <Building className="w-12 h-12 sm:w-16 sm:h-16 text-[#F6E09E] mb-2 drop-shadow-[0_0_20px_rgba(212,175,55,0.5)] group-hover:scale-110 transition-transform" />
                <span className="text-[9px] sm:text-[10px] uppercase font-bold text-[#D4AF37] tracking-widest truncate max-w-full">
                  {currentStage.stageTitle}
                </span>
                <span className="text-xs font-bold text-white mt-1">Mərhələ {currentStage.id} / 8</span>
              </div>
            </div>
          </div>

          {/* 4-Tier Quick Cards Grid from Immersive UI */}
          <div className="grid grid-cols-1 min-[380px]:grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5">
            {stages.slice(0, 4).map((stage) => {
              const isReached = currentStage.id >= stage.id;
              const isCurrent = currentStage.id === stage.id;

              return (
                <div
                  key={stage.id}
                  onClick={() => setActiveTab('overview')}
                  className={`cursor-pointer rounded-2xl p-3 sm:p-4 flex flex-col gap-1.5 sm:gap-2 transition-all relative ${
                    isCurrent
                      ? 'bg-gradient-to-br from-[#D4AF37] to-[#F6E09E] text-[#070B11] shadow-[0_10px_30px_rgba(212,175,55,0.3)]'
                      : isReached
                      ? 'bg-[#D4AF37]/10 border border-[#D4AF37]/40 text-white'
                      : 'bg-white/5 border border-white/10 text-white opacity-60 hover:opacity-100'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span
                      className={`text-[9px] font-extrabold uppercase tracking-wider ${
                        isCurrent ? 'text-[#070B11]/70' : 'text-white/40'
                      }`}
                    >
                      Mərhələ {stage.id}
                    </span>
                    {isCurrent && (
                      <span className="bg-[#070B11] text-[#F6E09E] text-[8px] font-bold px-1.5 py-0.5 rounded">
                        Aktiv
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-xs truncate">{stage.name}</h4>
                  <p
                    className={`text-[10px] ${
                      isCurrent ? 'text-[#070B11]/80 font-semibold' : 'text-white/40'
                    }`}
                  >
                    {stage.minAmount} AZN • %{stage.dailyProfitRate}/gün
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
            activeTab === 'overview'
              ? 'bg-[#D4AF37] text-[#070B11] font-bold shadow-md'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          Veyra Home 3D Vizualizatoru
        </button>

        <button
          onClick={() => setActiveTab('contracts')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
            activeTab === 'contracts'
              ? 'bg-[#D4AF37] text-[#070B11] font-bold shadow-md'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          Aktiv İnvestisiyalarım ({user.investments.length})
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
            activeTab === 'history'
              ? 'bg-[#D4AF37] text-[#070B11] font-bold shadow-md'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          Əməliyyat & Ledger Tarixçəsi
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
            activeTab === 'profile'
              ? 'bg-[#D4AF37] text-[#070B11] font-bold shadow-md'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          Profil & KYC Təhlükəsizlik
        </button>
      </div>

      {/* Tab 1: Overview with Architectural Home Visualizer */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <VeyraHomeVisualizer interactivePreview={true} />

          {/* Pending Requests Alert if any */}
          {userDeposits.filter((d) => d.status === 'pending').length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/40 flex items-start gap-3">
              <Clock className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-amber-200">
                  Təsdiq Gözləyən Depozit Sorğunuz Mövcuddur
                </h4>
                <p className="text-xs text-neutral-300 mt-0.5 leading-relaxed">
                  Ödəniş çekiniz və bank əməliyyat kodunuz admin heyəti tərəfindən yoxlanılır. Təsdiq edildikdə vəsait sərbəst balansınıza oturacaq və evinizin mərhələsi yenilənəcəkdir.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: User's Active Investments */}
      {activeTab === 'contracts' && (
        <div className="space-y-4">
          {user.investments.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-[#0E1624]/60 border border-white/5">
              <Layers className="w-12 h-12 text-white/30 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white mb-1">
                Aktiv investisiyanız yoxdur
              </h3>
              <p className="text-xs text-white/50 max-w-sm mx-auto mb-5">
                Veyra Home mərhələlərinə investisiya edərək gündəlik gəlir əldə etməyə başlayın.
              </p>
              <button
                onClick={() => setIsDepositModalOpen(true)}
                className="px-6 py-2.5 rounded-xl bg-[#D4AF37] text-[#070B11] font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-[0_4px_16px_rgba(212,175,55,0.3)] transition-all"
              >
                İnvestisiyaya Başla
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user.investments.map((inv) => (
                <div
                  key={inv.id}
                  className="p-5 rounded-2xl bg-[#0E1624]/60 border border-white/10 hover:border-[#D4AF37]/40 transition-colors space-y-3 shadow-lg"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#D4AF37] font-bold">
                        Mərhələ {inv.stageId}
                      </span>
                      <h4 className="text-base font-bold text-white">{inv.stageName}</h4>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-800">
                      Aktiv
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-white/5 text-xs">
                    <div>
                      <span className="text-[10px] text-white/40 block">Yatırım:</span>
                      <span className="font-bold text-white">{inv.amount} AZN</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-white/40 block">Gündəlik:</span>
                      <span className="font-bold text-emerald-400">%{inv.dailyRate}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-white/40 block">Qazanc:</span>
                      <span className="font-bold text-[#F6E09E]">+{inv.earnedTotal.toFixed(2)} AZN</span>
                    </div>
                  </div>

                  <div className="flex justify-between text-[11px] text-white/40 pt-1 border-t border-white/5">
                    <span>Başlama: {new Date(inv.startDate).toLocaleDateString('az-AZ')}</span>
                    <span>Bitmə: {new Date(inv.endDate).toLocaleDateString('az-AZ')}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Detailed Ledger & Transaction History matching Immersive UI */}
      {activeTab === 'history' && (
        <div className="space-y-6">
          <div className="rounded-3xl bg-[#0E1624]/60 border border-white/5 overflow-hidden shadow-xl">
            <div className="p-5 sm:p-6 border-b border-white/5 flex justify-between items-center">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider">
                  Maliyyə Jurnalı (Ledger)
                </h3>
                <p className="text-xs text-white/40">
                  Dəyişdirilməz real maliyyə qeydləri
                </p>
              </div>
              <span className="text-xs text-[#D4AF37] font-semibold">
                {userLedger.length} qeyd
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/5 text-white/40 uppercase tracking-wider text-[10px] border-b border-white/5">
                  <tr>
                    <th className="py-3 px-4">Tarix</th>
                    <th className="py-3 px-4">Növ</th>
                    <th className="py-3 px-4">Məbləğ</th>
                    <th className="py-3 px-4">Əvvəlki Balans</th>
                    <th className="py-3 px-4">Yekun Balans</th>
                    <th className="py-3 px-4">Təsvir</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-white/80">
                  {userLedger.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-white/40">
                        Hələ heç bir əməliyyat qeydə alınmayıb.
                      </td>
                    </tr>
                  ) : (
                    userLedger.map((item) => (
                      <tr key={item.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-3 px-4 whitespace-nowrap text-white/50">
                          {new Date(item.createdAt).toLocaleString('az-AZ')}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap font-bold">
                          {item.type === 'deposit' && <span className="text-emerald-400">Mədaxil (Depozit)</span>}
                          {item.type === 'withdrawal' && <span className="text-rose-400">Məxaric (Çıxarış)</span>}
                          {item.type === 'investment' && <span className="text-blue-400">İnvestisiya</span>}
                          {item.type === 'profit_distribution' && <span className="text-[#F6E09E]">Gəlir Ödənişi</span>}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap font-bold">
                          {item.amount > 0 ? `+${item.amount.toFixed(2)}` : item.amount.toFixed(2)} AZN
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap text-white/40">
                          {item.balanceBefore.toFixed(2)} AZN
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap font-semibold text-white">
                          {item.balanceAfter.toFixed(2)} AZN
                        </td>
                        <td className="py-3 px-4 text-white/70">
                          {item.description}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Profile & KYC */}
      {activeTab === 'profile' && (
        <div className="max-w-2xl mx-auto space-y-6 w-full">
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0E1624]/60 border border-white/5 space-y-5 shadow-xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <User className="w-4 h-4 text-[#D4AF37]" />
              İnvestor Profil Məlumatları
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <span className="text-white/40 block mb-1">Ad və Soyad:</span>
                <span className="font-bold text-white">{user.name}</span>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <span className="text-white/40 block mb-1">E-poçt / Gmail:</span>
                <span className="font-bold text-white truncate block">{user.email}</span>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <span className="text-white/40 block mb-1">Qeydiyyat Tarixi:</span>
                <span className="font-semibold text-white/80">
                  {new Date(user.createdAt).toLocaleDateString('az-AZ')}
                </span>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <span className="text-white/40 block mb-1">KYC Statusu:</span>
                <span className="font-bold text-emerald-400">
                  {user.kyc.isVerified ? '✓ Təsdiqlənib' : 'Gözləmədə'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

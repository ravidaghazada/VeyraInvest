import React from 'react';
import { useApp } from '../context/AppContext';
import { VeyraHomeStage } from '../types';
import { CountUpNumber } from './CountUpNumber';
import {
  Sparkles,
  Check,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Layers,
  Calendar,
  Zap,
} from 'lucide-react';

export const VeyraProducts: React.FC = () => {
  const { stages, user, investInStage, setIsDepositModalOpen, setSelectedDepositStageAmount, setActiveView } = useApp();
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);

  const handleInvest = (stage: VeyraHomeStage) => {
    if (!user) {
      setSelectedDepositStageAmount(stage.minAmount);
      setIsDepositModalOpen(true);
      return;
    }

    if (user.balance >= stage.minAmount) {
      const res = investInStage(stage.id, stage.minAmount);
      setSuccessMsg(res.message);
      setTimeout(() => setSuccessMsg(null), 4000);
    } else {
      setSelectedDepositStageAmount(stage.minAmount);
      setIsDepositModalOpen(true);
    }
  };

  return (
    <section className="w-full py-10 sm:py-16 lg:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Feedback Toast */}
      {successMsg && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#0E1624] border border-[#D4AF37] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <Sparkles className="w-5 h-5 text-[#D4AF37]" />
          <span className="text-xs sm:text-sm font-semibold">{successMsg}</span>
          <button
            onClick={() => {
              setActiveView('dashboard');
              setSuccessMsg(null);
            }}
            className="ml-2 text-xs font-bold text-[#F6E09E] underline hover:text-white"
          >
            Kabinetə keç
          </button>
        </div>
      )}

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#D4AF37]/15 text-[#F6E09E] border border-[#D4AF37]/30 mb-3">
          <Layers className="w-3.5 h-3.5 text-[#D4AF37]" />
          8 İnvestisiya Məhsulu • Sabit Gəlirlilik
        </div>
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
          <span className="gold-gradient-text font-serif">Veyra</span> İnvestisiya Məhsulları & Portfeli
        </h1>
        <p className="text-xs sm:text-base text-neutral-300 mt-2.5 sm:mt-3 max-w-2xl mx-auto leading-relaxed">
          Təməldən Elite Villayadək hər bir məhsul real daşınmaz əmlak aktivlərinə əsaslanır. Şəffaf gündəlik və aylıq gəlir dərəcələri ilə kapitalınızı artırın.
        </p>
      </div>

      {/* Grid of 8 stages with staggered smooth entrance */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
        {stages.map((stage, idx) => {
          const isElite = stage.id === 8;
          const isLuxury = stage.id === 7;
          const isPrestige = stage.id === 6;

          // Exact daily and monthly income calculation
          const dailyIncome = stage.dailyIncome ?? Number(((stage.minAmount * (stage.dailyProfitRate || 6.0)) / 100).toFixed(2));
          const monthlyIncome = stage.monthlyIncome ?? Number((dailyIncome * 30).toFixed(0));

          return (
            <div
              key={stage.id}
              style={{
                animation: `cardEntrance 0.65s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 80}ms both`,
              }}
              className={`group relative rounded-3xl p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 cursor-pointer ${
                isElite
                  ? 'bg-gradient-to-b from-[#182334] via-[#0E1624] to-[#070B11] border-2 border-[#D4AF37] hover:border-[#F6E09E] shadow-[0_10px_35px_rgba(212,175,55,0.25)] hover:shadow-[0_15px_45px_rgba(212,175,55,0.4)] ring-1 ring-[#D4AF37]/50'
                  : isLuxury || isPrestige
                  ? 'bg-gradient-to-b from-[#131F31] via-[#0D1623] to-[#070B11] border border-[#D4AF37]/40 hover:border-[#D4AF37] shadow-xl hover:shadow-[0_12px_40px_rgba(212,175,55,0.25)]'
                  : 'bg-[#0E1624]/90 border border-neutral-800 hover:border-[#D4AF37] shadow-lg hover:shadow-[0_10px_35px_rgba(212,175,55,0.2)]'
              }`}
            >
              {/* Card Content Top */}
              <div>
                {/* Product Realistic Architectural Image */}
                <div className="relative w-full h-44 sm:h-48 rounded-2xl overflow-hidden mb-4 border border-white/10 group-hover:border-[#D4AF37]/60 transition-colors shadow-inner">
                  {stage.imageUrl ? (
                    <img
                      src={stage.imageUrl}
                      alt={stage.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-neutral-900 flex items-center justify-center text-neutral-600">
                      Veyra Real Estate
                    </div>
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#090E17] via-[#090E17]/35 to-transparent pointer-events-none" />

                  {/* Top Badges */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                    <span
                      className={`px-2.5 py-1 rounded-xl text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 shadow-md ${
                        isElite
                          ? 'bg-[#D4AF37] text-neutral-950 font-black'
                          : isPrestige || isLuxury
                          ? 'bg-[#0E1624]/90 text-[#F6E09E] border border-[#D4AF37]/50 backdrop-blur-md'
                          : 'bg-neutral-950/90 text-neutral-200 border border-neutral-700/80 backdrop-blur-md'
                      }`}
                    >
                      {isElite && <Sparkles className="w-3 h-3 text-neutral-950 fill-neutral-950" />}
                      Məhsul {stage.id} • {stage.badge}
                    </span>

                    <span className="px-2 py-0.5 rounded-lg text-[10px] text-neutral-200 font-semibold bg-black/75 backdrop-blur-md border border-white/10 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#D4AF37]" />
                      {stage.durationDays || 30} Gün
                    </span>
                  </div>

                  {/* Bottom Image Overlay Info */}
                  <div className="absolute bottom-2.5 left-3 right-3 pointer-events-none">
                    <span className="text-[10px] font-extrabold text-[#D4AF37] uppercase tracking-wider block drop-shadow-md">
                      {stage.stageTitle}
                    </span>
                    <h3 className="text-lg font-black text-white group-hover:text-[#F6E09E] transition-colors drop-shadow-md">
                      {stage.name}
                    </h3>
                  </div>
                </div>

                {/* Investment Amount Display */}
                <div className="mb-4 pb-3.5 border-b border-neutral-800/80 flex items-baseline justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block mb-0.5">
                      İnvestisiya Məbləği
                    </span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl font-black text-white group-hover:text-[#FFF4D4] transition-colors font-sans">
                        {stage.minAmount}
                      </span>
                      <span className="text-sm font-extrabold text-[#D4AF37]">AZN</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[9px] uppercase font-bold tracking-wider text-neutral-400 block mb-0.5">
                      Gündəlik Nisbət
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-xs font-extrabold text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 inline-flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      %{stage.dailyProfitRate || 6.0}
                    </span>
                  </div>
                </div>

                {/* ======================================================== */}
                {/* AYRICA PREMİUM GƏLİR BLOKU (GÜNDƏLİK & AYLIQ BİRGƏ) */}
                {/* ======================================================== */}
                <div className="rounded-2xl p-3 sm:p-3.5 bg-gradient-to-br from-[#0F1829]/95 via-[#0A111E]/95 to-[#060A12]/95 border border-[#D4AF37]/35 shadow-[0_4px_20px_rgba(0,0,0,0.5)] relative overflow-hidden group-hover:border-[#D4AF37] group-hover:shadow-[0_0_25px_rgba(212,175,55,0.22)] transition-all duration-300 mb-4">
                  {/* Subtle top light bar */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />

                  <div className="grid grid-cols-2 gap-2.5 divide-x divide-[#D4AF37]/25">
                    {/* GÜNDƏLİK GƏLİR */}
                    <div className="pr-1 flex flex-col justify-center">
                      <span className="text-[9px] min-[380px]:text-[10px] font-black uppercase tracking-wider text-neutral-300 mb-0.5 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 text-[#D4AF37] flex-shrink-0" />
                        <span className="truncate">Gündəlik Gəlir</span>
                      </span>
                      <div className="flex items-baseline gap-1 mt-0.5">
                        <span className="text-xl min-[380px]:text-2xl font-black text-emerald-400 group-hover:drop-shadow-[0_0_10px_rgba(52,211,153,0.55)] transition-all font-sans">
                          <CountUpNumber value={dailyIncome} decimals={2} />
                        </span>
                        <span className="text-[11px] font-extrabold text-emerald-300">AZN</span>
                      </div>
                      <span className="text-[8.5px] text-neutral-400 mt-0.5 font-medium">Hər 24 saatda</span>
                    </div>

                    {/* AYLIQ GƏLİR */}
                    <div className="pl-2.5 flex flex-col justify-center">
                      <span className="text-[9px] min-[380px]:text-[10px] font-black uppercase tracking-wider text-[#D4AF37] mb-0.5 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-[#F6E09E] flex-shrink-0" />
                        <span className="truncate">Aylıq Gəlir</span>
                      </span>
                      <div className="flex items-baseline gap-1 mt-0.5">
                        <span className="text-xl min-[380px]:text-2xl font-black text-[#F6E09E] group-hover:drop-shadow-[0_0_12px_rgba(246,224,158,0.65)] transition-all font-sans">
                          <CountUpNumber value={monthlyIncome} decimals={0} />
                        </span>
                        <span className="text-[11px] font-extrabold text-[#D4AF37]">AZN</span>
                      </div>
                      <span className="text-[8.5px] text-neutral-400 mt-0.5 font-medium">30 günlük dövr</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-neutral-300 leading-relaxed mb-3.5 line-clamp-2">
                  {stage.description}
                </p>

                {/* Features List */}
                <ul className="space-y-1.5 mb-5">
                  {stage.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-neutral-300">
                      <Check className="w-3.5 h-3.5 text-[#D4AF37] flex-shrink-0" />
                      <span className="truncate">{f}</span>
                    </li>
                  ))}
                  <li className="flex items-center gap-2 text-[11px] text-neutral-400">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span>0% Komissiya • Sərbəst Çıxarış</span>
                  </li>
                </ul>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleInvest(stage)}
                id={`product-card-btn-${stage.id}`}
                className={`w-full py-3 px-4 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer ${
                  isElite
                    ? 'bg-gradient-to-r from-[#F6E09E] via-[#D4AF37] to-[#B88E1D] text-neutral-950 hover:brightness-110 shadow-[0_4px_25px_rgba(212,175,55,0.45)]'
                    : 'bg-neutral-900 group-hover:bg-[#D4AF37] text-neutral-200 group-hover:text-neutral-950 border border-[#D4AF37]/35 group-hover:border-[#D4AF37] shadow-md'
                }`}
              >
                <span>İnvestisiya Et ({stage.minAmount} AZN)</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
};

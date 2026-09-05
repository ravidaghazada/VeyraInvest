import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CountUpNumber } from './CountUpNumber';
import {
  Calculator,
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

export const ProfitCalculator: React.FC = () => {
  const { stages, setIsDepositModalOpen, setSelectedDepositStageAmount } = useApp();

  const [selectedStageId, setSelectedStageId] = useState<number>(1); // Default to Veyra Start (25 AZN)
  const [durationDays, setDurationDays] = useState<number>(30);

  // Find currently selected stage
  const matchedStage = stages.find((s) => s.id === selectedStageId) || stages[0];
  const amount = matchedStage.minAmount;

  // Exact daily and monthly income matching product card exactly
  const dailyIncome = matchedStage.dailyIncome ?? Number(((amount * (matchedStage.dailyProfitRate || 6.0)) / 100).toFixed(2));
  const monthlyIncome = matchedStage.monthlyIncome ?? Number((dailyIncome * 30).toFixed(0));
  const periodTotalIncome = Number((dailyIncome * durationDays).toFixed(2));
  const totalReturn = Number((amount + periodTotalIncome).toFixed(2));
  const roiPercent = Number(((periodTotalIncome / amount) * 100).toFixed(1));

  const handleSelectProduct = (stageId: number) => {
    setSelectedStageId(stageId);
  };

  const handleStartWithAmount = () => {
    setSelectedDepositStageAmount(amount);
    setIsDepositModalOpen(true);
  };

  return (
    <section className="w-full py-8 sm:py-12 lg:py-16 max-w-5xl mx-auto px-3 sm:px-6">
      <div className="rounded-3xl glass-card border border-[#D4AF37]/35 p-4 min-[400px]:p-6 sm:p-10 shadow-2xl relative overflow-hidden bg-gradient-to-b from-[#0C1422] to-[#070B11]">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#D4AF37]/15 text-[#F6E09E] border border-[#D4AF37]/30 mb-3">
            <Calculator className="w-3.5 h-3.5 text-[#D4AF37]" />
            Məhsullarla Sinxronlaşdırılmış Kalkulyator
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
            İnteraktiv <span className="gold-gradient-text font-serif">Qazanc Kalkulyatoru</span>
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 mt-2">
            İstədiyiniz məhsulu seçin və real hesablanmış gündəlik və aylıq gəlir göstəricilərini dərhal görün.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          {/* Controls side */}
          <div className="lg:col-span-7 space-y-6">
            {/* 8 Products Direct Selection Grid */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  İnvestisiya Məhsulunu Seçin:
                </label>
                <span className="text-xs font-bold text-[#F6E09E]">
                  {matchedStage.name} ({matchedStage.minAmount} AZN)
                </span>
              </div>

              {/* Grid of 8 stages buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {stages.map((st) => {
                  const isSelected = st.id === selectedStageId;
                  return (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => handleSelectProduct(st.id)}
                      className={`p-2.5 rounded-2xl text-left transition-all border relative flex flex-col justify-between ${
                        isSelected
                          ? 'bg-gradient-to-b from-[#1E2C44] to-[#121B2B] border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.3)] ring-1 ring-[#D4AF37]'
                          : 'bg-neutral-900/80 border-neutral-800 hover:border-[#D4AF37]/50 hover:bg-[#121A28]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] text-neutral-400 font-semibold truncate block">
                          {st.name}
                        </span>
                        {isSelected && <CheckCircle2 className="w-3 h-3 text-[#D4AF37] flex-shrink-0" />}
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-base font-black text-white">{st.minAmount}</span>
                        <span className="text-[10px] font-bold text-[#D4AF37]">AZN</span>
                      </div>
                      <span className="text-[9px] text-emerald-400 font-bold mt-0.5">
                        +{st.dailyIncome ?? (st.minAmount * 0.06).toFixed(2)} ₼/gün
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Duration Selector */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                  İnvestisiya Müddəti:
                </label>
                <div className="px-3 py-1 rounded-xl bg-neutral-900 border border-neutral-800 text-xs sm:text-sm font-bold text-neutral-200">
                  {durationDays} Gün
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {[30, 60, 90, 180].map((days) => (
                  <button
                    key={days}
                    type="button"
                    onClick={() => setDurationDays(days)}
                    className={`py-2.5 rounded-xl text-xs font-bold transition-all border ${
                      durationDays === days
                        ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#F6E09E] shadow-sm'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    {days} Gün
                  </button>
                ))}
              </div>
            </div>

            {/* Matched Product Details Card */}
            <div className="p-3.5 rounded-2xl bg-neutral-900/90 border border-neutral-800/90 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#F6E09E] font-black text-sm flex-shrink-0">
                  {matchedStage.id}
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] text-neutral-400 uppercase tracking-wider block font-bold">
                    Seçilən Məhsul
                  </span>
                  <span className="text-sm font-extrabold text-white truncate block">
                    {matchedStage.name} – {matchedStage.stageTitle}
                  </span>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider block font-bold">
                  Gündəlik Nisbət
                </span>
                <span className="text-xs font-extrabold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                  %{matchedStage.dailyProfitRate || 6.0} / gün
                </span>
              </div>
            </div>
          </div>

          {/* Result Card side */}
          <div className="lg:col-span-5 p-5 sm:p-6 rounded-3xl bg-gradient-to-b from-[#111A2C] via-[#0D1523] to-[#070B11] border border-[#D4AF37]/50 shadow-2xl space-y-4">
            <div className="text-center pb-3 border-b border-neutral-800 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-[#F6E09E]">
                Maliyyə Nəticəsi
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#D4AF37]/20 text-[#F6E09E] border border-[#D4AF37]/40">
                {matchedStage.name}
              </span>
            </div>

            {/* ======================================================== */}
            {/* EXACT MATCHED PREMIUM GƏLİR BLOKU (KARTLA 100% EYNİ) */}
            {/* ======================================================== */}
            <div className="rounded-2xl p-3.5 bg-gradient-to-br from-[#0F1829] via-[#0A111E] to-[#060A12] border border-[#D4AF37]/40 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />

              <div className="grid grid-cols-2 gap-2 divide-x divide-[#D4AF37]/25">
                {/* GÜNDƏLİK GƏLİR */}
                <div className="pr-1 flex flex-col justify-center">
                  <span className="text-[10px] font-black uppercase tracking-wider text-neutral-300 mb-1 flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5 text-[#D4AF37]" />
                    Gündəlik Gəlir
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-emerald-400 font-sans">
                      <CountUpNumber value={dailyIncome} decimals={2} />
                    </span>
                    <span className="text-xs font-bold text-emerald-300">AZN</span>
                  </div>
                  <span className="text-[9px] text-neutral-400 mt-0.5 font-medium">Hər 24 saatda</span>
                </div>

                {/* AYLIQ GƏLİR */}
                <div className="pl-3 flex flex-col justify-center">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#D4AF37] mb-1 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#F6E09E]" />
                    Aylıq Gəlir
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-[#F6E09E] font-sans">
                      <CountUpNumber value={monthlyIncome} decimals={0} />
                    </span>
                    <span className="text-xs font-bold text-[#D4AF37]">AZN</span>
                  </div>
                  <span className="text-[9px] text-neutral-400 mt-0.5 font-medium">30 günlük dövr</span>
                </div>
              </div>
            </div>

            {/* Financial breakdown */}
            <div className="space-y-2.5 pt-1">
              <div className="flex justify-between items-center text-xs py-1 border-b border-neutral-800/60">
                <span className="text-neutral-400">İnvestisiya Məbləği:</span>
                <span className="font-extrabold text-white text-sm">{amount} AZN</span>
              </div>

              <div className="flex justify-between items-center text-xs py-1 border-b border-neutral-800/60">
                <span className="text-neutral-400">Seçilən Müddət ({durationDays} gün) Qazancı:</span>
                <span className="font-extrabold text-emerald-400 text-sm">
                  +<CountUpNumber value={periodTotalIncome} decimals={2} /> AZN
                </span>
              </div>

              <div className="pt-2 flex justify-between items-center">
                <div>
                  <span className="text-xs text-neutral-300 block font-bold">Yekun Qaytarılan Dəyər:</span>
                  <span className="text-[10px] text-neutral-500 font-normal">Əsas kapital + qazanc</span>
                </div>
                <div className="text-right">
                  <span className="text-xl font-black text-[#F6E09E] block">
                    <CountUpNumber value={totalReturn} decimals={2} /> AZN
                  </span>
                  <span className="text-xs text-emerald-400 font-extrabold block">
                    +{roiPercent}% ROI
                  </span>
                </div>
              </div>
            </div>

            {/* Trust badge */}
            <div className="text-[11px] text-neutral-400 leading-relaxed bg-neutral-900/60 p-2.5 rounded-xl border border-neutral-800 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Gəlirlər hər gün avtomatik hesablanır və istənilən vaxt komissiyasız çıxarıla bilər.</span>
            </div>

            <button
              onClick={handleStartWithAmount}
              id="calc-start-btn"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#F6E09E] via-[#D4AF37] to-[#B88E1D] text-neutral-950 font-black text-xs sm:text-sm hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_4px_25px_rgba(212,175,55,0.4)] flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{matchedStage.name} ilə Başla ({amount} AZN)</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

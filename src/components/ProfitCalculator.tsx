import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Calculator, Sparkles, ArrowRight, Info, ShieldCheck } from 'lucide-react';

export const ProfitCalculator: React.FC = () => {
  const { stages, setIsDepositModalOpen, setSelectedDepositStageAmount } = useApp();

  const [amount, setAmount] = useState<number>(250);
  const [durationDays, setDurationDays] = useState<number>(90);

  // Find corresponding stage rate for the chosen amount
  const matchedStage =
    [...stages]
      .filter((s) => s.isActive && amount >= s.minAmount)
      .sort((a, b) => b.minAmount - a.minAmount)[0] || stages[0];

  const dailyRate = matchedStage.dailyProfitRate; // e.g. 0.62%
  const dailyIncome = Number(((amount * dailyRate) / 100).toFixed(2));
  const monthlyIncome = Number((dailyIncome * 30).toFixed(2));
  const periodTotalIncome = Number((dailyIncome * durationDays).toFixed(2));
  const totalReturn = Number((amount + periodTotalIncome).toFixed(2));
  const roiPercent = Number(((periodTotalIncome / amount) * 100).toFixed(1));

  const presetAmounts = [25, 50, 100, 250, 500, 750, 1000, 1200];

  const handleStartWithAmount = () => {
    setSelectedDepositStageAmount(amount);
    setIsDepositModalOpen(true);
  };

  return (
    <section className="w-full py-8 sm:py-12 lg:py-16 max-w-5xl mx-auto px-3 sm:px-6">
      <div className="rounded-3xl glass-card border border-[#D4AF37]/30 p-4 min-[400px]:p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#D4AF37]/15 text-[#F6E09E] border border-[#D4AF37]/30 mb-3">
            <Calculator className="w-3.5 h-3.5 text-[#D4AF37]" />
            Şəffaf Maliyyə Modeli
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
            İnteraktiv <span className="gold-gradient-text font-serif">Qazanc Kalkulyatoru</span>
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 mt-2">
            İnvestisiya məbləğinizi və müddəti seçərək potensial mütənasib gəlirliliyinizi canlı olaraq hesablayın.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
          {/* Controls side */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6">
            {/* Amount Slider & Presets */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                  İnvestisiya Məbləği:
                </label>
                <div className="px-3 py-1 rounded-xl bg-neutral-900 border border-[#D4AF37]/40 text-base sm:text-lg font-black text-[#F6E09E]">
                  {amount} AZN
                </div>
              </div>

              {/* Slider */}
              <input
                type="range"
                min="25"
                max="1200"
                step="25"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
              />

              {/* Presets Grid */}
              <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-3">
                {presetAmounts.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setAmount(amt)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      amount === amt
                        ? 'bg-[#D4AF37] text-neutral-950 font-bold shadow-sm scale-105'
                        : 'bg-neutral-900/90 text-neutral-400 border border-neutral-800 hover:text-neutral-200 hover:border-neutral-700'
                    }`}
                  >
                    {amt} ₼
                  </button>
                ))}
              </div>
            </div>

            {/* Duration Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                  Müddət:
                </label>
                <div className="px-3 py-1 rounded-xl bg-neutral-900 border border-neutral-800 text-xs sm:text-sm font-bold text-neutral-200">
                  {durationDays} Gün
                </div>
              </div>

              <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                {[30, 60, 90, 180].map((days) => (
                  <button
                    key={days}
                    type="button"
                    onClick={() => setDurationDays(days)}
                    className={`py-2 rounded-xl text-[11px] sm:text-xs font-semibold transition-all border ${
                      durationDays === days
                        ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#F6E09E]'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    {days} Gün
                  </button>
                ))}
              </div>
            </div>

            {/* Stage Level Matching Alert */}
            <div className="p-3 sm:p-3.5 rounded-2xl bg-neutral-900/80 border border-neutral-800 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/15 flex items-center justify-center text-[#D4AF37] font-bold text-xs flex-shrink-0">
                  {matchedStage.id}
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Uyğun Məhsul</span>
                  <span className="text-xs font-bold text-[#F6E09E] truncate block">{matchedStage.name} ({matchedStage.stageTitle})</span>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40 whitespace-nowrap flex-shrink-0">
                %{dailyRate} / gün
              </span>
            </div>
          </div>

          {/* Result Card side */}
          <div className="lg:col-span-5 p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-[#0E1624] to-[#070B11] border border-[#D4AF37]/40 shadow-xl space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-400 text-center pb-2 border-b border-neutral-800">
              Gəlirlilik Hesabatı
            </h4>

            <div className="space-y-3">
              <div className="flex justify-between items-center py-1">
                <span className="text-xs text-neutral-400">Gündəlik Qazanc:</span>
                <span className="text-base font-bold text-[#F6E09E]">+{dailyIncome} AZN</span>
              </div>

              <div className="flex justify-between items-center py-1">
                <span className="text-xs text-neutral-400">Aylıq Proqnoz (30 gün):</span>
                <span className="text-base font-bold text-[#F6E09E]">+{monthlyIncome} AZN</span>
              </div>

              <div className="flex justify-between items-center py-1">
                <span className="text-xs text-neutral-400">Dövr üzrə Ümumi Qazanc:</span>
                <span className="text-lg font-extrabold text-emerald-400">+{periodTotalIncome} AZN</span>
              </div>

              <div className="pt-3 border-t border-neutral-800 flex justify-between items-center">
                <div>
                  <span className="text-xs text-neutral-400 block">Yekun Dəyər:</span>
                  <span className="text-[10px] text-neutral-500 font-normal">Əsas məbləğ + qazanc</span>
                </div>
                <div className="text-right">
                  <span className="text-xl sm:text-2xl font-black text-white">{totalReturn} AZN</span>
                  <span className="text-xs text-emerald-400 block font-semibold">+{roiPercent}% ROI</span>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="text-[10px] text-neutral-400 leading-relaxed bg-neutral-900/60 p-2.5 rounded-xl border border-neutral-800 flex items-start gap-2">
              <Info className="w-3.5 h-3.5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
              <span>
                Qeyd: Hesablamalar keçmiş və cari real investisiya göstəricilərinə əsaslanan indikativ modeldir. Zəmanətli və ya risksiz qazanc vədi deyil.
              </span>
            </div>

            <button
              onClick={handleStartWithAmount}
              id="calc-start-btn"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#F6E09E] via-[#D4AF37] to-[#B88E1D] text-neutral-950 font-extrabold text-xs sm:text-sm hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_4px_20px_rgba(212,175,55,0.35)] flex items-center justify-center gap-2"
            >
              <span>{amount} AZN ilə Başla</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

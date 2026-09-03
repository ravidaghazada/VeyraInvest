import React from 'react';
import { useApp } from '../context/AppContext';
import { VeyraHomeStage } from '../types';
import {
  Sparkles,
  Check,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Clock,
  Layers,
  Award,
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
          8-Mərhələli İnvestisiya Portfeli
        </div>
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white">
          <span className="gold-gradient-text font-serif">Veyra Home</span> Məhsulları
        </h2>
        <p className="text-xs sm:text-base text-neutral-300 mt-2.5 sm:mt-3 max-w-2xl mx-auto leading-relaxed">
          Təməldən başlayaraq Elite Villayadək hər bir mərhələ real daşınmaz əmlak və maliyyə aktivləri əsasında formalaşır.
        </p>
      </div>

      {/* Grid of 8 stages */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stages.map((stage) => {
          const isElite = stage.id === 8;
          const isPrestige = stage.id >= 6;

          return (
            <div
              key={stage.id}
              className={`relative rounded-3xl p-5 sm:p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 ${
                isElite
                  ? 'bg-gradient-to-b from-[#1C283C] via-[#0E1624] to-[#070B11] border-2 border-[#D4AF37] shadow-[0_10px_40px_rgba(212,175,55,0.3)] ring-1 ring-[#D4AF37]'
                  : isPrestige
                  ? 'bg-gradient-to-b from-[#121D2F] to-[#0A101A] border border-[#D4AF37]/40 shadow-xl'
                  : 'bg-[#0E1624]/80 border border-neutral-800 hover:border-[#D4AF37]/40 shadow-lg'
              }`}
            >
              {/* Special Badge on top */}
              <div className="flex items-center justify-between mb-4">
                <span
                  className={`px-3 py-1 rounded-xl text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 ${
                    isElite
                      ? 'bg-[#D4AF37] text-neutral-950 shadow-md'
                      : 'bg-neutral-900 border border-neutral-700 text-[#F6E09E]'
                  }`}
                >
                  {isElite && <Sparkles className="w-3 h-3" />}
                  Mərhələ {stage.id} • {stage.badge}
                </span>

                <span className="text-[10px] text-neutral-400 font-medium">
                  {stage.durationDays} Günlük
                </span>
              </div>

              {/* Title & Stage */}
              <div>
                <h3 className="text-xl font-extrabold text-white mb-1">
                  {stage.name}
                </h3>
                <p className="text-xs text-[#D4AF37] font-semibold mb-3">
                  {stage.stageTitle}
                </p>

                {/* Price block */}
                <div className="mb-4 pb-4 border-b border-neutral-800/80">
                  <span className="text-xs text-neutral-400 block mb-0.5">Minimum Məbləğ</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-white">{stage.minAmount}</span>
                    <span className="text-sm font-bold text-[#F6E09E]">AZN</span>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-2 mb-4 p-2.5 rounded-xl bg-neutral-900/90 border border-neutral-800/80">
                  <div>
                    <span className="text-[9px] text-neutral-400 uppercase tracking-wider block">Gündəlik Gəlir</span>
                    <span className="text-xs font-bold text-emerald-400">%{stage.dailyProfitRate}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-neutral-400 uppercase tracking-wider block">Risk Dərəcəsi</span>
                    <span className="text-xs font-bold text-neutral-200">{stage.riskLevel}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-neutral-300 leading-relaxed mb-4 line-clamp-2">
                  {stage.description}
                </p>

                {/* Features List */}
                <ul className="space-y-2 mb-6">
                  {stage.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-neutral-300">
                      <Check className="w-3.5 h-3.5 text-[#D4AF37] flex-shrink-0" />
                      <span className="truncate">{f}</span>
                    </li>
                  ))}
                  <li className="flex items-center gap-2 text-[11px] text-neutral-400">
                    <ShieldCheck className="w-3.5 h-3.5 text-neutral-500 flex-shrink-0" />
                    <span>0% Komissiya & Şəffaf Çıxarış</span>
                  </li>
                </ul>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleInvest(stage)}
                id={`product-card-btn-${stage.id}`}
                className={`w-full py-3 px-4 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
                  isElite
                    ? 'bg-gradient-to-r from-[#F6E09E] via-[#D4AF37] to-[#B88E1D] text-neutral-950 hover:brightness-110 shadow-[0_4px_20px_rgba(212,175,55,0.4)]'
                    : 'bg-neutral-900 hover:bg-[#D4AF37] hover:text-neutral-950 text-neutral-200 border border-[#D4AF37]/30 hover:border-[#D4AF37]'
                }`}
              >
                <span>İnvestisiya Et</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
};

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { VeyraHomeStage } from '../types';
import {
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  ShieldCheck,
  Check,
  Building,
  Layers,
  Award,
} from 'lucide-react';

interface VeyraHomeVisualizerProps {
  interactivePreview?: boolean;
}

export const VeyraHomeVisualizer: React.FC<VeyraHomeVisualizerProps> = ({
  interactivePreview = true,
}) => {
  const { user, stages, getUserHomeStage, getNextHomeStage, setIsDepositModalOpen, setSelectedDepositStageAmount } = useApp();

  const currentStage = getUserHomeStage();
  const { stage: nextStage, neededAmount } = getNextHomeStage();
  
  // Allow user to preview any stage visually or view their active stage
  const [previewStageId, setPreviewStageId] = useState<number>(currentStage.id);
  const activeStageDisplay = stages.find((s) => s.id === previewStageId) || currentStage;

  const totalInvested = user ? user.totalInvested : 0;
  const progressPercent = Math.min(100, Math.max(5, (totalInvested / 1200) * 100));

  const handleUpgradeClick = () => {
    if (nextStage) {
      setSelectedDepositStageAmount(neededAmount > 0 ? neededAmount : nextStage.minAmount);
      setIsDepositModalOpen(true);
    } else {
      setIsDepositModalOpen(true);
    }
  };

  return (
    <div className="w-full rounded-3xl glass-card border border-[#D4AF37]/30 p-6 sm:p-8 relative overflow-hidden shadow-2xl">
      {/* Ambient background glow */}
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-800/80">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#D4AF37]/15 text-[#F6E09E] border border-[#D4AF37]/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#D4AF37]" />
              Memarlıq Konsepti
            </span>
            <span className="text-xs text-neutral-400">
              Veyra Home Portfel Statusu
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
            <span className="gold-gradient-text font-serif">Veyra Home</span>
            <span className="text-sm font-semibold text-neutral-400 px-3 py-1 rounded-xl bg-neutral-900 border border-neutral-800">
              {currentStage.name}
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 mt-1">
            Eviniz hazırda <strong className="text-[#F6E09E] font-bold">{totalInvested.toFixed(2)} AZN</strong> səviyyəsindədir.
          </p>
        </div>

        {/* Upgrade Call to action */}
        {nextStage && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-neutral-900/80 p-3 sm:p-4 rounded-2xl border border-[#D4AF37]/20">
            <div>
              <p className="text-[11px] text-neutral-400">Növbəti Mərhələ:</p>
              <p className="text-xs font-bold text-[#F6E09E]">
                {nextStage.name} ({nextStage.minAmount} AZN)
              </p>
              <p className="text-[10px] text-amber-400/90 font-medium">
                Yüksəliş üçün {neededAmount.toFixed(2)} AZN tələb olunur
              </p>
            </div>
            <button
              onClick={handleUpgradeClick}
              id="home-upgrade-btn"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B88E1D] text-neutral-950 font-bold text-xs hover:brightness-110 active:scale-95 transition-all shadow-md flex items-center gap-1.5"
            >
              <span>Yüksəlt</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Main Architectural Stage Visualizer Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-8 items-center">
        {/* Visual Architectural Canvas (SVG 3D Perspective) */}
        <div className="lg:col-span-7 relative w-full h-[320px] sm:h-[380px] rounded-2xl bg-gradient-to-b from-[#0B121E] via-[#0E1624] to-[#070B11] border border-[#D4AF37]/25 overflow-hidden flex items-center justify-center p-4">
          {/* Subtle star / blueprint grid */}
          <div className="absolute inset-0 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

          {/* Dynamic Architectural SVG representing the active visualStage */}
          <svg
            viewBox="0 0 500 360"
            className="w-full h-full max-h-[340px] drop-shadow-[0_10px_35px_rgba(212,175,55,0.2)] transition-all duration-700"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="grassGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#12251B" />
                <stop offset="100%" stopColor="#08100C" />
              </linearGradient>
              <linearGradient id="concreteGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3A4758" />
                <stop offset="50%" stopColor="#4F5D71" />
                <stop offset="100%" stopColor="#2D3745" />
              </linearGradient>
              <linearGradient id="goldWall" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F6E09E" />
                <stop offset="50%" stopColor="#D4AF37" />
                <stop offset="100%" stopColor="#8C670D" />
              </linearGradient>
              <linearGradient id="glassWall" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFEAA7" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.15" />
              </linearGradient>
              <linearGradient id="poolGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#188C94" />
                <stop offset="100%" stopColor="#0A3C40" />
              </linearGradient>
            </defs>

            {/* Base Terrain Ground */}
            <polygon points="10,310 490,310 440,345 60,345" fill="url(#grassGrad)" stroke="#1F3628" strokeWidth="2" />

            {/* STAGE 1+: Təməl (Foundation) */}
            {activeStageDisplay.id >= 1 && (
              <g className="transition-opacity duration-500">
                {/* Heavy concrete foundation slab */}
                <polygon points="90,285 410,285 430,310 70,310" fill="url(#concreteGrad)" stroke="#68788D" strokeWidth="2" />
                {/* Foundation footings & rebars */}
                <line x1="120" y1="285" x2="120" y2="255" stroke="#D4AF37" strokeWidth="3" strokeDasharray="3 3" />
                <line x1="250" y1="285" x2="250" y2="255" stroke="#D4AF37" strokeWidth="3" strokeDasharray="3 3" />
                <line x1="380" y1="285" x2="380" y2="255" stroke="#D4AF37" strokeWidth="3" strokeDasharray="3 3" />
                {activeStageDisplay.id === 1 && (
                  <text x="250" y="275" textAnchor="middle" fill="#F6E09E" fontSize="12" fontWeight="bold" letterSpacing="2">
                    TƏMƏL MƏRHƏLƏSİ (25 AZN)
                  </text>
                )}
              </g>
            )}

            {/* STAGE 2+: Divarlar və Struktur (Walls) */}
            {activeStageDisplay.id >= 2 && (
              <g className="transition-opacity duration-500">
                {/* Ground floor structural pillars */}
                <rect x="110" y="200" width="22" height="85" fill="#202D3F" stroke="#D4AF37" strokeWidth="1.5" />
                <rect x="240" y="200" width="20" height="85" fill="#202D3F" stroke="#D4AF37" strokeWidth="1.5" />
                <rect x="368" y="200" width="22" height="85" fill="#202D3F" stroke="#D4AF37" strokeWidth="1.5" />
                {/* Wall partitions */}
                <rect x="132" y="215" width="108" height="70" fill="#152132" stroke="#3A4D67" strokeWidth="1" />
                <rect x="260" y="215" width="108" height="70" fill="#152132" stroke="#3A4D67" strokeWidth="1" />
              </g>
            )}

            {/* STAGE 3+: Konstruksiya və Pəncərələr (Growth) */}
            {activeStageDisplay.id >= 3 && (
              <g className="transition-opacity duration-500">
                {/* First floor ceiling slab */}
                <polygon points="100,195 400,195 415,205 85,205" fill="url(#concreteGrad)" stroke="#D4AF37" strokeWidth="1" />
                {/* Glass windows with warm golden glow */}
                <rect x="145" y="225" width="80" height="50" fill="url(#glassWall)" stroke="#D4AF37" strokeWidth="1.5" />
                <line x1="185" y1="225" x2="185" y2="275" stroke="#D4AF37" strokeWidth="1" opacity="0.6" />
                <rect x="275" y="225" width="80" height="50" fill="url(#glassWall)" stroke="#D4AF37" strokeWidth="1.5" />
                <line x1="315" y1="225" x2="315" y2="275" stroke="#D4AF37" strokeWidth="1" opacity="0.6" />
                {/* Main entrance door */}
                <rect x="235" y="235" width="30" height="50" fill="#0C1522" stroke="#F6E09E" strokeWidth="1.5" />
                <circle cx="260" cy="260" r="2" fill="#D4AF37" />
              </g>
            )}

            {/* STAGE 4+: 2-ci mərtəbə və Rezidensiya (Residence) */}
            {activeStageDisplay.id >= 4 && (
              <g className="transition-opacity duration-500">
                {/* 2nd floor body */}
                <polygon points="120,115 380,115 390,195 110,195" fill="#131F30" stroke="#D4AF37" strokeWidth="1.5" />
                {/* Panoramic glass terrace on 2nd floor */}
                <rect x="140" y="130" width="220" height="55" fill="url(#glassWall)" stroke="#D4AF37" strokeWidth="1" />
                <line x1="213" y1="130" x2="213" y2="185" stroke="#D4AF37" strokeWidth="1" opacity="0.5" />
                <line x1="286" y1="130" x2="286" y2="185" stroke="#D4AF37" strokeWidth="1" opacity="0.5" />
                {/* Modern flat cantilever roof */}
                <polygon points="90,105 410,105 425,118 75,118" fill="url(#goldWall)" stroke="#FFF2B2" strokeWidth="1" />
              </g>
            )}

            {/* STAGE 5+: Premium fasad, işıqlandırma və qaraj (Premium) */}
            {activeStageDisplay.id >= 5 && (
              <g className="transition-opacity duration-500">
                {/* Side attached garage */}
                <polygon points="40,230 110,215 110,285 40,295" fill="#1C2B40" stroke="#D4AF37" strokeWidth="1.5" />
                <rect x="48" y="240" width="54" height="48" fill="#0C1420" stroke="#5A7191" strokeWidth="1" />
                {/* Architectural exterior gold ambient lights */}
                <circle cx="95" cy="205" r="4" fill="#FFEAA7" className="animate-pulse" />
                <circle cx="405" cy="205" r="4" fill="#FFEAA7" className="animate-pulse" />
                <circle cx="120" cy="115" r="4" fill="#FFEAA7" className="animate-pulse" />
                <circle cx="380" cy="115" r="4" fill="#FFEAA7" className="animate-pulse" />
                {/* Light cones */}
                <polygon points="95,205 75,250 115,250" fill="#FFEAA7" fillOpacity="0.12" />
                <polygon points="405,205 385,250 425,250" fill="#FFEAA7" fillOpacity="0.12" />
              </g>
            )}

            {/* STAGE 6+: Prestige Villa & Hovuz (Prestige) */}
            {activeStageDisplay.id >= 6 && (
              <g className="transition-opacity duration-500">
                {/* Reflective swimming pool in front */}
                <polygon points="180,305 320,305 340,335 160,335" fill="url(#poolGrad)" stroke="#3ED2DE" strokeWidth="1.5" />
                <polygon points="185,310 315,310 330,330 170,330" fill="#20B2AA" fillOpacity="0.5" />
                {/* Garden manicured trees */}
                <circle cx="50" cy="290" r="14" fill="#1E4D30" stroke="#378254" strokeWidth="1.5" />
                <circle cx="450" cy="290" r="14" fill="#1E4D30" stroke="#378254" strokeWidth="1.5" />
              </g>
            )}

            {/* STAGE 7+: Luxury Villa & Landşaft (Luxury) */}
            {activeStageDisplay.id >= 7 && (
              <g className="transition-opacity duration-500">
                {/* Extended luxury wings and top penthouse terrace */}
                <polygon points="160,80 340,80 350,105 150,105" fill="#1C2B40" stroke="#D4AF37" strokeWidth="1.5" />
                <rect x="180" y="85" width="140" height="20" fill="url(#glassWall)" stroke="#FFEAA7" strokeWidth="1" />
                {/* Luxury garden pergolas */}
                <line x1="430" y1="250" x2="470" y2="250" stroke="#D4AF37" strokeWidth="2" />
                <line x1="430" y1="250" x2="430" y2="295" stroke="#D4AF37" strokeWidth="2" />
                <line x1="470" y1="250" x2="470" y2="295" stroke="#D4AF37" strokeWidth="2" />
              </g>
            )}

            {/* STAGE 8: Veyra Elite Villa - Ən Yüksək Səviyyə (Elite Villa) */}
            {activeStageDisplay.id >= 8 && (
              <g className="transition-opacity duration-700">
                {/* Golden Crown Halo Aura */}
                <circle cx="250" cy="60" r="50" fill="url(#goldWall)" fillOpacity="0.15" filter="blur(10px)" />
                {/* Elite gold crest atop */}
                <polygon points="250,55 242,70 258,70" fill="url(#goldWall)" stroke="#FFF" strokeWidth="0.5" />
                <text x="250" y="45" textAnchor="middle" fill="#F6E09E" fontSize="13" fontWeight="900" letterSpacing="3">
                  ELITE VILLA REZİDENSİYASI
                </text>
              </g>
            )}
          </svg>

          {/* Badge Overlay */}
          <div className="absolute top-4 left-4 px-3 py-1 rounded-xl bg-neutral-950/80 backdrop-blur-md border border-[#D4AF37]/40 text-xs font-bold text-[#F6E09E] flex items-center gap-1.5 shadow-lg">
            <Award className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Mərhələ {activeStageDisplay.id}: {activeStageDisplay.name}</span>
          </div>

          <div className="absolute bottom-4 right-4 px-3 py-1 rounded-xl bg-neutral-950/80 backdrop-blur-md border border-neutral-700 text-xs text-neutral-300 font-medium">
            Min. {activeStageDisplay.minAmount} AZN
          </div>
        </div>

        {/* Stage Specs & Info */}
        <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
                {activeStageDisplay.stageTitle}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-950/60 text-emerald-300 border border-emerald-800/60">
                Risk: {activeStageDisplay.riskLevel}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
              {activeStageDisplay.name}
            </h3>

            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mb-4">
              {activeStageDisplay.description}
            </p>

            {/* Financial attributes */}
            <div className="grid grid-cols-2 gap-2.5 p-3.5 rounded-2xl bg-neutral-900/90 border border-neutral-800 mb-4">
              <div>
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Gündəlik Gəlir</span>
                <span className="text-sm font-bold text-[#F6E09E]">%{activeStageDisplay.dailyProfitRate}</span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Müddət</span>
                <span className="text-sm font-bold text-neutral-200">{activeStageDisplay.durationDays} Gün</span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Komissiya</span>
                <span className="text-xs font-semibold text-emerald-400">{activeStageDisplay.commission}</span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Çıxarış</span>
                <span className="text-xs font-semibold text-neutral-300">Sərbəst</span>
              </div>
            </div>

            {/* Features bullet checklist */}
            <div className="space-y-1.5">
              {activeStageDisplay.features.map((feat, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-neutral-300">
                  <Check className="w-3.5 h-3.5 text-[#D4AF37] flex-shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action button */}
          <div className="pt-2">
            <button
              onClick={() => {
                setSelectedDepositStageAmount(activeStageDisplay.minAmount);
                setIsDepositModalOpen(true);
              }}
              id={`invest-stage-btn-${activeStageDisplay.id}`}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#F6E09E] via-[#D4AF37] to-[#B88E1D] text-neutral-950 font-bold text-xs sm:text-sm hover:brightness-110 active:scale-[0.98] transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <span>{activeStageDisplay.name} ilə Başla ({activeStageDisplay.minAmount} AZN)</span>
              <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>

      {/* 8-Stage Visual Progress Bar requested by user */}
      <div className="pt-6 border-t border-neutral-800/80">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#D4AF37]" />
            İnkişaf Mərhələləri
          </span>
          <span className="text-xs text-[#F6E09E] font-medium">
            {totalInvested.toFixed(0)} / 1200 AZN ({progressPercent.toFixed(0)}%)
          </span>
        </div>

        {/* Visual Line with Steppers */}
        <div className="relative w-full py-4">
          {/* Background track line */}
          <div className="absolute top-1/2 left-0 right-0 h-1.5 bg-neutral-800 -translate-y-1/2 rounded-full" />
          
          {/* Active progress fill */}
          <div
            className="absolute top-1/2 left-0 h-1.5 bg-gradient-to-r from-[#D4AF37] to-[#F6E09E] -translate-y-1/2 rounded-full transition-all duration-700 shadow-[0_0_10px_rgba(212,175,55,0.6)]"
            style={{ width: `${progressPercent}%` }}
          />

          {/* Stepper nodes for all 8 stages */}
          <div className="relative flex justify-between items-center w-full">
            {stages.map((st) => {
              const isPassed = totalInvested >= st.minAmount;
              const isSelected = previewStageId === st.id;
              const isCurrent = currentStage.id === st.id;

              return (
                <button
                  key={st.id}
                  onClick={() => setPreviewStageId(st.id)}
                  title={`${st.name} (${st.minAmount} AZN)`}
                  className="flex flex-col items-center group cursor-pointer focus:outline-none"
                >
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold transition-all duration-300 ${
                      isSelected
                        ? 'ring-4 ring-[#D4AF37]/40 scale-110 bg-[#D4AF37] text-neutral-950 font-black'
                        : isPassed
                        ? 'bg-[#D4AF37] text-neutral-950'
                        : 'bg-neutral-900 border border-neutral-700 text-neutral-400 group-hover:border-[#D4AF37]/50'
                    }`}
                  >
                    {st.id}
                  </div>
                  <span
                    className={`text-[9px] sm:text-[11px] mt-1 font-semibold whitespace-nowrap transition-colors ${
                      isSelected
                        ? 'text-[#F6E09E]'
                        : isPassed
                        ? 'text-neutral-200'
                        : 'text-neutral-500'
                    }`}
                  >
                    {st.minAmount} ₼
                  </span>
                  <span className="hidden md:inline text-[8px] text-neutral-400 truncate max-w-[55px]">
                    {st.name.replace('Veyra ', '')}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

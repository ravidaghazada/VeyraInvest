import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { VeyraLogo } from './VeyraLogo';
import {
  Shield,
  TrendingUp,
  Home,
  PieChart,
  Handshake,
  ArrowRight,
  Lock,
  Building2,
  Calculator,
  CheckCircle2,
  Sparkles,
  Layers,
  ChevronRight,
  Eye,
  FileCheck2,
} from 'lucide-react';
import luxuryNightVilla from '../assets/images/luxury_night_villa_1788416150040.jpg';

export const HeroSection: React.FC = () => {
  const { user, setActiveView, setIsAuthModalOpen, stages } = useApp();
  const [activeSlide, setActiveSlide] = useState(0);

  const handleStart = () => {
    if (user) {
      setActiveView('dashboard');
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const handleLogin = () => {
    if (user) {
      setActiveView('dashboard');
    } else {
      setIsAuthModalOpen(true);
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-[#070B11] text-white flex flex-col justify-between overflow-x-hidden selection:bg-[#D4AF37] selection:text-neutral-950">
      {/* Background ambient lighting effects */}
      <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-[#D4AF37]/15 via-[#0E1624]/10 to-transparent blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-150px] right-[-100px] w-[600px] h-[600px] bg-[#D4AF37]/5 rounded-full blur-[160px] pointer-events-none" />

      {/* ========================================================================= */}
      {/* 1. DESKTOP & TABLET WEB VIEW (Screens >= md / 768px): Full Web Application */}
      {/* ========================================================================= */}
      <div className="hidden md:block w-full">
        {/* Hero Section */}
        <section className="py-8 lg:py-16 px-6 lg:px-8 max-w-7xl mx-auto w-full relative z-10">
          <div className="grid grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center w-full">
            
            {/* Left Column: Headlines, 5 Badges, CTAs, Trust Points */}
            <div className="col-span-12 lg:col-span-7 flex flex-col justify-center space-y-6">
              
              {/* Top pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/35 w-fit">
                <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-widest text-[#F6E09E]">
                  Azərbaycanın İlk Rəqəmsal Əmlak İnvestisiya Ekosistemi
                </span>
              </div>

              {/* Main Title */}
              <div className="space-y-2.5">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-serif font-extrabold text-white tracking-tight leading-[1.15]">
                  <span className="text-[#F6E09E]">Veyra Home</span> ilə<br />
                  gələcəyə investisiya edin.
                </h1>
                <p className="text-sm sm:text-base lg:text-lg text-neutral-300 font-normal leading-relaxed max-w-xl">
                  Kiçik addımlarla başlayın, böyük gələcəyə sahib olun. Torpaq sahəsindən lüks villa açar təhvilinə qədər 4 şəffaf mərhələdə zəmanətli pay və gündəlik gəlir qazanın.
                </p>
              </div>

              {/* 5 Feature Badges (Horizontal Card Form) */}
              <div className="w-full py-3.5 px-4 rounded-2xl bg-[#0B111B]/85 backdrop-blur-md border border-[#D4AF37]/30 shadow-xl">
                <div className="grid grid-cols-5 gap-2 text-center items-center divide-x divide-white/5">
                  {/* 1. TƏHLÜKƏSİZ */}
                  <div className="flex flex-col items-center justify-center px-1 group">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#D4AF37]/10 group-hover:bg-[#D4AF37]/20 flex items-center justify-center mb-1.5 transition-colors">
                      <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4AF37] stroke-[1.8]" />
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-bold tracking-wider text-[#F6E09E] uppercase leading-tight">
                      TƏHLÜKƏSİZ
                    </span>
                  </div>

                  {/* 2. GƏLİRLİ */}
                  <div className="flex flex-col items-center justify-center px-1 group">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#D4AF37]/10 group-hover:bg-[#D4AF37]/20 flex items-center justify-center mb-1.5 transition-colors">
                      <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4AF37] stroke-[1.8]" />
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-bold tracking-wider text-[#F6E09E] uppercase leading-tight">
                      GƏLİRLİ
                    </span>
                  </div>

                  {/* 3. DAŞINMAZ ƏMLAK */}
                  <div className="flex flex-col items-center justify-center px-1 group">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#D4AF37]/10 group-hover:bg-[#D4AF37]/20 flex items-center justify-center mb-1.5 transition-colors">
                      <Home className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4AF37] stroke-[1.8]" />
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-bold tracking-wider text-[#F6E09E] uppercase leading-tight">
                      DAŞINMAZ ƏMLAK
                    </span>
                  </div>

                  {/* 4. DİVERSİFİKASİYA */}
                  <div className="flex flex-col items-center justify-center px-1 group">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#D4AF37]/10 group-hover:bg-[#D4AF37]/20 flex items-center justify-center mb-1.5 transition-colors">
                      <PieChart className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4AF37] stroke-[1.8]" />
                    </div>
                    <span className="text-[9px] sm:text-[10px] font-bold tracking-wider text-[#F6E09E] uppercase leading-tight">
                      DİVERSİFİKASİYA
                    </span>
                  </div>

                  {/* 5. ETİBARLI */}
                  <div className="flex flex-col items-center justify-center px-1 group">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#D4AF37]/10 group-hover:bg-[#D4AF37]/20 flex items-center justify-center mb-1.5 transition-colors">
                      <Handshake className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4AF37] stroke-[1.8]" />
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-bold tracking-wider text-[#F6E09E] uppercase leading-tight">
                      ETİBARLI
                    </span>
                  </div>
                </div>
              </div>

              {/* Desktop Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <button
                  onClick={handleStart}
                  id="desktop-hero-start-btn"
                  className="py-3.5 sm:py-4 px-7 sm:px-8 rounded-2xl bg-gradient-to-r from-[#F6E09E] via-[#D4AF37] to-[#C99E2A] text-[#070B11] font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-[0_8px_30px_rgba(212,175,55,0.4)] hover:brightness-105 active:scale-[0.98] transition-all"
                >
                  <span>İnvestisiyaya Başla</span>
                  <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                </button>

                <button
                  onClick={handleLogin}
                  id="desktop-hero-login-btn"
                  className="py-3.5 sm:py-4 px-6 sm:px-7 rounded-2xl bg-[#0B111B]/80 hover:bg-[#121B2B] text-[#F6E09E] font-bold text-sm sm:text-base border border-[#D4AF37]/40 hover:border-[#D4AF37] transition-all active:scale-[0.98]"
                >
                  Daxil Ol
                </button>

                <button
                  onClick={() => setActiveView('calculator')}
                  className="py-3.5 sm:py-4 px-5 rounded-2xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors border border-white/10"
                >
                  <Calculator className="w-4 h-4 text-[#D4AF37]" />
                  <span>Qazancı Hesabla</span>
                </button>
              </div>

              {/* Key Trust Highlights */}
              <div className="grid grid-cols-3 gap-3 pt-3 border-t border-white/10 text-xs">
                <div className="flex items-center gap-2 text-neutral-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>100% Hüquqi Müqavilə</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Günlük Faiz Gəlirləri</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Kapital Bank ilə Depozit</span>
                </div>
              </div>

            </div>

            {/* Right Column: Luxury Villa Architectural Feature Card with Floating Tags */}
            <div className="col-span-12 lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden border border-[#D4AF37]/40 shadow-[0_20px_50px_rgba(0,0,0,0.8)] group bg-[#0E1624]">
                {/* Image with subtle hover zoom */}
                <div className="relative w-full h-[380px] lg:h-[460px] xl:h-[490px] overflow-hidden">
                  <img
                    src={luxuryNightVilla}
                    alt="Veyra Invest Luxury Villa"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#070B11] via-transparent to-[#070B11]/30" />
                  <div className="absolute inset-0 bg-gradient-to-b from-[#070B11]/40 via-transparent to-transparent" />
                </div>

                {/* Floating Top Badge */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                  <div className="px-3.5 py-1.5 rounded-xl bg-[#070B11]/85 backdrop-blur-md border border-[#D4AF37]/40 flex items-center gap-2 shadow-lg">
                    <Building2 className="w-4 h-4 text-[#D4AF37]" />
                    <span className="text-xs font-bold text-white">Veyra Home #1 Villa</span>
                  </div>
                  <div className="px-3 py-1.5 rounded-xl bg-emerald-500/20 backdrop-blur-md border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5 shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>Canlı Layihə</span>
                  </div>
                </div>

                {/* Floating Bottom Card */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-[#0B111B]/90 backdrop-blur-md border border-white/10 shadow-xl space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-400">Torpaq & Tikinti Fondu:</span>
                    <span className="text-[#F6E09E] font-bold">10,000 AZN Hədəf</span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-amber-500 to-[#D4AF37] rounded-full w-[74.5%]" />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-0.5">
                    <span>Toplanan: <strong className="text-white">7,450 AZN</strong> (74.5%)</span>
                    <span className="text-emerald-400 font-semibold">+14.5% İllik Gəlir</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* 4 Construction Stages Overview Grid on Web */}
        <section className="py-12 px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
            <div>
              <span className="text-xs uppercase font-bold text-[#D4AF37] tracking-widest block mb-1">
                Şəffaf və Pilləli İnvestisiya
              </span>
              <h2 className="text-2xl lg:text-3xl font-bold font-serif text-white">
                Veyra Home <span className="text-[#F6E09E]">Tikinti Mərhələləri</span>
              </h2>
            </div>
            <button
              onClick={() => setActiveView('products')}
              className="mt-3 sm:mt-0 text-xs text-[#D4AF37] hover:text-[#F6E09E] font-semibold flex items-center gap-1 transition-colors"
            >
              <span>Bütün Mərhələlərə Bax</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {stages.map((stage, idx) => (
              <div
                key={stage.id}
                onClick={() => setActiveView('products')}
                className="cursor-pointer p-5 rounded-2xl bg-[#0E1624]/70 hover:bg-[#0E1624] border border-white/10 hover:border-[#D4AF37]/50 transition-all duration-300 group shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-8 h-8 rounded-lg bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-xs font-bold text-[#F6E09E]">
                      0{idx + 1}
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      {stage.roi}% Gəlir
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-[#F6E09E] transition-colors mb-1">
                    {stage.name}
                  </h3>
                  <p className="text-xs text-neutral-400 line-clamp-2 mb-4 leading-relaxed">
                    {stage.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                  <span className="text-neutral-400">Min. İnvestisiya:</span>
                  <span className="font-bold text-[#F6E09E]">{stage.minInvestment} AZN</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Interactive Features Quick Access Section */}
        <section className="py-12 px-6 lg:px-8 max-w-7xl mx-auto w-full mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 3D Visualizer Teaser Card */}
            <div
              onClick={() => setActiveView('visualizer')}
              className="cursor-pointer p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0B111B] to-[#121B2B] border border-[#D4AF37]/30 hover:border-[#D4AF37] transition-all shadow-xl flex flex-col justify-between group"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] mb-4 group-hover:scale-110 transition-transform">
                  <Eye className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#F6E09E] transition-colors">
                  İnteraktiv 3D Veyra Home Vizualizatoru
                </h3>
                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed mb-6">
                  İnvestisiya etdiyiniz villanın torpaq sahəsindən daxili interyerinə və hovuzuna qədər hər bir detalını 3D formatda canlı izləyin.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#F6E09E]">
                <span>3D Modeli Aç</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Profit Calculator Teaser Card */}
            <div
              onClick={() => setActiveView('calculator')}
              className="cursor-pointer p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0B111B] to-[#121B2B] border border-[#D4AF37]/30 hover:border-[#D4AF37] transition-all shadow-xl flex flex-col justify-between group"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] mb-4 group-hover:scale-110 transition-transform">
                  <Calculator className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#F6E09E] transition-colors">
                  Gəlir və Faiz Kalkulyatoru
                </h3>
                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed mb-6">
                  İstədiyiniz məbləği daxil edin, günlük, aylıq və illik qazancınızı real vaxt rejimində faiz dərəcələri ilə hesablayın.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#F6E09E]">
                <span>Kalkulyatora Keç</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ========================================================================= */}
      {/* 2. MOBILE VIEW (Screens < md / strictly Phones): Exact Sleek Mobile Screen */}
      {/* ========================================================================= */}
      <div className="md:hidden w-full max-w-md mx-auto flex flex-col justify-start gap-2.5 sm:gap-3.5 px-4 sm:px-6 py-4 relative z-10 min-h-screen">
        
        {/* Top Centered Brand Logo & Typography */}
        <div className="flex flex-col items-center justify-center text-center pt-1 pb-1">
          {/* 3D Metallic Emblem ONLY (is3DEmblem ensures no duplicate text) */}
          <div className="mb-1.5 transition-transform hover:scale-105 duration-300">
            <VeyraLogo size="md" is3DEmblem={true} />
          </div>

          <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-[0.2em] sm:tracking-[0.25em] text-[#F6E09E] uppercase leading-tight mt-0.5">
            VEYRA
          </h1>
          
          <div className="flex items-center justify-center gap-2 my-1">
            <span className="h-[1px] w-5 sm:w-6 bg-gradient-to-r from-transparent to-[#D4AF37]" />
            <span className="text-[10px] sm:text-xs tracking-[0.3em] sm:tracking-[0.35em] text-[#D4AF37] font-semibold uppercase">
              INVEST
            </span>
            <span className="h-[1px] w-5 sm:w-6 bg-gradient-to-l from-transparent to-[#D4AF37]" />
          </div>

          <p className="text-[8.5px] min-[360px]:text-[9px] sm:text-[10px] tracking-[0.18em] sm:tracking-[0.25em] text-[#D4AF37]/85 uppercase font-medium mt-0.5 whitespace-nowrap">
            GƏLƏCƏYƏ DƏYƏR QATIRIQ
          </p>
        </div>

        {/* Luxury Villa Centerpiece with warm night illumination */}
        <div className="relative w-full rounded-2xl overflow-hidden my-1 border border-white/10 shadow-2xl group aspect-[16/10] max-h-[260px]">
          <img
            src={luxuryNightVilla}
            alt="Veyra Invest Villa"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
          />
          {/* Smooth Vignette and Edge blending */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#070B11] via-transparent to-[#070B11]/40" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#070B11]/60 via-transparent to-[#070B11]" />
        </div>

        {/* 5 Feature Badges Row - Matching Uploaded Photo */}
        <div className="w-full py-2 px-1.5 min-[360px]:px-2.5 rounded-2xl bg-[#0B111B]/90 backdrop-blur-md border border-[#D4AF37]/30 shadow-lg my-1">
          <div className="grid grid-cols-5 gap-0.5 min-[360px]:gap-1 text-center items-start">
            {/* 1. TƏHLÜKƏSİZ */}
            <div className="flex flex-col items-center justify-center p-0.5">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center mb-1">
                <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D4AF37] stroke-[1.8]" />
              </div>
              <span className="text-[6.5px] min-[360px]:text-[7.5px] sm:text-[9px] font-bold tracking-tight text-[#F6E09E] uppercase leading-tight">
                TƏHLÜKƏSİZ
              </span>
            </div>

            {/* 2. GƏLİRLİ */}
            <div className="flex flex-col items-center justify-center p-0.5">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center mb-1">
                <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D4AF37] stroke-[1.8]" />
              </div>
              <span className="text-[6.5px] min-[360px]:text-[7.5px] sm:text-[9px] font-bold tracking-tight text-[#F6E09E] uppercase leading-tight">
                GƏLİRLİ
              </span>
            </div>

            {/* 3. DAŞINMAZ ƏMLAK */}
            <div className="flex flex-col items-center justify-center p-0.5">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center mb-1">
                <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D4AF37] stroke-[1.8]" />
              </div>
              <span className="text-[6.5px] min-[360px]:text-[7.5px] sm:text-[9px] font-bold tracking-tight text-[#F6E09E] uppercase leading-tight">
                DAŞINMAZ<br className="sm:hidden" /> ƏMLAK
              </span>
            </div>

            {/* 4. DİVERSİFİKASİYA */}
            <div className="flex flex-col items-center justify-center p-0.5">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center mb-1">
                <PieChart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D4AF37] stroke-[1.8]" />
              </div>
              <span className="text-[5.5px] min-[340px]:text-[6.5px] min-[380px]:text-[7.5px] sm:text-[8.5px] font-bold tracking-tighter text-[#F6E09E] uppercase leading-tight break-all">
                DİVERSİFİKASİYA
              </span>
            </div>

            {/* 5. ETİBARLI */}
            <div className="flex flex-col items-center justify-center p-0.5">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center mb-1">
                <Handshake className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D4AF37] stroke-[1.8]" />
              </div>
              <span className="text-[6.5px] min-[360px]:text-[7.5px] sm:text-[9px] font-bold tracking-tight text-[#F6E09E] uppercase leading-tight">
                ETİBARLI
              </span>
            </div>
          </div>
        </div>

        {/* Headlines */}
        <div className="text-center my-1 px-1">
          <h2 className="text-lg min-[360px]:text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-snug">
            <span className="text-[#F6E09E]">Veyra Home</span> ilə investisiya edin.
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 font-normal leading-relaxed mt-1 max-w-xs mx-auto">
            Kiçik addımlarla başlayın, böyük gələcəyə sahib olun.
          </p>
        </div>

        {/* Mobile Action Buttons */}
        <div className="w-full flex flex-col gap-2.5 my-1">
          {/* Primary Gold Pill Button */}
          <button
            onClick={handleStart}
            id="mobile-hero-start-btn"
            className="w-full py-3.5 sm:py-4 px-6 rounded-2xl bg-gradient-to-r from-[#F6E09E] via-[#D4AF37] to-[#C99E2A] text-[#070B11] font-bold text-sm sm:text-base flex items-center justify-center gap-3 shadow-[0_6px_25px_rgba(212,175,55,0.4)] hover:brightness-105 active:scale-[0.98] transition-all min-h-[48px]"
          >
            <span>Başla</span>
            <ArrowRight className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* Secondary Dark Translucent Button */}
          <button
            onClick={handleLogin}
            id="mobile-hero-login-btn"
            className="w-full py-3.5 sm:py-4 px-6 rounded-2xl bg-[#0B111B]/80 hover:bg-[#121B2B] text-[#F6E09E] font-bold text-sm sm:text-base border border-[#D4AF37]/40 hover:border-[#D4AF37] transition-all active:scale-[0.98] min-h-[48px]"
          >
            Daxil ol
          </button>
        </div>

        {/* Bottom Carousel Dots */}
        <div className="flex items-center justify-center gap-1.5 my-1">
          <button
            onClick={() => setActiveSlide(0)}
            className={`transition-all duration-300 ${
              activeSlide === 0
                ? 'w-6 h-1.5 rounded-full bg-[#D4AF37]'
                : 'w-1.5 h-1.5 rounded-full bg-white/20'
            }`}
            aria-label="Slayd 1"
          />
          <button
            onClick={() => setActiveSlide(1)}
            className={`transition-all duration-300 ${
              activeSlide === 1
                ? 'w-6 h-1.5 rounded-full bg-[#D4AF37]'
                : 'w-1.5 h-1.5 rounded-full bg-white/20'
            }`}
            aria-label="Slayd 2"
          />
          <button
            onClick={() => setActiveSlide(2)}
            className={`transition-all duration-300 ${
              activeSlide === 2
                ? 'w-6 h-1.5 rounded-full bg-[#D4AF37]'
                : 'w-1.5 h-1.5 rounded-full bg-white/20'
            }`}
            aria-label="Slayd 3"
          />
          <button
            onClick={() => setActiveSlide(3)}
            className={`transition-all duration-300 ${
              activeSlide === 3
                ? 'w-6 h-1.5 rounded-full bg-[#D4AF37]'
                : 'w-1.5 h-1.5 rounded-full bg-white/20'
            }`}
            aria-label="Slayd 4"
          />
        </div>

        {/* Central Admin Panel link */}
        <div className="flex items-center justify-center pt-1 pb-2">
          <button
            onClick={() => setActiveView('admin')}
            className="text-[11px] text-white/40 hover:text-amber-400 flex items-center gap-1 transition-colors min-h-[32px]"
          >
            <Lock className="w-3 h-3" />
            <span>Mərkəzi Admin Paneli</span>
          </button>
        </div>

      </div>

    </div>
  );
};

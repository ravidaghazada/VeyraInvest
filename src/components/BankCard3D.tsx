import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Copy, Check, Sparkles, Shield, Eye, EyeOff } from 'lucide-react';

interface BankCard3DProps {
  cardNumber?: string;
  cardHolder?: string;
  expiryDate?: string;
  showExpiry?: boolean;
  interactive?: boolean;
  autoRotate?: boolean;
  showLaserGlow?: boolean;
  showParticleSparks?: boolean;
  animationSpeed?: 'slow' | 'normal' | 'fast';
  className?: string;
  onCopyNumber?: () => void;
}

export const BankCard3D: React.FC<BankCard3DProps> = ({
  cardNumber = '4169 7388 4952 8363',
  cardHolder = 'Veyra İnvest',
  expiryDate = '',
  showExpiry = false,
  interactive = true,
  autoRotate = true,
  showLaserGlow = true,
  showParticleSparks = true,
  animationSpeed = 'normal',
  className = '',
  onCopyNumber,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [copied, setCopied] = useState(false);
  const [pulseIndex, setPulseIndex] = useState(-1);
  const [showFullNumber, setShowFullNumber] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number | null>(null);

  // Speed multiplier
  const speedDurations = {
    slow: 9,
    normal: 7,
    fast: 5,
  };
  const duration = speedDurations[animationSpeed];

  // Clean raw digits for display and copy
  const cleanDigits = useMemo(() => {
    return cardNumber.replace(/\s+/g, '').split('');
  }, [cardNumber]);

  // Group digits into 4 chunks of 4
  const digitGroups = useMemo(() => {
    const groups: { char: string; index: number }[][] = [];
    let curGroup: { char: string; index: number }[] = [];

    cleanDigits.forEach((char, idx) => {
      curGroup.push({ char, index: idx });
      if (curGroup.length === 4 || idx === cleanDigits.length - 1) {
        groups.push(curGroup);
        curGroup = [];
      }
    });
    return groups;
  }, [cleanDigits]);

  // Sequential Digit Illumination Wave Loop
  useEffect(() => {
    let active = true;
    const totalDigits = cleanDigits.length || 16;
    
    // Each digit lights up for ~120ms sequentially, followed by a brief calm rest period
    const stepInterval = 110;
    const totalCycle = totalDigits * stepInterval + 2500; // ~4.2s per pulse cycle

    let currentStep = -1;
    let timerId: any = null;

    const runWave = () => {
      if (!active) return;
      currentStep = -1;

      const digitTimer = setInterval(() => {
        if (!active) {
          clearInterval(digitTimer);
          return;
        }
        currentStep++;
        if (currentStep < totalDigits) {
          setPulseIndex(currentStep);
        } else {
          setPulseIndex(-1);
          clearInterval(digitTimer);
          // Wait for rest pause before next wave
          timerId = setTimeout(runWave, 2200);
        }
      }, stepInterval);
    };

    runWave();

    return () => {
      active = false;
      if (timerId) clearTimeout(timerId);
    };
  }, [cleanDigits]);

  // Ambient Particles Sparks (Red, Gold & Silver Embers)
  useEffect(() => {
    if (!showParticleSparks) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 450);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      maxAlpha: number;
      color: string;
      phase: number;
      phaseSpeed: number;
    }

    const colors = [
      'rgba(239, 68, 68, ',   // Red neon
      'rgba(255, 46, 76, ',   // Crimson
      'rgba(212, 175, 55, ',  // Gold
      'rgba(255, 255, 255, ', // White spark
    ];

    const particles: Particle[] = Array.from({ length: 32 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -0.2 - Math.random() * 0.5,
      size: 0.8 + Math.random() * 1.8,
      alpha: Math.random() * 0.7,
      maxAlpha: 0.35 + Math.random() * 0.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      phase: Math.random() * Math.PI * 2,
      phaseSpeed: 0.02 + Math.random() * 0.03,
    }));

    let isRunning = true;
    const render = () => {
      if (!isRunning) return;
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.phase += p.phaseSpeed;
        p.alpha = Math.sin(p.phase) * p.maxAlpha;

        if (p.y < 0) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        if (p.alpha > 0.02) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `${p.color}${Math.max(0, p.alpha)})`;
          ctx.shadowBlur = 6;
          ctx.shadowColor = '#EF4444';
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      isRunning = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [showParticleSparks]);

  // Interactive mouse movement tilt tracking
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    setMousePos({ x, y });
  };

  const handleMouseEnter = () => {
    if (interactive) setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePos({ x: 0.5, y: 0.5 });
  };

  // Copy card number
  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(cleanDigits.join(''));
    setCopied(true);
    if (onCopyNumber) onCopyNumber();
    setTimeout(() => setCopied(false), 2400);
  };

  // Dynamic calculated tilt angles
  const tiltX = isHovered ? (mousePos.y - 0.5) * -22 : 0;
  const tiltY = isHovered ? (mousePos.x - 0.5) * 26 : 0;
  const specularX = mousePos.x * 100;
  const specularY = mousePos.y * 100;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative select-none flex items-center justify-center p-1 sm:p-3 overflow-visible ${className}`}
      style={{ perspective: '1200px' }}
    >
      {/* Background Particle Spark Canvas */}
      {showParticleSparks && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 pointer-events-none z-0 w-full h-full"
        />
      )}

      {/* Volumetric Red Ambient Lighting Behind Card */}
      <div
        className="absolute w-[300px] sm:w-[400px] md:w-[460px] h-[200px] sm:h-[280px] rounded-full pointer-events-none transition-opacity duration-1000 z-0 blur-[70px] sm:blur-[100px]"
        style={{
          background: 'radial-gradient(circle at 65% 35%, rgba(239, 68, 68, 0.32) 0%, rgba(185, 28, 28, 0.15) 45%, transparent 70%)',
          transform: `translate(${tiltY * 0.8}px, ${tiltX * 0.8}px)`,
        }}
      />

      {/* Floating 3D Animated Card Stage */}
      <div
        className={`relative w-full max-w-[340px] min-[390px]:max-w-[380px] sm:max-w-[430px] aspect-[1.586/1] transition-transform duration-300 ease-out group`}
        style={{
          transformStyle: 'preserve-3d',
          transform: isHovered
            ? `rotateY(${tiltY}deg) rotateX(${tiltX}deg) scale(1.02)`
            : undefined,
          animation:
            autoRotate && !isHovered
              ? `cardHeroFloat ${duration}s ease-in-out infinite`
              : undefined,
        }}
      >
        {/* Soft Depth Shadow on Ground Plane */}
        <div
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[85%] h-7 rounded-[100%] bg-black/80 blur-xl pointer-events-none transition-transform duration-700"
          style={{
            transform: `translateX(-50%) rotateX(85deg) scale(${isHovered ? 1.08 : 0.95})`,
            opacity: isHovered ? 0.9 : 0.7,
          }}
        />

        {/* ========================================================= */}
        {/* 1. FRONT SIDE OF THE CARD */}
        {/* ========================================================= */}
        <div
          className="absolute inset-0 rounded-[18px] sm:rounded-[22px] overflow-hidden p-3.5 min-[390px]:p-4 sm:p-5 md:p-6 flex flex-col justify-between border border-white/15 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95)]"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(0deg)',
            background: 'linear-gradient(135deg, #11141A 0%, #0B0D11 40%, #07080B 100%)',
          }}
        >
          {/* Micro-grain texture overlay */}
          <div
            className="absolute inset-0 opacity-[0.035] pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`,
              backgroundSize: '3px 3px',
            }}
          />

          {/* Interactive Specular Metallic Sheen */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle at ${specularX}% ${specularY}%, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.02) 40%, transparent 70%)`,
              opacity: isHovered ? 1 : 0.4,
            }}
          />

          {/* ========================================================= */}
          {/* GEOMETRIC LINE LASER GROOVES & RED LIGHT TRAVELING */}
          {/* ========================================================= */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
            viewBox="0 0 520 328"
            fill="none"
          >
            <defs>
              {/* Wide red ambient blur filter */}
              <filter id="neonBlur" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="5" result="blur1" />
                <feGaussianBlur stdDeviation="2" result="blur2" />
                <feMerge>
                  <feMergeNode in="blur1" />
                  <feMergeNode in="blur2" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Edge rim glow */}
              <linearGradient id="redRimGradient" x1="50%" y1="0%" x2="100%" y2="50%">
                <stop offset="0%" stopColor="#EF4444" stopOpacity="0.85" />
                <stop offset="60%" stopColor="#DC2626" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#7F1D1D" stopOpacity="0" />
              </linearGradient>

              {/* Animated Traveling Laser Pulse Gradient along Vertical line */}
              <linearGradient id="laserPulseVertical" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#EF4444" stopOpacity="0.1" />
                <stop offset="45%" stopColor="#EF4444" stopOpacity="0.95" />
                <stop offset="50%" stopColor="#FFFFFF" stopOpacity="1" />
                <stop offset="55%" stopColor="#EF4444" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#EF4444" stopOpacity="0.1" />
                {showLaserGlow && (
                  <animate
                    attributeName="y1"
                    values="-100%; 200%"
                    dur={`${duration}s`}
                    repeatCount="indefinite"
                  />
                )}
                {showLaserGlow && (
                  <animate
                    attributeName="y2"
                    values="0%; 300%"
                    dur={`${duration}s`}
                    repeatCount="indefinite"
                  />
                )}
              </linearGradient>

              {/* Animated Traveling Laser Pulse Gradient along Diagonal X lines */}
              <linearGradient id="laserPulseDiagonal" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#EF4444" stopOpacity="0.05" />
                <stop offset="40%" stopColor="#EF4444" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#FFFFFF" stopOpacity="1" />
                <stop offset="60%" stopColor="#EF4444" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#EF4444" stopOpacity="0.05" />
                {showLaserGlow && (
                  <animate
                    attributeName="x1"
                    values="-80%; 180%"
                    dur={`${duration * 0.9}s`}
                    repeatCount="indefinite"
                  />
                )}
                {showLaserGlow && (
                  <animate
                    attributeName="x2"
                    values="20%; 280%"
                    dur={`${duration * 0.9}s`}
                    repeatCount="indefinite"
                  />
                )}
              </linearGradient>
            </defs>

            {/* Base physical recessed grooves (recessed shadow & 3D chamfer) */}
            <g opacity="0.75">
              {/* Vertical division line at x = 276 (approx 53% across) */}
              <line x1="276" y1="0" x2="276" y2="328" stroke="#060709" strokeWidth="2.5" />
              <line x1="277" y1="0" x2="277" y2="328" stroke="rgba(255,255,255,0.06)" strokeWidth="0.8" />

              {/* Diagonal Line 1: From top-right (478, 0) down to center-bottom (276, 285) */}
              <line x1="478" y1="0" x2="276" y2="285" stroke="#060709" strokeWidth="2.5" />
              <line x1="478" y1="1" x2="276" y2="286" stroke="rgba(255,255,255,0.06)" strokeWidth="0.8" />

              {/* Diagonal Line 2: From center-left (276, 60) down to bottom-right (495, 328) */}
              <line x1="276" y1="60" x2="495" y2="328" stroke="#060709" strokeWidth="2.5" />
              <line x1="276" y1="61" x2="495" y2="329" stroke="rgba(255,255,255,0.06)" strokeWidth="0.8" />
            </g>

            {/* Red Traveling Laser Glow Layer (Active pulse) */}
            {showLaserGlow && (
              <g filter="url(#neonBlur)">
                {/* Vertical Laser Pulse */}
                <line
                  x1="276"
                  y1="0"
                  x2="276"
                  y2="328"
                  stroke="url(#laserPulseVertical)"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />

                {/* Diagonal 1 Laser Pulse */}
                <line
                  x1="478"
                  y1="0"
                  x2="276"
                  y2="285"
                  stroke="url(#laserPulseDiagonal)"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />

                {/* Diagonal 2 Laser Pulse */}
                <line
                  x1="276"
                  y1="60"
                  x2="495"
                  y2="328"
                  stroke="url(#laserPulseDiagonal)"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />

                {/* Intersection Bloom Point (approx x = 385, y = 180) */}
                <circle
                  cx="385"
                  cy="180"
                  r="3.5"
                  fill="#FFFFFF"
                  filter="url(#neonBlur)"
                >
                  <animate
                    attributeName="r"
                    values="2; 5.5; 2"
                    dur="3.2s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.4; 1; 0.4"
                    dur="3.2s"
                    repeatCount="indefinite"
                  />
                </circle>
              </g>
            )}

            {/* Top-Right Card Corner Refined Red Ambient Rim Glow */}
            <path
              d="M 460 0 C 500 0, 520 20, 520 60"
              fill="none"
              stroke="url(#redRimGradient)"
              strokeWidth="4"
              strokeLinecap="round"
              filter="url(#neonBlur)"
              opacity="0.9"
            />
          </svg>

          {/* ========================================================= */}
          {/* TOP ROW: KAPITAL BANK LOGO + BIRBANK */}
          {/* ========================================================= */}
          <div className="relative z-10 flex items-center justify-between">
            {/* Left: Kapital Bank Emblem + Text */}
            <div className="flex items-center gap-2.5 sm:gap-3.5">
              {/* Kapital Bank Red Geometric Logo (Two Mirrored Red Triangles with diagonal separation) */}
              <div className="relative w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 flex-shrink-0 drop-shadow-[0_2px_8px_rgba(227,6,19,0.5)]">
                <svg viewBox="0 0 36 36" className="w-full h-full" fill="none">
                  {/* Top-left Red Triangle */}
                  <polygon
                    points="3,3 33,3 3,33"
                    fill="#E30613"
                  />
                  {/* Bottom-right Deep Red Triangle */}
                  <polygon
                    points="33,3 33,33 3,33"
                    fill="#C0000B"
                  />
                  {/* Fine dark separation line */}
                  <line
                    x1="3"
                    y1="33"
                    x2="33"
                    y2="3"
                    stroke="#0B0D11"
                    strokeWidth="3.2"
                  />
                </svg>
              </div>

              {/* Brand Typography: Kapital Bank */}
              <div className="flex flex-col leading-none">
                <span className="text-white font-bold text-base sm:text-lg md:text-xl tracking-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                  Kapital Bank
                </span>
              </div>
            </div>

            {/* Right: birbank clean lowercase brandmark */}
            <div className="text-right">
              <span className="text-white font-bold text-lg sm:text-xl md:text-2xl tracking-tight lowercase drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] font-sans">
                birbank
              </span>
            </div>
          </div>

          {/* ========================================================= */}
          {/* MIDDLE ROW: METALLIC EMV CHIP & CONTACTLESS */}
          {/* ========================================================= */}
          <div className="relative z-10 my-auto flex items-center justify-between pl-0.5 sm:pl-1 pt-1 sm:pt-2">
            {/* Realistic Platinum / Brushed Silver-Gold EMV Chip */}
            <div className="relative w-11 h-9 sm:w-13 sm:h-10.5 md:w-14 md:h-11 rounded-md sm:rounded-lg overflow-hidden border border-[#D4D4D8]/30 shadow-[0_3px_8px_rgba(0,0,0,0.6)] group-hover:border-amber-200/50 transition-colors">
              {/* Metallic surface gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#E4E4E7] via-[#A1A1AA] to-[#71717A]" />
              
              {/* Micro-etched chip circuits */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 54 42" fill="none">
                <rect x="0.5" y="0.5" width="53" height="41" rx="5" stroke="rgba(0,0,0,0.35)" />
                {/* Horizontal split */}
                <line x1="0" y1="14" x2="54" y2="14" stroke="rgba(0,0,0,0.3)" strokeWidth="0.9" />
                <line x1="0" y1="28" x2="54" y2="28" stroke="rgba(0,0,0,0.3)" strokeWidth="0.9" />
                {/* Vertical split */}
                <line x1="18" y1="0" x2="18" y2="42" stroke="rgba(0,0,0,0.3)" strokeWidth="0.9" />
                <line x1="36" y1="0" x2="36" y2="42" stroke="rgba(0,0,0,0.3)" strokeWidth="0.9" />
                {/* Center oval pad */}
                <ellipse cx="27" cy="21" rx="8" ry="6" fill="rgba(228,228,231,0.5)" stroke="rgba(0,0,0,0.4)" strokeWidth="0.8" />
              </svg>

              {/* Specular sheen over chip */}
              <div
                className="absolute inset-0 pointer-events-none opacity-40 bg-gradient-to-tr from-transparent via-white/40 to-transparent"
                style={{
                  transform: `translateX(${(mousePos.x - 0.5) * 40}px)`,
                }}
              />
            </div>

            {/* Quick Action Tools (Copy & View Toggle) */}
            <div className="flex items-center gap-2 opacity-70 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowFullNumber(!showFullNumber);
                }}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-neutral-300 hover:text-white transition-colors cursor-pointer border border-white/5"
                title={showFullNumber ? 'Rəqəmləri gizlət' : 'Rəqəmləri göstər'}
              >
                {showFullNumber ? (
                  <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                ) : (
                  <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                )}
              </button>

              <button
                onClick={handleCopy}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-neutral-300 hover:text-white transition-colors cursor-pointer border border-white/5 flex items-center gap-1 text-[10px]"
                title="Kart nömrəsini kopyala"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                )}
              </button>
            </div>
          </div>

          {/* ========================================================= */}
          {/* CARD NUMBER: SEQUENTIAL DIGIT ILLUMINATION WAVE */}
          {/* ========================================================= */}
          <div className="relative z-10 pt-0.5 pb-0.5 sm:pt-1">
            <div
              className="flex items-center justify-between font-mono font-bold tracking-[0.12em] min-[390px]:tracking-[0.16em] sm:tracking-[0.20em] text-xs min-[360px]:text-sm min-[390px]:text-base sm:text-lg md:text-xl text-neutral-100"
              style={{
                textShadow:
                  '0 1px 1px rgba(255, 255, 255, 0.4), 0 -1px 2px rgba(0, 0, 0, 0.9)',
              }}
            >
              {digitGroups.map((group, groupIdx) => (
                <div key={groupIdx} className="flex items-center">
                  {group.map(({ char, index }) => {
                    const isPulsing = pulseIndex === index;
                    const displayChar =
                      showFullNumber || index < 4 || index >= 12 ? char : '•';

                    return (
                      <span
                        key={index}
                        className={`inline-block transition-all duration-200 ${
                          isPulsing
                            ? 'text-white scale-110 font-black'
                            : 'text-[#E2E8F0]'
                        }`}
                        style={{
                          textShadow: isPulsing
                            ? '0 0 10px #FF2E4C, 0 0 20px #EF4444, 0 0 35px #EF4444, 0 1px 2px #FFFFFF'
                            : undefined,
                          filter: isPulsing
                            ? 'drop-shadow(0 0 8px rgba(239, 68, 68, 0.9))'
                            : undefined,
                        }}
                      >
                        {displayChar}
                      </span>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Subtle Copied Toast Feedback */}
            {copied && (
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-emerald-500/90 text-neutral-950 font-bold text-[10px] shadow-lg flex items-center gap-1 animate-bounce">
                <Check className="w-3 h-3 stroke-[3]" />
                <span>Kopyalandı!</span>
              </div>
            )}
          </div>

          {/* ========================================================= */}
          {/* BOTTOM ROW: HOLDER NAME & AUTHENTIC VISA LOGO */}
          {/* ========================================================= */}
          <div className="relative z-10 flex items-end justify-between pt-1">
            {/* Cardholder Info */}
            <div className="flex items-center gap-6 text-[10px] sm:text-xs">
              <div>
                <span className="block text-[8px] sm:text-[9px] uppercase tracking-wider text-neutral-400 font-medium">
                  Kart Sahibi
                </span>
                <span className="font-semibold tracking-wider text-neutral-200 font-mono text-xs sm:text-sm uppercase">
                  {cardHolder}
                </span>
              </div>

              {showExpiry && expiryDate && (
                <div>
                  <span className="block text-[8px] sm:text-[9px] uppercase tracking-wider text-neutral-400 font-medium">
                    Bitiş Tarixi
                  </span>
                  <span className="font-semibold tracking-wider text-neutral-200 font-mono text-xs sm:text-sm">
                    {expiryDate}
                  </span>
                </div>
              )}
            </div>

            {/* Authentic VISA Wordmark Logo */}
            <div className="relative w-12 min-[390px]:w-14 sm:w-16 flex items-center justify-end">
              <svg
                viewBox="0 7.8 24 8.5"
                className="w-full h-auto drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]"
                fill="#FFFFFF"
                aria-label="Visa"
              >
                <path d="M9.112 8.262L5.97 15.758H3.92L2.374 9.775c-.094-.368-.175-.503-.461-.658C1.447 8.864.677 8.627 0 8.479l.046-.217h3.3a.904.904 0 01.894.764l.817 4.338 2.018-5.102zm8.033 5.049c.008-1.979-2.736-2.088-2.717-2.972.006-.269.262-.555.822-.628a3.66 3.66 0 011.913.336l.34-1.59a5.207 5.207 0 00-1.814-.333c-1.917 0-3.266 1.02-3.278 2.479-.012 1.079.963 1.68 1.698 2.04.756.367 1.01.603 1.006.931-.005.504-.602.725-1.16.734-.975.015-1.54-.263-1.992-.473l-.351 1.642c.453.208 1.289.39 2.156.398 2.037 0 3.37-1.006 3.377-2.564m5.061 2.447H24l-1.565-7.496h-1.656a.883.883 0 00-.826.55l-2.909 6.946h2.036l.405-1.12h2.488zm-2.163-2.656l1.02-2.815.588 2.815zm-8.16-4.84l-1.603 7.496H8.34l1.605-7.496z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

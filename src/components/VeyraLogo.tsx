import React from 'react';

interface VeyraLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSlogan?: boolean;
  is3DEmblem?: boolean;
}

export const VeyraLogo: React.FC<VeyraLogoProps> = ({
  className = '',
  size = 'md',
  showSlogan = false,
  is3DEmblem = false,
}) => {
  const sizeMap = {
    sm: { icon: 34, text: 'text-base', sub: 'text-[9px]' },
    md: { icon: 48, text: 'text-xl', sub: 'text-[11px]' },
    lg: { icon: 72, text: 'text-2xl sm:text-3xl', sub: 'text-xs' },
    xl: { icon: 110, text: 'text-3xl sm:text-4xl', sub: 'text-sm' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      {/* 3D Metallic Emblem */}
      <div className="relative flex items-center justify-center">
        <svg
          width={currentSize.icon}
          height={currentSize.icon}
          viewBox="0 0 160 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="filter drop-shadow-[0_4px_12px_rgba(212,175,55,0.4)] transition-transform duration-300 hover:scale-105"
        >
          <defs>
            {/* Outer ring gradient */}
            <linearGradient id="goldRing" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF2B2" />
              <stop offset="30%" stopColor="#D4AF37" />
              <stop offset="70%" stopColor="#996D12" />
              <stop offset="100%" stopColor="#F6E09E" />
            </linearGradient>

            {/* Inner fill gradient */}
            <linearGradient id="goldBevel" x1="20%" y1="0%" x2="80%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
              <stop offset="25%" stopColor="#F6E09E" />
              <stop offset="60%" stopColor="#D4AF37" />
              <stop offset="90%" stopColor="#875E0A" />
              <stop offset="100%" stopColor="#4A3403" />
            </linearGradient>

            {/* Left face shadow gradient */}
            <linearGradient id="goldShadowLeft" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#AA7C11" />
              <stop offset="100%" stopColor="#553D08" />
            </linearGradient>

            {/* Right face highlight gradient */}
            <linearGradient id="goldLightRight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF9E0" />
              <stop offset="50%" stopColor="#F6E09E" />
              <stop offset="100%" stopColor="#C99E2A" />
            </linearGradient>

            {/* Skyscraper pillar gradient */}
            <linearGradient id="towerGold" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFF7D6" />
              <stop offset="35%" stopColor="#D4AF37" />
              <stop offset="75%" stopColor="#996D12" />
              <stop offset="100%" stopColor="#3B2902" />
            </linearGradient>

            <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#D4AF37" floodOpacity="0.5" />
            </filter>
          </defs>

          {/* Outer circular ring */}
          <circle
            cx="80"
            cy="80"
            r="66"
            stroke="url(#goldRing)"
            strokeWidth="8"
            fill="none"
            filter="url(#goldGlow)"
            strokeDasharray="420"
            strokeDashoffset="0"
          />

          {/* Inner ring highlight */}
          <circle
            cx="80"
            cy="80"
            r="59"
            stroke="#FFF2B2"
            strokeOpacity="0.4"
            strokeWidth="1"
            fill="none"
          />

          {/* Architectural Skyscraper Columns inside V */}
          {/* Column 1 - Left outer */}
          <path
            d="M 54 84 L 54 62 L 62 56 L 62 88 Z"
            fill="url(#goldShadowLeft)"
          />
          <path
            d="M 62 56 L 66 59 L 66 90 L 62 88 Z"
            fill="url(#goldLightRight)"
          />

          {/* Column 2 - Center left tall pillar */}
          <path
            d="M 69 92 L 69 36 L 79 26 L 79 100 Z"
            fill="url(#goldLightRight)"
          />
          <path
            d="M 79 26 L 80 27 L 80 101 L 79 100 Z"
            fill="#FFF"
            fillOpacity="0.8"
          />

          {/* Column 3 - Center right tall pillar */}
          <path
            d="M 80 27 L 89 36 L 89 100 L 80 101 Z"
            fill="url(#goldShadowLeft)"
          />

          {/* Column 4 - Right outer pillar */}
          <path
            d="M 94 59 L 98 56 L 106 62 L 106 84 L 94 90 Z"
            fill="url(#goldBevel)"
          />

          {/* Majestic Faceted 3D 'V' overlaying the circle */}
          {/* Left Wing - Darker/Reflective bevel */}
          <path
            d="M 28 58 L 52 58 L 80 118 L 80 134 L 28 58 Z"
            fill="url(#goldShadowLeft)"
          />
          {/* Left Wing - Highlight facet */}
          <path
            d="M 44 58 L 56 58 L 80 114 L 80 120 Z"
            fill="url(#goldLightRight)"
          />

          {/* Right Wing - Radiant highlight facet */}
          <path
            d="M 132 58 L 108 58 L 80 118 L 80 134 L 132 58 Z"
            fill="url(#goldLightRight)"
          />
          {/* Right Wing - Bevel edge */}
          <path
            d="M 116 58 L 104 58 L 80 114 L 80 120 Z"
            fill="url(#goldShadowLeft)"
          />

          {/* Central bottom apex point of V */}
          <polygon
            points="80,136 73,122 80,118 87,122"
            fill="#FFF5C2"
          />

          {/* Top tips of V wings */}
          <polygon points="28,58 38,52 52,58 40,62" fill="url(#goldRing)" />
          <polygon points="132,58 122,52 108,58 120,62" fill="url(#goldRing)" />
        </svg>
      </div>

      {/* Typography */}
      {!is3DEmblem && (
        <div className="text-center mt-1.5 flex flex-col items-center">
          <div
            className={`font-serif tracking-[0.28em] font-extrabold uppercase text-[#F6E09E] drop-shadow-[0_2px_8px_rgba(212,175,55,0.3)] ${currentSize.text}`}
            style={{ letterSpacing: '0.24em' }}
          >
            VEYRA
          </div>
          <div
            className={`font-sans tracking-[0.45em] text-[#D4AF37] font-semibold text-opacity-90 uppercase ${currentSize.sub} mt-0.5`}
          >
            — INVEST —
          </div>

          {showSlogan && (
            <div className="font-sans text-[10px] sm:text-[11px] text-[#D4AF37]/90 tracking-[0.25em] uppercase font-medium mt-1">
              GƏLƏCƏYƏ DƏYƏR QATIRIQ
            </div>
          )}
        </div>
      )}
    </div>
  );
};

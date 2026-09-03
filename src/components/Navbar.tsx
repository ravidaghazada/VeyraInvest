import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Wallet,
  LogOut,
  Bell,
  ShieldAlert,
  Menu,
  X,
  PlusCircle,
  LayoutDashboard,
  Building2,
  TrendingUp,
  FileCheck,
  ChevronDown,
  Calculator,
  HelpCircle,
  Info,
  ShieldCheck,
  Home,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    user,
    activeView,
    setActiveView,
    logout,
    setIsAuthModalOpen,
    setIsDepositModalOpen,
    notifications,
    markNotificationAsRead,
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  const unreadNotifications = notifications.filter(
    (n) => !n.isRead && (!user || n.userId === user.id)
  );

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0E1624]/75 backdrop-blur-xl border-b border-white/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-2 sm:gap-4">
        {/* Logo */}
        <div
          onClick={() => setActiveView('landing')}
          className="cursor-pointer flex items-center gap-2.5 sm:gap-3.5 group flex-shrink-0"
          id="nav-brand-logo"
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 bg-gradient-to-br from-[#D4AF37] to-[#F6E09E] rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.3)] flex-shrink-0 group-hover:scale-105 transition-transform">
            <span className="text-[#070B11] font-black text-xl font-serif">V</span>
          </div>
          <div>
            <h1 className="text-base sm:text-lg lg:text-xl font-bold tracking-tight text-[#F6E09E] leading-tight font-serif whitespace-nowrap">
              VEYRA INVEST
            </h1>
            <p className="hidden sm:block text-[8.5px] sm:text-[9.5px] text-[#D4AF37] tracking-[0.2em] uppercase opacity-80 font-sans whitespace-nowrap">
              Vəsaitinizi ağıllı şəkildə idarə edin
            </p>
          </div>
        </div>

        {/* 1. Full Desktop Navigation Links (>= 1200px / xl) */}
        <nav className="hidden xl:flex items-center gap-5 2xl:gap-7 text-xs lg:text-sm font-medium">
          <button
            onClick={() => setActiveView('landing')}
            className={`transition-all pb-1 whitespace-nowrap ${
              activeView === 'landing'
                ? 'text-[#D4AF37] border-b-2 border-[#D4AF37] font-bold'
                : 'text-white/70 hover:text-white'
            }`}
          >
            Ana Səhifə
          </button>

          <button
            onClick={() => setActiveView('dashboard')}
            className={`transition-all pb-1 whitespace-nowrap ${
              activeView === 'dashboard'
                ? 'text-[#D4AF37] border-b-2 border-[#D4AF37] font-bold'
                : 'text-white/70 hover:text-white'
            }`}
          >
            İnvestor Kabineti
          </button>

          <button
            onClick={() => setActiveView('visualizer')}
            className={`transition-all pb-1 whitespace-nowrap ${
              activeView === 'visualizer'
                ? 'text-[#D4AF37] border-b-2 border-[#D4AF37] font-bold'
                : 'text-white/70 hover:text-white'
            }`}
          >
            3D Veyra Home
          </button>

          <button
            onClick={() => setActiveView('products')}
            className={`transition-all pb-1 whitespace-nowrap ${
              activeView === 'products'
                ? 'text-[#D4AF37] border-b-2 border-[#D4AF37] font-bold'
                : 'text-white/70 hover:text-white'
            }`}
          >
            Mərhələlər
          </button>

          <button
            onClick={() => setActiveView('calculator')}
            className={`transition-all pb-1 whitespace-nowrap ${
              activeView === 'calculator'
                ? 'text-[#D4AF37] border-b-2 border-[#D4AF37] font-bold'
                : 'text-white/70 hover:text-white'
            }`}
          >
            Kalkulyator
          </button>

          <button
            onClick={() => setActiveView('howItWorks')}
            className={`transition-all pb-1 whitespace-nowrap ${
              activeView === 'howItWorks'
                ? 'text-[#D4AF37] border-b-2 border-[#D4AF37] font-bold'
                : 'text-white/70 hover:text-white'
            }`}
          >
            Necə işləyir?
          </button>

          <button
            onClick={() => setActiveView('about')}
            className={`transition-all pb-1 whitespace-nowrap ${
              activeView === 'about'
                ? 'text-[#D4AF37] border-b-2 border-[#D4AF37] font-bold'
                : 'text-white/70 hover:text-white'
            }`}
          >
            Haqqımızda
          </button>

          <button
            onClick={() => setActiveView('legal')}
            className={`transition-all pb-1 whitespace-nowrap ${
              activeView === 'legal'
                ? 'text-[#D4AF37] border-b-2 border-[#D4AF37] font-bold'
                : 'text-white/70 hover:text-white'
            }`}
          >
            Hüquqi
          </button>
        </nav>

        {/* 2. Tablet Adaptive Navigation (768px - 1199px / md to xl) */}
        <nav className="hidden md:flex xl:hidden items-center gap-3 lg:gap-4 text-xs font-semibold">
          <button
            onClick={() => setActiveView('landing')}
            className={`transition-all pb-1 whitespace-nowrap ${
              activeView === 'landing'
                ? 'text-[#D4AF37] border-b-2 border-[#D4AF37] font-bold'
                : 'text-white/70 hover:text-white'
            }`}
          >
            Ana Səhifə
          </button>

          <button
            onClick={() => setActiveView('dashboard')}
            className={`transition-all pb-1 whitespace-nowrap ${
              activeView === 'dashboard'
                ? 'text-[#D4AF37] border-b-2 border-[#D4AF37] font-bold'
                : 'text-white/70 hover:text-white'
            }`}
          >
            Kabinet
          </button>

          <button
            onClick={() => setActiveView('visualizer')}
            className={`transition-all pb-1 whitespace-nowrap ${
              activeView === 'visualizer'
                ? 'text-[#D4AF37] border-b-2 border-[#D4AF37] font-bold'
                : 'text-white/70 hover:text-white'
            }`}
          >
            3D Home
          </button>

          <button
            onClick={() => setActiveView('products')}
            className={`transition-all pb-1 whitespace-nowrap ${
              activeView === 'products'
                ? 'text-[#D4AF37] border-b-2 border-[#D4AF37] font-bold'
                : 'text-white/70 hover:text-white'
            }`}
          >
            Mərhələlər
          </button>

          <button
            onClick={() => setActiveView('calculator')}
            className={`transition-all pb-1 whitespace-nowrap ${
              activeView === 'calculator'
                ? 'text-[#D4AF37] border-b-2 border-[#D4AF37] font-bold'
                : 'text-white/70 hover:text-white'
            }`}
          >
            Kalkulyator
          </button>

          {/* "Daha çox" (More) Dropdown for Tablet */}
          <div className="relative">
            <button
              onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
              className={`flex items-center gap-1 transition-all pb-1 whitespace-nowrap ${
                ['howItWorks', 'about', 'legal', 'admin'].includes(activeView)
                  ? 'text-[#D4AF37] border-b-2 border-[#D4AF37] font-bold'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <span>Daha çox</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isMoreMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {isMoreMenuOpen && (
              <div
                onMouseLeave={() => setIsMoreMenuOpen(false)}
                className="absolute left-0 mt-2 w-48 rounded-2xl glass-dropdown p-2 shadow-2xl z-50 border border-white/10 bg-[#0E1624]/95 backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150"
              >
                <button
                  onClick={() => {
                    setActiveView('howItWorks');
                    setIsMoreMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center gap-2 transition-colors ${
                    activeView === 'howItWorks' ? 'text-[#D4AF37] bg-[#D4AF37]/10 font-bold' : 'text-white/80 hover:bg-white/5'
                  }`}
                >
                  <HelpCircle className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Necə işləyir?</span>
                </button>

                <button
                  onClick={() => {
                    setActiveView('about');
                    setIsMoreMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center gap-2 transition-colors ${
                    activeView === 'about' ? 'text-[#D4AF37] bg-[#D4AF37]/10 font-bold' : 'text-white/80 hover:bg-white/5'
                  }`}
                >
                  <Info className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Haqqımızda</span>
                </button>

                <button
                  onClick={() => {
                    setActiveView('legal');
                    setIsMoreMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center gap-2 transition-colors ${
                    activeView === 'legal' ? 'text-[#D4AF37] bg-[#D4AF37]/10 font-bold' : 'text-white/80 hover:bg-white/5'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Hüquqi Şəffaflıq</span>
                </button>

                <div className="my-1 border-t border-white/5" />

                <button
                  onClick={() => {
                    setActiveView('admin');
                    setIsMoreMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs flex items-center gap-2 text-amber-400 hover:bg-amber-950/30 transition-colors"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                  <span>Admin Girişi</span>
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* Right Action Icons & Auth */}
        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 flex-shrink-0">
          {/* Admin Switch Shortcut */}
          <button
            onClick={() => setActiveView('admin')}
            id="nav-admin-btn"
            className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold tracking-wider uppercase border transition-all ${
              activeView === 'admin'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                : 'bg-white/5 text-white/60 border-white/10 hover:text-amber-300 hover:border-amber-500/40'
            }`}
            title="Mərkəzi Admin Paneli"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>Admin</span>
          </button>

          {user ? (
            /* Logged in User Bar */
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Balance Widget */}
              <div
                onClick={() => {
                  setActiveView('dashboard');
                }}
                className="cursor-pointer hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:border-[#D4AF37]/50 transition-all shadow-sm"
              >
                <Wallet className="w-3.5 h-3.5 text-[#D4AF37]" />
                <div className="text-left">
                  <span className="text-[9px] text-white/40 block leading-none">Balans</span>
                  <span className="text-xs font-bold text-[#F6E09E] leading-tight">
                    {user.balance.toFixed(2)} AZN
                  </span>
                </div>
              </div>

              {/* Deposit Quick Action */}
              <button
                onClick={() => setIsDepositModalOpen(true)}
                id="nav-deposit-btn"
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-[#070B11] bg-gradient-to-r from-[#F6E09E] to-[#D4AF37] hover:brightness-110 flex items-center gap-1.5 shadow-[0_0_15px_rgba(212,175,55,0.25)] transition-all active:scale-95 min-h-[38px]"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Depozit</span>
              </button>

              {/* Notifications Bell */}
              <div className="relative">
                <button
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  id="nav-notifications-btn"
                  className="relative p-2 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:border-[#D4AF37]/40 transition-all min-w-[38px] min-h-[38px] flex items-center justify-center"
                  aria-label="Bildirişlər"
                >
                  <Bell className="w-4 h-4" />
                  {unreadNotifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-neutral-950 rounded-full text-[10px] font-extrabold flex items-center justify-center animate-pulse">
                      {unreadNotifications.length}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {isNotificationsOpen && (
                  <div className="absolute right-0 mt-3 w-72 sm:w-80 rounded-2xl glass-dropdown p-4 shadow-2xl z-50 border border-white/10 bg-[#0E1624]/95 backdrop-blur-2xl">
                    <div className="flex items-center justify-between pb-3 border-b border-white/10">
                      <h4 className="text-sm font-bold text-[#F6E09E] flex items-center gap-2">
                        <Bell className="w-4 h-4 text-[#D4AF37]" /> Bildirişlər
                      </h4>
                      <span className="text-[11px] text-white/40">
                        {unreadNotifications.length} oxunmamış
                      </span>
                    </div>

                    <div className="max-h-64 overflow-y-auto divide-y divide-white/5 mt-2 space-y-2">
                      {notifications.length === 0 ? (
                        <div className="text-center py-6 text-xs text-white/40">
                          Hələ heç bir bildiriş yoxdur.
                        </div>
                      ) : (
                        notifications.slice(0, 6).map((notif) => (
                          <div
                            key={notif.id}
                            onClick={() => markNotificationAsRead(notif.id)}
                            className={`p-2.5 rounded-xl cursor-pointer transition-colors ${
                              notif.isRead ? 'bg-transparent' : 'bg-[#D4AF37]/10'
                            } hover:bg-white/5`}
                          >
                            <div className="flex justify-between items-start">
                              <span className="text-xs font-semibold text-white/90">
                                {notif.title}
                              </span>
                              <span className="text-[10px] text-white/40">
                                {new Date(notif.createdAt).toLocaleTimeString('az-AZ', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                            <p className="text-[11px] text-white/50 mt-1 leading-relaxed">
                              {notif.message}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Menu Trigger */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  id="nav-profile-btn"
                  className="flex items-center gap-2 p-1 rounded-xl hover:bg-white/5 transition-all text-left"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#F6E09E] text-[#070B11] flex items-center justify-center font-bold text-xs shadow-sm flex-shrink-0">
                    {user.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase() || 'U'}
                  </div>
                </button>

                {/* Profile Dropdown */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 rounded-2xl glass-dropdown p-2 shadow-2xl z-50 border border-white/10 bg-[#0E1624]/95 backdrop-blur-2xl">
                    <div className="px-3 py-2 border-b border-white/10 mb-1">
                      <p className="text-xs font-bold text-white truncate">{user.name}</p>
                      <p className="text-[11px] text-white/40 truncate">{user.email}</p>
                    </div>

                    <button
                      onClick={() => {
                        setActiveView('dashboard');
                        setIsProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-white/80 hover:text-[#F6E09E] hover:bg-white/5 rounded-xl transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-[#D4AF37]" />
                      <span>İnvestor Kabineti</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveView('history');
                        setIsProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-white/80 hover:text-[#F6E09E] hover:bg-white/5 rounded-xl transition-colors"
                    >
                      <FileCheck className="w-4 h-4 text-[#D4AF37]" />
                      <span>Əməliyyat Tarixçəsi</span>
                    </button>

                    <button
                      onClick={() => {
                        logout();
                        setIsProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-rose-400 hover:bg-rose-950/30 rounded-xl transition-colors mt-1 border-t border-white/10"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Çıxış et</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Not logged in: Daxil ol & Başla buttons */
            <div className="flex items-center gap-2 sm:gap-2.5">
              <button
                onClick={() => setIsAuthModalOpen(true)}
                id="nav-login-btn"
                className="px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-[#F6E09E] bg-white/5 hover:bg-white/10 border border-white/10 transition-all hover:border-[#D4AF37]/50 whitespace-nowrap min-h-[38px]"
              >
                Daxil ol
              </button>

              <button
                onClick={() => setIsAuthModalOpen(true)}
                id="nav-register-btn"
                className="px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-[#070B11] bg-[#D4AF37] hover:brightness-110 shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all active:scale-95 whitespace-nowrap min-h-[38px]"
              >
                Qeydiyyat
              </button>
            </div>
          )}

          {/* Mobile hamburger menu toggle (Only on screens < 768px / md:hidden) */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:text-white hover:bg-white/10 min-w-[44px] min-h-[44px] flex items-center justify-center transition-colors"
            aria-label="Menyu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5 text-[#D4AF37]" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer (Screens < 768px / strictly phones) */}
      {isMobileMenuOpen && (
        <div className="md:hidden px-4 pt-3 pb-6 bg-[#070B11]/98 border-b border-[#D4AF37]/30 shadow-2xl animate-in slide-in-from-top-2 duration-200">
          {/* User balance banner if logged in */}
          {user && (
            <div className="mb-3 p-3 rounded-2xl bg-[#0E1624] border border-[#D4AF37]/30 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-white/50 uppercase tracking-wider">İnvestor Balansı</p>
                <p className="text-base font-bold text-[#F6E09E]">{user.balance.toFixed(2)} AZN</p>
              </div>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsDepositModalOpen(true);
                }}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-neutral-950 bg-[#D4AF37] flex items-center gap-1 shadow-sm"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Depozit</span>
              </button>
            </div>
          )}

          <div className="space-y-1">
            <button
              onClick={() => {
                setActiveView('landing');
                setIsMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3.5 py-3 rounded-xl text-sm font-semibold flex items-center gap-3 transition-colors min-h-[44px] ${
                activeView === 'landing'
                  ? 'bg-[#D4AF37]/20 text-[#F6E09E] border border-[#D4AF37]/40'
                  : 'text-neutral-200 hover:bg-neutral-800/80'
              }`}
            >
              <Home className="w-4 h-4 text-[#D4AF37]" />
              <span>Ana Səhifə</span>
            </button>

            <button
              onClick={() => {
                setActiveView('dashboard');
                setIsMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3.5 py-3 rounded-xl text-sm font-semibold flex items-center justify-between transition-colors min-h-[44px] ${
                activeView === 'dashboard'
                  ? 'bg-[#D4AF37]/20 text-[#F6E09E] border border-[#D4AF37]/40'
                  : 'text-neutral-200 hover:bg-neutral-800/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard className="w-4 h-4 text-[#D4AF37]" />
                <span>İnvestor Kabineti</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">Canlı</span>
            </button>

            <button
              onClick={() => {
                setActiveView('visualizer');
                setIsMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3.5 py-3 rounded-xl text-sm font-medium flex items-center gap-3 transition-colors min-h-[44px] ${
                activeView === 'visualizer'
                  ? 'bg-[#D4AF37]/20 text-[#F6E09E] border border-[#D4AF37]/40'
                  : 'text-neutral-200 hover:bg-neutral-800/80'
              }`}
            >
              <Building2 className="w-4 h-4 text-[#D4AF37]" />
              <span>3D Veyra Home</span>
            </button>

            <button
              onClick={() => {
                setActiveView('products');
                setIsMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3.5 py-3 rounded-xl text-sm font-medium flex items-center gap-3 transition-colors min-h-[44px] ${
                activeView === 'products'
                  ? 'bg-[#D4AF37]/20 text-[#F6E09E] border border-[#D4AF37]/40'
                  : 'text-neutral-200 hover:bg-neutral-800/80'
              }`}
            >
              <TrendingUp className="w-4 h-4 text-[#D4AF37]" />
              <span>Mərhələlər (Portfel)</span>
            </button>

            <button
              onClick={() => {
                setActiveView('calculator');
                setIsMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3.5 py-3 rounded-xl text-sm font-medium flex items-center gap-3 transition-colors min-h-[44px] ${
                activeView === 'calculator'
                  ? 'bg-[#D4AF37]/20 text-[#F6E09E] border border-[#D4AF37]/40'
                  : 'text-neutral-200 hover:bg-neutral-800/80'
              }`}
            >
              <Calculator className="w-4 h-4 text-[#D4AF37]" />
              <span>Qazanc Kalkulyatoru</span>
            </button>

            <button
              onClick={() => {
                setActiveView('howItWorks');
                setIsMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3.5 py-3 rounded-xl text-sm font-medium flex items-center gap-3 transition-colors min-h-[44px] ${
                activeView === 'howItWorks'
                  ? 'bg-[#D4AF37]/20 text-[#F6E09E] border border-[#D4AF37]/40'
                  : 'text-neutral-200 hover:bg-neutral-800/80'
              }`}
            >
              <HelpCircle className="w-4 h-4 text-[#D4AF37]" />
              <span>Necə işləyir?</span>
            </button>

            <button
              onClick={() => {
                setActiveView('about');
                setIsMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3.5 py-3 rounded-xl text-sm font-medium flex items-center gap-3 transition-colors min-h-[44px] ${
                activeView === 'about'
                  ? 'bg-[#D4AF37]/20 text-[#F6E09E] border border-[#D4AF37]/40'
                  : 'text-neutral-200 hover:bg-neutral-800/80'
              }`}
            >
              <Info className="w-4 h-4 text-[#D4AF37]" />
              <span>Haqqımızda</span>
            </button>

            <button
              onClick={() => {
                setActiveView('legal');
                setIsMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3.5 py-3 rounded-xl text-sm font-medium flex items-center gap-3 transition-colors min-h-[44px] ${
                activeView === 'legal'
                  ? 'bg-[#D4AF37]/20 text-[#F6E09E] border border-[#D4AF37]/40'
                  : 'text-neutral-200 hover:bg-neutral-800/80'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              <span>Hüquqi Şəffaflıq</span>
            </button>

            <button
              onClick={() => {
                setActiveView('admin');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-3.5 py-3 rounded-xl text-sm font-semibold text-amber-400 bg-amber-950/40 border border-amber-700/40 flex items-center justify-between min-h-[44px]"
            >
              <div className="flex items-center gap-3">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>Mərkəzi Admin Paneli</span>
              </div>
              <span className="text-[10px] text-amber-300">Giriş →</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

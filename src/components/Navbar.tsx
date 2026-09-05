import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { VeyraLogo } from './VeyraLogo';
import {
  Menu,
  X,
  Home,
  LayoutDashboard,
  Building2,
  TrendingUp,
  Calculator,
  HelpCircle,
  Info,
  ShieldCheck,
  FileCheck,
  LogOut,
  Wallet,
  Bell,
  PlusCircle,
  Lock,
  ChevronRight,
  ShieldAlert,
  CreditCard,
} from 'lucide-react';
import { ACTIVE_APK_DOWNLOAD_URL, APK_CONFIG } from '../constants/appConfig';

export const Navbar: React.FC = () => {
  const {
    user,
    isAdmin,
    activeView,
    setActiveView,
    openAuthModal,
    setIsDepositModalOpen,
    logout,
    notifications,
    markNotificationAsRead,
  } = useApp();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Close drawers on view change
  const navigateTo = (view: any) => {
    setActiveView(view);
    setIsMenuOpen(false);
    setIsNotificationsOpen(false);
    setIsProfileOpen(false);
  };

  // Prevent background body scrolling when mobile drawer is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const unreadNotifications = notifications.filter((n) => !n.isRead);

  const menuItems = [
    { id: 'landing', path: '/', label: 'Ana Səhifə', icon: Home, badge: null },
    { id: 'dashboard', path: '/dashboard', label: 'İnvestor Kabineti', icon: LayoutDashboard, badge: 'Canlı' },
    { id: 'visualizer', path: '/visualizer', label: '3D Veyra Home Vizualizatoru', icon: Building2, badge: '3D' },
    { id: 'products', path: '/products', label: 'Tikinti Mərhələləri & Portfel', icon: TrendingUp, badge: null },
    { id: 'calculator', path: '/calculator', label: 'Qazanc Kalkulyatoru', icon: Calculator, badge: null },
    { id: 'howItWorks', path: '/howitworks', label: 'Necə İşləyir?', icon: HelpCircle, badge: null },
    { id: 'about', path: '/about', label: 'Haqqımızda & Missiya', icon: Info, badge: null },
    { id: 'history', path: '/history', label: 'Əməliyyat Tarixçəsi', icon: FileCheck, badge: null },
    { id: 'legal', path: '/legal', label: 'Hüquqi Şəffaflıq & Zəmanət', icon: ShieldCheck, badge: null },
  ];

  const desktopNavLinks = [
    { id: 'products', path: '/products', label: 'Məhsullar' },
    { id: 'calculator', path: '/calculator', label: 'Kalkulyator' },
    { id: 'visualizer', path: '/visualizer', label: '3D Villa' },
    { id: 'howItWorks', path: '/howitworks', label: 'Necə İşləyir?' },
    { id: 'about', path: '/about', label: 'Haqqımızda' },
    { id: 'legal', path: '/legal', label: 'Hüquqi' },
  ];

  return (
    <>
      {/* Top Navbar Header */}
      <header className="sticky top-0 z-40 w-full bg-[#070B11]/90 backdrop-blur-xl border-b border-[#D4AF37]/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          
          {/* Left Brand Identity */}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigateTo('landing');
            }}
            className="cursor-pointer flex items-center gap-2 sm:gap-2.5 group select-none py-1"
          >
            <VeyraLogo size="sm" is3DEmblem={true} />
            <div className="flex flex-col justify-center">
              <span className="text-sm sm:text-lg font-serif font-extrabold tracking-wider text-white group-hover:text-[#F6E09E] transition-colors leading-tight">
                VEYRA <span className="text-[#D4AF37]">INVEST</span>
              </span>
              <span className="text-[7.5px] sm:text-[9px] uppercase tracking-[0.22em] text-[#D4AF37]/80 font-medium leading-none mt-0.5 hidden min-[340px]:block">
                Gələcəyə Dəyər Qatırıq
              </span>
            </div>
          </a>

          {/* Desktop Semantic Navigation Menu (Crawlable by Googlebot) */}
          <nav aria-label="Əsas naviqasiya" className="hidden lg:flex items-center gap-6">
            {desktopNavLinks.map((link) => {
              const isActive = activeView === link.id;
              return (
                <a
                  key={link.id}
                  href={link.path}
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo(link.id);
                  }}
                  className={`text-xs font-semibold uppercase tracking-wider transition-colors py-1 relative ${
                    isActive
                      ? 'text-[#F6E09E]'
                      : 'text-neutral-300 hover:text-white'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D4AF37] rounded-full" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {user ? (
              /* Logged-in User Controls */
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Balance Widget (Compact & Clear) */}
                <div
                  onClick={() => navigateTo('dashboard')}
                  id="nav-balance-widget"
                  className="cursor-pointer flex items-center gap-1.5 px-2 py-1 sm:px-2.5 sm:py-1 rounded-lg bg-[#0E1624]/90 border border-[#D4AF37]/30 hover:border-[#D4AF37]/70 transition-all shadow-sm group select-none"
                  title="Balansınız - Şəxsi Kabinetə Keç"
                >
                  <Wallet className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#D4AF37] flex-shrink-0 group-hover:scale-105 transition-transform" />
                  <div className="text-left flex flex-col justify-center">
                    <span className="text-[7.5px] sm:text-[8px] uppercase font-bold tracking-wider text-neutral-400 leading-none">
                      Balans
                    </span>
                    <span className="text-[11px] sm:text-xs font-black text-[#F6E09E] leading-tight whitespace-nowrap mt-0.5 font-sans">
                      {user.balance.toFixed(2)} AZN
                    </span>
                  </div>
                </div>

                {/* Deposit Action */}
                <button
                  onClick={() => setIsDepositModalOpen(true)}
                  id="nav-deposit-btn"
                  className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-bold text-[#070B11] bg-gradient-to-r from-[#F6E09E] to-[#D4AF37] hover:brightness-110 flex items-center gap-1.5 shadow-[0_0_15px_rgba(212,175,55,0.25)] transition-all active:scale-95 cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span className="hidden sm:inline">Depozit</span>
                </button>

                {/* Notifications Bell */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setIsNotificationsOpen(!isNotificationsOpen);
                      setIsProfileOpen(false);
                    }}
                    id="nav-notifications-btn"
                    className="relative p-2 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:text-white hover:border-[#D4AF37]/40 transition-all min-w-[38px] min-h-[38px] flex items-center justify-center cursor-pointer"
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
                    <div className="absolute right-0 mt-3 w-72 sm:w-80 rounded-2xl p-4 shadow-2xl z-50 border border-white/10 bg-[#0E1624]/98 backdrop-blur-2xl">
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

                {/* Profile Avatar & Menu */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setIsProfileOpen(!isProfileOpen);
                      setIsNotificationsOpen(false);
                    }}
                    id="nav-profile-btn"
                    className="flex items-center gap-2 p-1 rounded-xl hover:bg-white/5 transition-all text-left cursor-pointer"
                  >
                    <div className="w-8 sm:w-9 h-8 sm:h-9 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#F6E09E] text-[#070B11] flex items-center justify-center font-bold text-xs shadow-sm flex-shrink-0">
                      {user.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase() || 'U'}
                    </div>
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-3 w-56 rounded-2xl p-2 shadow-2xl z-50 border border-white/10 bg-[#0E1624]/98 backdrop-blur-2xl">
                      <div className="px-3 py-2 border-b border-white/10 mb-1">
                        <p className="text-xs font-bold text-white truncate">{user.name}</p>
                        <p className="text-[11px] text-white/40 truncate">{user.email}</p>
                      </div>

                      <button
                        onClick={() => navigateTo('dashboard')}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-white/80 hover:text-[#F6E09E] hover:bg-white/5 rounded-xl transition-colors text-left"
                      >
                        <LayoutDashboard className="w-4 h-4 text-[#D4AF37]" />
                        <span>İnvestor Kabineti</span>
                      </button>

                      <button
                        onClick={() => navigateTo('history')}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-white/80 hover:text-[#F6E09E] hover:bg-white/5 rounded-xl transition-colors text-left"
                      >
                        <FileCheck className="w-4 h-4 text-[#D4AF37]" />
                        <span>Əməliyyat Tarixçəsi</span>
                      </button>

                      <button
                        onClick={() => {
                          logout();
                          setIsProfileOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-rose-400 hover:bg-rose-950/30 rounded-xl transition-colors mt-1 border-t border-white/10 text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Çıxış et</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Non-logged in: Login & Register Buttons */
              <div className="flex items-center gap-1.5 sm:gap-2.5">
                <button
                  onClick={() => openAuthModal('login')}
                  id="nav-login-btn"
                  className="px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-[#F6E09E] bg-white/5 hover:bg-white/10 border border-white/10 transition-all hover:border-[#D4AF37]/50 whitespace-nowrap min-h-[38px] cursor-pointer"
                >
                  Daxil ol
                </button>

                <button
                  onClick={() => openAuthModal('register')}
                  id="nav-register-btn"
                  className="px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-[#070B11] bg-gradient-to-r from-[#F6E09E] to-[#D4AF37] hover:brightness-110 shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all active:scale-95 whitespace-nowrap min-h-[38px] cursor-pointer"
                >
                  Qeydiyyat
                </button>
              </div>
            )}

            {/* UNIFIED HAMBURGER MENU BUTTON (All screens) */}
            <button
              onClick={() => setIsMenuOpen(true)}
              id="hamburger-menu-btn"
              className="p-2 sm:p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-[#D4AF37]/40 text-[#F6E09E] hover:text-white transition-all flex items-center gap-1.5 shadow-[0_0_12px_rgba(212,175,55,0.15)] min-w-[40px] min-h-[40px] justify-center cursor-pointer active:scale-95"
              aria-label="Əsas Menyu"
            >
              <Menu className="w-5 h-5 text-[#D4AF37]" />
              <span className="text-xs font-bold text-[#F6E09E] hidden md:inline">Menyu</span>
            </button>
          </div>

        </div>
      </header>

      {/* HAMBURGER SLIDE-OVER DRAWER & BACKDROP */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[9997]">
          {/* Dimmed backdrop overlay */}
          <div
            onClick={() => setIsMenuOpen(false)}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
          />

          {/* Right Slide-over Panel */}
          <div
            className="fixed inset-y-0 right-0 w-full sm:w-[380px] max-w-full bg-[#070B11] border-l border-[#D4AF37]/30 shadow-2xl z-[9998] flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-250"
            style={{ boxShadow: '-10px 0 40px rgba(0,0,0,0.8)' }}
          >
            {/* Drawer Header */}
            <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-[#0B111B]">
              <div className="flex items-center gap-2.5">
                <VeyraLogo size="sm" is3DEmblem={true} />
                <div>
                  <h3 className="text-sm font-serif font-bold text-white tracking-wider">
                    VEYRA <span className="text-[#D4AF37]">INVEST</span>
                  </h3>
                  <p className="text-[10px] text-[#D4AF37]/70 uppercase tracking-widest">
                    Rəqəmsal Əmlak Portfeli
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsMenuOpen(false)}
                id="close-hamburger-btn"
                className="p-2 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Bağla"
              >
                <X className="w-5 h-5 text-[#D4AF37]" />
              </button>
            </div>

            {/* User status card inside Drawer */}
            <div className="p-4 border-b border-white/10 bg-[#0E1624]/60">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-white/50 uppercase tracking-wider">İnvestor</p>
                      <p className="text-sm font-bold text-white truncate max-w-[200px]">{user.name}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Aktiv
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-black/40 border border-[#D4AF37]/30 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] uppercase font-bold tracking-wider text-white/50 block">Balans</span>
                      <span className="text-sm font-black text-[#F6E09E] font-sans">
                        {user.balance.toFixed(2)} AZN
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        setIsDepositModalOpen(true);
                      }}
                      className="px-2.5 py-1 rounded-lg text-xs font-black text-neutral-950 bg-gradient-to-r from-[#F6E09E] to-[#D4AF37] flex items-center gap-1 transition-transform active:scale-95 shadow-sm"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>Artır</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      openAuthModal('login');
                    }}
                    className="py-2.5 px-3 rounded-xl text-xs font-bold text-[#F6E09E] bg-white/5 border border-white/15 hover:bg-white/10 transition-colors text-center"
                  >
                    Daxil ol
                  </button>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      openAuthModal('register');
                    }}
                    className="py-2.5 px-3 rounded-xl text-xs font-bold text-neutral-950 bg-gradient-to-r from-[#F6E09E] to-[#D4AF37] hover:brightness-110 transition-all text-center shadow-sm"
                  >
                    Qeydiyyat
                  </button>
                </div>
              )}
            </div>

            {/* Menu Items List */}
            <div className="flex-1 p-3 space-y-1 overflow-y-auto">
              {/* Android APK Download Card in Menu */}
              <div className="px-1 py-1 mb-2">
                <a
                  href={ACTIVE_APK_DOWNLOAD_URL} 
                  download={APK_CONFIG.fileName}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2.5 px-4 py-3 rounded-2xl bg-gradient-to-r from-[#D4AF37] via-[#F6E09E] to-[#AA771C] text-black font-extrabold text-xs shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:scale-[1.02] transition-transform duration-200 cursor-pointer"
                >
                  <svg className="w-5 h-5 fill-current flex-shrink-0" viewBox="0 0 24 24">
                    <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.551 0 .9993.4482.9993.9993.0001.5511-.4483.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.416.416 0 00-.5676.1521l-2.0223 3.503C15.5802 8.4234 13.8554 8.134 12 8.134c-1.8554 0-3.5802.2894-5.1828.8157L4.7949 5.4467a.4161.4161 0 00-.5676-.1521.4157.4157 0 00-.1521.5676l1.9973 3.4592C2.6889 11.1867.3432 14.6589 0 18.761h24c-.3432-4.1021-2.6889-7.5743-6.1185-9.4396"/>
                  </svg>
                  <div className="flex flex-col text-left leading-tight">
                    <span>Android Tətbiqini Yüklə (.APK)</span>
                    <span className="text-[9px] font-semibold text-black/70">v1.0.0 • Rəsmi Buraxılış</span>
                  </div>
                </a>
              </div>

              <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]/70 px-3 py-1 block">
                Bütün Bölmələr
              </span>

              {menuItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = activeView === item.id;
                return (
                  <a
                    key={item.id}
                    href={item.path}
                    onClick={(e) => {
                      e.preventDefault();
                      navigateTo(item.id);
                    }}
                    className={`w-full text-left px-3.5 py-3 rounded-xl text-sm font-semibold flex items-center justify-between transition-all min-h-[44px] cursor-pointer group ${
                      isActive
                        ? 'bg-[#D4AF37]/20 text-[#F6E09E] border border-[#D4AF37]/50 shadow-[0_0_15px_rgba(212,175,55,0.15)]'
                        : 'text-neutral-200 hover:bg-white/5 hover:text-white border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                          isActive
                            ? 'bg-[#D4AF37] text-neutral-950'
                            : 'bg-white/5 text-[#D4AF37] group-hover:bg-[#D4AF37]/20'
                        }`}
                      >
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <span>{item.label}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {item.badge && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                          {item.badge}
                        </span>
                      )}
                      <ChevronRight
                        className={`w-4 h-4 transition-transform ${
                          isActive ? 'text-[#D4AF37] translate-x-0.5' : 'text-neutral-600 group-hover:text-neutral-400'
                        }`}
                      />
                    </div>
                  </a>
                );
              })}
            </div>

            {/* Drawer Footer: User Logout & HIDDEN ADMIN ACCESS */}
            <div className="p-4 border-t border-white/10 bg-[#0B111B] space-y-3">
              {user && (
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full py-2.5 px-3 rounded-xl text-xs font-semibold text-rose-400 bg-rose-950/20 hover:bg-rose-950/40 border border-rose-900/30 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Hesabdan Çıxış et</span>
                </button>
              )}

              {/* HIDDEN ADMIN PORTAL ACCESS (Discreet at bottom as requested) */}
              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-neutral-500">
                <span className="select-none text-[10px]">
                  Veyra Invest v2.4 • 2026
                </span>

                {/* Secret discreet lock button to access Admin Panel */}
                <button
                  onClick={() => navigateTo('admin')}
                  id="secret-admin-trigger-btn"
                  title="Sistem İdarəetməsi"
                  className="flex items-center gap-1 text-neutral-500 hover:text-amber-400 p-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group"
                >
                  <Lock className="w-3.5 h-3.5 group-hover:text-amber-400 transition-colors" />
                  <span className="text-[10px] opacity-75 group-hover:opacity-100">Sistem</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

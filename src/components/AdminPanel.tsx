import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import type { VeyraHomeStage, DepositRequest, PaymentSettings, DepositPlan } from '../types';
import {
  ShieldAlert,
  CheckCircle,
  XCircle,
  FileText,
  Users,
  CreditCard,
  Building,
  TrendingUp,
  Search,
  Eye,
  AlertCircle,
  Clock,
  Layers,
  Sparkles,
  ArrowDownLeft,
  ArrowUpRight,
  RefreshCw,
  Lock,
  Key,
  ArrowLeft,
  LogOut,
  Package,
  Edit3,
  Sliders,
  Check,
  DollarSign,
  PieChart,
  Activity,
  UserCheck,
  UserX,
  ShieldCheck,
  Wallet,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Maximize2,
  Filter,
  Plus,
  Trash2,
  Calendar,
  Settings,
  Info,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const {
    isAdmin,
    loginAdmin,
    logoutAdmin,
    setActiveView,
    depositRequests,
    withdrawalRequests,
    transactions: ledger,
    users,
    stages,
    userInvestments,
    approveDeposit,
    rejectDeposit,
    approveWithdrawal,
    rejectWithdrawal,
    updateStage,
    toggleUserStatus,
    updateUserBalance,
    paymentSettings,
    depositPlans,
    depositStats,
    refreshDeposits,
    refreshPaymentSettings,
    refreshDepositPlans,
    updatePaymentSettings,
    upsertDepositPlan,
    deleteDepositPlan,
  } = useApp();

  const [adminPassword, setAdminPassword] = useState('');
  const [adminAuthError, setAdminAuthError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Tabs: 'deposits' | 'withdrawals' | 'investments' | 'stages' | 'users' | 'ledger' | 'payment_settings' | 'deposit_plans'
  const [activeTab, setActiveTab] = useState<
    'deposits' | 'withdrawals' | 'investments' | 'stages' | 'users' | 'ledger' | 'payment_settings' | 'deposit_plans'
  >('deposits');

  // Deposit Filters & Pagination State
  const [depositSearch, setDepositSearch] = useState<string>('');
  const [depositStatusFilter, setDepositStatusFilter] = useState<'all' | 'pending' | 'completed' | 'rejected'>('all');
  const [depositPlanFilter, setDepositPlanFilter] = useState<string>('all');
  const [depositSort, setDepositSort] = useState<'newest' | 'oldest'>('newest');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  // Receipt Viewer Modal State
  const [viewingReceipt, setViewingReceipt] = useState<{
    url: string;
    depositId: string;
    userName: string;
    date: string;
  } | null>(null);
  const [receiptZoom, setReceiptZoom] = useState<number>(1);
  const [receiptRotation, setReceiptRotation] = useState<number>(0);

  // Deposit Detail Modal
  const [selectedDepositDetails, setSelectedDepositDetails] = useState<DepositRequest | null>(null);

  // Approve Modal State
  const [approveModalDeposit, setApproveModalDeposit] = useState<DepositRequest | null>(null);
  const [approveNote, setApproveNote] = useState<string>('');
  const [isActionLoading, setIsActionLoading] = useState<boolean>(false);

  // Reject Modal State
  const [rejectModalDeposit, setRejectModalDeposit] = useState<DepositRequest | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>('');
  const [rejectVerificationNote, setRejectVerificationNote] = useState<string>('');

  // Withdrawal Reject Modal State
  const [withdrawalRejectId, setWithdrawalRejectId] = useState<string | null>(null);
  const [withdrawalRejectReason, setWithdrawalRejectReason] = useState<string>('');

  // Payment Settings Form State
  const [editingPaymentSettings, setEditingPaymentSettings] = useState<PaymentSettings>({
    bankName: paymentSettings?.bankName || 'Kapital Bank / Birbank',
    accountHolder: paymentSettings?.accountHolder || 'Veyra İnvest',
    cardNumber: paymentSettings?.cardNumber || '4169 7388 4952 8363',
    maskedCard: paymentSettings?.maskedCard || '4169 7388 4952 8363',
    iban: paymentSettings?.iban || 'AZ45NABZ01350100000000123456',
    paymentMethod: paymentSettings?.paymentMethod || 'Bank Kartı (MilliÖN / eManat / Mobil Bankçılıq)',
    instructions: paymentSettings?.instructions || 'Ödənişi göstərilən hesaba/karta köçürün və ödəniş etdikdən sonra qəbzi yükləyin.',
    isActive: paymentSettings?.isActive ?? true,
  });
  const [paymentSettingsSaveSuccess, setPaymentSettingsSaveSuccess] = useState<boolean>(false);

  // Plan Edit/Create Modal State
  const [editingPlan, setEditingPlan] = useState<Partial<DepositPlan> | null>(null);

  // Balance edit modal state
  const [balanceModalUser, setBalanceModalUser] = useState<any | null>(null);
  const [newBalanceInput, setNewBalanceInput] = useState<string>('');
  const [balanceEditSuccess, setBalanceEditSuccess] = useState<string | null>(null);

  // Editing product/stage modal state
  const [editingStage, setEditingStage] = useState<VeyraHomeStage | null>(null);

  // Filtered & Paginated Deposit Records (Must be called unconditionally before any early return)
  const filteredDeposits = useMemo(() => {
    return depositRequests.filter((req) => {
      // Search
      if (depositSearch.trim()) {
        const query = depositSearch.toLowerCase().trim();
        const matchesUser =
          req.userName?.toLowerCase().includes(query) ||
          req.userEmail?.toLowerCase().includes(query) ||
          req.userId?.toLowerCase().includes(query);
        const matchesRef = req.referenceCode?.toLowerCase().includes(query);
        const matchesId = req.id.toLowerCase().includes(query);
        if (!matchesUser && !matchesRef && !matchesId) return false;
      }

      // Status
      if (depositStatusFilter !== 'all') {
        if (depositStatusFilter === 'completed') {
          if (req.status !== 'completed' && req.status !== 'approved') return false;
        } else if (req.status !== depositStatusFilter) {
          return false;
        }
      }

      // Plan
      if (depositPlanFilter !== 'all') {
        if (req.planId !== depositPlanFilter) return false;
      }

      return true;
    }).sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return depositSort === 'newest' ? dateB - dateA : dateA - dateB;
    });
  }, [depositRequests, depositSearch, depositStatusFilter, depositPlanFilter, depositSort]);

  // Admin password gate
  const handleAdminLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminAuthError(null);
    if (!adminPassword) {
      setAdminAuthError('Zəhmət olmasa admin şifrəsini daxil edin');
      return;
    }

    setIsAuthenticating(true);
    try {
      const result = await loginAdmin(adminPassword);
      if (!result.success) {
        setAdminAuthError(result.error || 'Təhlükəsizlik xətası: Parol yalnışdır! Daxil olmaq hüququnuz yoxdur.');
      } else {
        setAdminPassword('');
      }
    } catch {
      setAdminAuthError('Serverlə əlaqə qurulmadı. Zəhmət olmasa təkrar cəhd edin.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="w-full min-h-[85vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl glass-card border border-amber-500/40 bg-[#0E1624]/95 shadow-[0_10px_40px_rgba(0,0,0,0.8)] relative text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-4 text-amber-400 shadow-lg">
            <Lock className="w-8 h-8 stroke-[1.8]" />
          </div>

          <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-amber-500/15 text-amber-300 border border-amber-500/30 inline-block mb-3">
            Məxfi Admin Girişi
          </span>

          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
            Admin Panelinə Giriş
          </h2>
          <p className="text-xs text-neutral-400 leading-relaxed mb-6">
            Bu bölmə yalnız sistem rəhbəri üçün nəzərdə tutulub. Server tərəfindən yoxlanılan admin şifrəsini daxil edin.
          </p>

          {adminAuthError && (
            <div className="p-3 mb-4 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs text-center flex items-center gap-2 justify-center">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{adminAuthError}</span>
            </div>
          )}

          <form onSubmit={handleAdminLoginSubmit} className="space-y-4">
            <div className="relative">
              <Key className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Admin parolunu daxil edin"
                autoFocus
                disabled={isAuthenticating}
                className="w-full pl-10 pr-10 py-3 rounded-xl bg-neutral-900/90 border border-neutral-800 text-white placeholder-neutral-500 text-sm focus:border-amber-500 focus:outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>

            <button
              type="submit"
              id="admin-login-submit-btn"
              disabled={isAuthenticating}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#F6E09E] via-[#D4AF37] to-[#B88E1D] text-neutral-950 font-bold text-sm hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_4px_20px_rgba(212,175,55,0.3)] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isAuthenticating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Serverdə Yoxlanılır...</span>
                </>
              ) : (
                <span>Daxil Ol</span>
              )}
            </button>
          </form>

          <button
            type="button"
            onClick={() => setActiveView('dashboard')}
            className="mt-6 text-xs text-neutral-400 hover:text-white flex items-center justify-center gap-1.5 mx-auto transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>İnvestor səhifəsinə qayıt</span>
          </button>
        </div>
      </div>
    );
  }

  // Pending counters
  const pendingDeposits = depositRequests.filter((d) => d.status === 'pending');
  const pendingWithdrawals = withdrawalRequests.filter((w) => w.status === 'pending');

  const totalPages = Math.ceil(filteredDeposits.length / pageSize) || 1;
  const paginatedDeposits = filteredDeposits.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Statistics calculation (prioritizing backend real stats if available)
  const statsTotalDeposits = depositStats?.totalDeposits ?? depositRequests.length;
  const statsPendingDeposits = depositStats?.pendingDeposits ?? pendingDeposits.length;
  const statsApprovedDeposits =
    depositStats?.approvedDeposits ??
    depositRequests.filter((d) => d.status === 'completed' || d.status === 'approved').length;
  const statsRejectedDeposits =
    depositStats?.rejectedDeposits ?? depositRequests.filter((d) => d.status === 'rejected').length;

  const statsTotalAmount =
    depositStats?.totalDepositedAmount ?? depositRequests.reduce((acc, c) => acc + c.amount, 0);
  const statsApprovedAmount =
    depositStats?.totalApprovedAmount ??
    depositRequests
      .filter((d) => d.status === 'completed' || d.status === 'approved')
      .reduce((acc, c) => acc + c.amount, 0);
  const statsPendingAmount =
    depositStats?.totalPendingAmount ?? pendingDeposits.reduce((acc, c) => acc + c.amount, 0);
  const statsRejectedAmount =
    depositStats?.totalRejectedAmount ??
    depositRequests.filter((d) => d.status === 'rejected').reduce((acc, c) => acc + c.amount, 0);

  const statsTodayDeposits = depositStats?.todayDeposits ?? 0;
  const statsTodayAmount = depositStats?.todayDepositedAmount ?? 0;

  // Approve Deposit Handler
  const handleConfirmApprove = async () => {
    if (!approveModalDeposit) return;
    setIsActionLoading(true);
    try {
      await approveDeposit(approveModalDeposit.id, approveNote);
      setApproveModalDeposit(null);
      setApproveNote('');
      await refreshDeposits();
    } catch (err: any) {
      alert(err.message || 'Təsdiqləmə zamanı xəta baş verdi');
    } finally {
      setIsActionLoading(false);
    }
  };

  // Reject Deposit Handler
  const handleConfirmReject = async () => {
    if (!rejectModalDeposit) return;
    if (!rejectionReason.trim()) {
      alert('Zəhmət olmasa rədd etmə səbəbini daxil edin');
      return;
    }
    setIsActionLoading(true);
    try {
      await rejectDeposit(rejectModalDeposit.id, rejectionReason.trim(), rejectVerificationNote);
      setRejectModalDeposit(null);
      setRejectionReason('');
      setRejectVerificationNote('');
      await refreshDeposits();
    } catch (err: any) {
      alert(err.message || 'Rədd etmə zamanı xəta baş verdi');
    } finally {
      setIsActionLoading(false);
    }
  };

  // Save Payment Settings Handler
  const handleSavePaymentSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsActionLoading(true);
    try {
      await updatePaymentSettings(editingPaymentSettings);
      setPaymentSettingsSaveSuccess(true);
      setTimeout(() => setPaymentSettingsSaveSuccess(false), 3000);
      await refreshPaymentSettings();
    } catch (err: any) {
      alert(err.message || 'Yadda saxlanılarkən xəta baş verdi');
    } finally {
      setIsActionLoading(false);
    }
  };

  // Save Plan Handler
  const handleSavePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan || !editingPlan.name) return;
    setIsActionLoading(true);
    try {
      await upsertDepositPlan(editingPlan);
      setEditingPlan(null);
      await refreshDepositPlans();
    } catch (err: any) {
      alert(err.message || 'Plan saxlanılarkən xəta baş verdi');
    } finally {
      setIsActionLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen py-6 sm:py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-[#170E08] via-[#0E1624] to-[#070B11] border border-amber-600/40 shadow-2xl mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
              <ShieldAlert className="w-3 h-3 text-amber-400" />
              Mərkəzi Nəzarət və Təsdiq Paneli
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Veyra Invest <span className="gold-gradient-text font-serif">Admin Portal</span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Real verilənlər bazası ilə inteqrasiya olunmuş depozit təsdiqləri, maliyyə tənzimləmələri və audit jurnalı
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => refreshDeposits()}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 transition-all"
            title="Yenilə"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setActiveView('dashboard')}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>İnvestor Kabineti</span>
          </button>
          <button
            onClick={logoutAdmin}
            id="admin-logout-btn"
            className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95"
          >
            <LogOut className="w-4 h-4" />
            <span>Çıxış</span>
          </button>
        </div>
      </div>

      {/* REAL DATABASE STATS GRID */}
      <div className="mb-8 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-amber-400" />
            Mərkəzi Depozit Statistikası (Həqiqi Məlumatlar)
          </h2>
          <span className="text-[11px] text-neutral-500 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Canlı server sinxronizasiyası
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {/* Approved Amount */}
          <div className="p-4 rounded-2xl glass-card border border-emerald-500/30 bg-[#0E1624]/70">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
              Təsdiqlənmiş Məbləğ
            </span>
            <span className="text-xl sm:text-2xl font-black text-emerald-400 mt-1 block">
              {statsApprovedAmount.toLocaleString('az-AZ', { minimumFractionDigits: 2 })} ₼
            </span>
            <span className="text-[10px] text-emerald-500/80 block mt-0.5">
              {statsApprovedDeposits} təsdiqlənmiş əməliyyat
            </span>
          </div>

          {/* Pending Amount */}
          <div className="p-4 rounded-2xl glass-card border border-amber-500/30 bg-[#0E1624]/70">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
              Gözləyən Depozitlər
            </span>
            <span className="text-xl sm:text-2xl font-black text-amber-400 mt-1 block">
              {statsPendingAmount.toLocaleString('az-AZ', { minimumFractionDigits: 2 })} ₼
            </span>
            <span className="text-[10px] text-amber-500/80 block mt-0.5">
              {statsPendingDeposits} ədəd təsdiq gözləyir
            </span>
          </div>

          {/* Rejected Amount */}
          <div className="p-4 rounded-2xl glass-card border border-rose-500/30 bg-[#0E1624]/70">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
              Rədd Edilmiş Depozit
            </span>
            <span className="text-xl sm:text-2xl font-black text-rose-400 mt-1 block">
              {statsRejectedAmount.toLocaleString('az-AZ', { minimumFractionDigits: 2 })} ₼
            </span>
            <span className="text-[10px] text-rose-500/80 block mt-0.5">
              {statsRejectedDeposits} rədd edilmiş sorğu
            </span>
          </div>

          {/* Today's Deposits */}
          <div className="p-4 rounded-2xl glass-card border border-blue-500/30 bg-[#0E1624]/70">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
              Bugünkü Həcm
            </span>
            <span className="text-xl sm:text-2xl font-black text-blue-400 mt-1 block">
              {statsTodayAmount.toLocaleString('az-AZ', { minimumFractionDigits: 2 })} ₼
            </span>
            <span className="text-[10px] text-blue-400/80 block mt-0.5">
              {statsTodayDeposits} bugünkü sifariş
            </span>
          </div>

          {/* Total Depository Volume */}
          <div className="p-4 rounded-2xl glass-card border border-neutral-800 bg-[#0E1624]/70 col-span-2 sm:col-span-1">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
              Ümumi Depozit Portfeli
            </span>
            <span className="text-xl sm:text-2xl font-black text-white mt-1 block">
              {statsTotalAmount.toLocaleString('az-AZ', { minimumFractionDigits: 2 })} ₼
            </span>
            <span className="text-[10px] text-neutral-400 block mt-0.5">
              {statsTotalDeposits} ümumi sorğu
            </span>
          </div>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex items-center gap-2 border-b border-neutral-800 pb-3 mb-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab('deposits')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'deposits'
              ? 'bg-amber-500 text-neutral-950 font-black shadow-md'
              : 'text-neutral-300 hover:bg-neutral-800'
          }`}
        >
          <ArrowDownLeft className="w-4 h-4" />
          <span>
            Depozitlər ({pendingDeposits.length > 0 ? `${pendingDeposits.length} gözləyir` : depositRequests.length})
          </span>
        </button>

        <button
          onClick={() => setActiveTab('payment_settings')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'payment_settings'
              ? 'bg-amber-500 text-neutral-950 font-black shadow-md'
              : 'text-neutral-300 hover:bg-neutral-800'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Ödəniş Rekvizitləri</span>
        </button>

        <button
          onClick={() => setActiveTab('deposit_plans')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'deposit_plans'
              ? 'bg-amber-500 text-neutral-950 font-black shadow-md'
              : 'text-neutral-300 hover:bg-neutral-800'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Depozit Planları ({depositPlans?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('withdrawals')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'withdrawals'
              ? 'bg-amber-500 text-neutral-950 font-black shadow-md'
              : 'text-neutral-300 hover:bg-neutral-800'
          }`}
        >
          <ArrowUpRight className="w-4 h-4" />
          <span>Çıxarışlar ({pendingWithdrawals.length > 0 ? `${pendingWithdrawals.length} yeni` : withdrawalRequests.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'users'
              ? 'bg-amber-500 text-neutral-950 font-black shadow-md'
              : 'text-neutral-300 hover:bg-neutral-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>İnvestorlar ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('stages')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'stages'
              ? 'bg-amber-500 text-neutral-950 font-black shadow-md'
              : 'text-neutral-300 hover:bg-neutral-800'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Mərhələlər ({stages.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('ledger')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'ledger'
              ? 'bg-amber-500 text-neutral-950 font-black shadow-md'
              : 'text-neutral-300 hover:bg-neutral-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Audit & Ledger</span>
        </button>
      </div>

      {/* TAB 1: DEDICATED DEPOSITS SECTION */}
      {activeTab === 'deposits' && (
        <div className="space-y-4">
          {/* Controls Bar: Search, Filters & Sorting */}
          <div className="p-4 rounded-2xl glass-card border border-neutral-800 bg-[#0E1624]/80 flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="İnvestor adı, email, Depozit ID və ya Referans nömrəsi ilə axtar..."
                value={depositSearch}
                onChange={(e) => {
                  setDepositSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs sm:text-sm text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Status Filter */}
              <select
                value={depositStatusFilter}
                onChange={(e: any) => {
                  setDepositStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:border-amber-500 focus:outline-none"
              >
                <option value="all">Bütün Statuslar</option>
                <option value="pending">🟡 Yoxlanılır (Gözləyir)</option>
                <option value="completed">🟢 Təsdiqləndi</option>
                <option value="rejected">🔴 Rədd edildi</option>
              </select>

              {/* Plan Filter */}
              {depositPlans && depositPlans.length > 0 && (
                <select
                  value={depositPlanFilter}
                  onChange={(e) => {
                    setDepositPlanFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-3 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:border-amber-500 focus:outline-none"
                >
                  <option value="all">Bütün Planlar</option>
                  {depositPlans.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              )}

              {/* Sort Order */}
              <select
                value={depositSort}
                onChange={(e: any) => setDepositSort(e.target.value)}
                className="px-3 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:border-amber-500 focus:outline-none"
              >
                <option value="newest">Ən yeni ilk</option>
                <option value="oldest">Ən köhnə ilk</option>
              </select>
            </div>
          </div>

          {/* Deposits Table */}
          <div className="rounded-3xl glass-card border border-neutral-800 overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-neutral-800 flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold text-white">
                  Depozit Qeydləri ({filteredDeposits.length})
                </h3>
                <p className="text-xs text-neutral-400">
                  Hər bir qeyd üzrə qəbzə baxış keçirə, təsdiq edə və ya qeyd bildirərək rədd edə bilərsiniz
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-900/90 text-neutral-400 uppercase tracking-wider text-[10px] border-b border-neutral-800">
                  <tr>
                    <th className="py-3 px-4">Depozit ID & Tarix</th>
                    <th className="py-3 px-4">İnvestor</th>
                    <th className="py-3 px-4">Məbləğ & Plan</th>
                    <th className="py-3 px-4">Referans Kodu</th>
                    <th className="py-3 px-4">Qəbz</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Əməliyyatlar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800 text-neutral-300">
                  {paginatedDeposits.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-10 text-center text-neutral-500">
                        Seçilmiş parametrlərə uyğun heç bir depozit qeydi tapılmadı.
                      </td>
                    </tr>
                  ) : (
                    paginatedDeposits.map((req) => (
                      <tr key={req.id} className="hover:bg-neutral-900/50 transition-colors">
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="font-mono font-bold text-[#F6E09E] text-xs">{req.id}</div>
                          <div className="text-[10px] text-neutral-400">
                            {new Date(req.createdAt).toLocaleString('az-AZ')}
                          </div>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="font-bold text-white">{req.userName}</div>
                          <div className="text-[10px] text-neutral-400">{req.userEmail}</div>
                          <div className="text-[9px] text-neutral-500 font-mono">ID: {req.userId}</div>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className="font-black text-sm text-white">
                            {req.amount.toFixed(2)} AZN
                          </span>
                          <span className="text-[10px] text-amber-400/80 block">
                            {req.planName || req.planId || 'Veyra Prime Plan'}
                          </span>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap font-mono text-neutral-300">
                          <span className="px-2 py-0.5 rounded bg-neutral-800 text-[11px]">
                            {req.referenceCode}
                          </span>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          {req.receiptUrl ? (
                            <button
                              type="button"
                              onClick={() => {
                                setViewingReceipt({
                                  url: req.receiptUrl!,
                                  depositId: req.id,
                                  userName: req.userName,
                                  date: req.createdAt,
                                });
                                setReceiptZoom(1);
                                setReceiptRotation(0);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Qəbzə Bax</span>
                            </button>
                          ) : (
                            <span className="text-neutral-500 text-[11px]">Yüklənməyib</span>
                          )}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          {req.status === 'pending' && (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center gap-1 w-fit">
                              <Clock className="w-3 h-3" />
                              Yoxlanılır
                            </span>
                          )}
                          {(req.status === 'completed' || req.status === 'approved') && (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1 w-fit">
                              <CheckCircle className="w-3 h-3" />
                              Təsdiqləndi
                            </span>
                          )}
                          {req.status === 'rejected' && (
                            <div>
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center gap-1 w-fit">
                                <XCircle className="w-3 h-3" />
                                Rədd edildi
                              </span>
                              {req.rejectionReason && (
                                <span className="text-[9px] text-rose-400 block truncate max-w-[140px] mt-0.5">
                                  {req.rejectionReason}
                                </span>
                              )}
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setSelectedDepositDetails(req)}
                              className="px-2.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-semibold text-[11px] flex items-center gap-1 transition-colors"
                              title="Bütün detallar"
                            >
                              <Info className="w-3.5 h-3.5" />
                              <span>Detallar</span>
                            </button>

                            {req.status === 'pending' && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setApproveModalDeposit(req);
                                    setApproveNote('');
                                  }}
                                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center gap-1 transition-colors shadow-sm"
                                >
                                  <CheckCircle className="w-3.5 h-3.5" />
                                  <span>Təsdiqlə</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setRejectModalDeposit(req);
                                    setRejectionReason('');
                                    setRejectVerificationNote('');
                                  }}
                                  className="px-3 py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600/40 text-rose-300 border border-rose-600/40 font-bold text-[11px] flex items-center gap-1 transition-colors"
                                >
                                  <XCircle className="w-3.5 h-3.5" />
                                  <span>Rədd et</span>
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="p-4 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
                <span>
                  Səhifə {currentPage} / {totalPages} (Cəmi: {filteredDeposits.length} qeyd)
                </span>
                <div className="flex items-center gap-2">
                  <button
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: PAYMENT SETTINGS */}
      {activeTab === 'payment_settings' && (
        <div className="max-w-3xl space-y-6">
          <div className="p-6 rounded-3xl glass-card border border-neutral-800 bg-[#0E1624]/90 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800 mb-5">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-amber-400" />
                  Ödəniş Rekvizitlərinin İdarə Edilməsi
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Burada dəyişdirilən məlumatlar dərhal bütün investorların depozit pəncərəsində əks olunur
                </p>
              </div>
            </div>

            {paymentSettingsSaveSuccess && (
              <div className="p-3 mb-4 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                <span>Ödəniş rekvizitləri mərkəzi serverdə uğurla yeniləndi!</span>
              </div>
            )}

            <form onSubmit={handleSavePaymentSettings} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">
                  Bank / Xidmət Adı:
                </label>
                <input
                  type="text"
                  value={editingPaymentSettings.bankName}
                  onChange={(e) =>
                    setEditingPaymentSettings({ ...editingPaymentSettings, bankName: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs sm:text-sm focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">
                  Hesab Sahibi / Təşkilat Adı:
                </label>
                <input
                  type="text"
                  value={editingPaymentSettings.accountHolder}
                  onChange={(e) =>
                    setEditingPaymentSettings({ ...editingPaymentSettings, accountHolder: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs sm:text-sm focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">
                    Tam Kart Nömrəsi (Kopyalamaq üçün):
                  </label>
                  <input
                    type="text"
                    value={editingPaymentSettings.cardNumber}
                    onChange={(e) =>
                      setEditingPaymentSettings({ ...editingPaymentSettings, cardNumber: e.target.value })
                    }
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs sm:text-sm font-mono focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">
                    Maskalanmış Kart Göstərişi:
                  </label>
                  <input
                    type="text"
                    value={editingPaymentSettings.maskedCard}
                    onChange={(e) =>
                      setEditingPaymentSettings({ ...editingPaymentSettings, maskedCard: e.target.value })
                    }
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs sm:text-sm font-mono focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">
                  IBAN / Hesab Nömrəsi:
                </label>
                <input
                  type="text"
                  value={editingPaymentSettings.iban}
                  onChange={(e) =>
                    setEditingPaymentSettings({ ...editingPaymentSettings, iban: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs sm:text-sm font-mono focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">
                  Ödəniş Təlimatı Mətni:
                </label>
                <textarea
                  rows={3}
                  value={editingPaymentSettings.instructions}
                  onChange={(e) =>
                    setEditingPaymentSettings({ ...editingPaymentSettings, instructions: e.target.value })
                  }
                  className="w-full p-3 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isActionLoading}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#F6E09E] via-[#D4AF37] to-[#B88E1D] text-neutral-950 font-bold text-xs sm:text-sm hover:brightness-110 active:scale-95 transition-all shadow-md disabled:opacity-50"
                >
                  {isActionLoading ? 'Yadda saxlanılır...' : 'Rekvizitləri Yadda Saxla'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 3: DEPOSIT PLANS MANAGEMENT */}
      {activeTab === 'deposit_plans' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-white">Depozit Planları</h3>
              <p className="text-xs text-neutral-400">
                İnvestorların depozit edərkən seçə biləcəyi investisiya planları
              </p>
            </div>
            <button
              onClick={() =>
                setEditingPlan({
                  name: 'Yeni Plan',
                  minAmount: 100,
                  maxAmount: 5000,
                  profitRate: 0.65,
                  durationDays: 30,
                  riskLevel: 'Aşağı',
                  isActive: true,
                })
              }
              className="px-4 py-2.5 rounded-xl bg-amber-500 text-neutral-950 font-bold text-xs flex items-center gap-1.5 hover:bg-amber-400 transition-colors shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Yeni Plan Əlavə Et</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {depositPlans?.map((plan) => (
              <div
                key={plan.id}
                className="p-5 rounded-2xl glass-card border border-neutral-800 bg-[#0E1624]/70 space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-bold text-white">{plan.name}</h4>
                    <span className="text-[10px] text-neutral-400">{plan.id}</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                      plan.isActive
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {plan.isActive ? 'Aktiv' : 'Deaktiv'}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs">
                  {plan.dailyIncome ? (
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Gündəlik / Aylıq:</span>
                      <span className="text-[#F6E09E] font-bold">
                        {plan.dailyIncome.toFixed(2)} AZN / {plan.monthlyIncome} AZN
                      </span>
                    </div>
                  ) : null}
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Gəlirlilik Faizi:</span>
                    <span className="text-emerald-400 font-bold">
                      +{((plan.profitRate || 0) * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Müddət:</span>
                    <span className="text-white font-bold">{plan.durationDays} gün</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Məbləğ Aralığı:</span>
                    <span className="text-amber-300 font-bold">
                      {plan.minAmount} - {plan.maxAmount} AZN
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Risk Səviyyəsi:</span>
                    <span className="text-neutral-200">{plan.riskLevel}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-neutral-800 flex justify-end gap-2">
                  <button
                    onClick={() => setEditingPlan(plan)}
                    className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold flex items-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Düzəliş et</span>
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`"${plan.name}" planını silmək istədiyinizdən əminsiniz?`)) {
                        deleteDepositPlan(plan.id);
                      }
                    }}
                    className="p-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600/40 text-rose-400"
                    title="Sil"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: WITHDRAWAL REQUESTS */}
      {activeTab === 'withdrawals' && (
        <div className="rounded-3xl glass-card border border-neutral-800 overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-neutral-800">
            <h3 className="text-base font-bold text-white">Çıxarış Sorğuları</h3>
            <p className="text-xs text-neutral-400">
              İnvestorların təqdim etdiyi bank kartına pul çıxarış sorğuları
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-900/90 text-neutral-400 uppercase tracking-wider text-[10px] border-b border-neutral-800">
                <tr>
                  <th className="py-3 px-4">Tarix</th>
                  <th className="py-3 px-4">İnvestor</th>
                  <th className="py-3 px-4">Məbləğ</th>
                  <th className="py-3 px-4">Bank Kartı</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Əməliyyat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800 text-neutral-300">
                {withdrawalRequests.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-neutral-500">
                      Hələ heç bir çıxarış sorğusu yoxdur.
                    </td>
                  </tr>
                ) : (
                  withdrawalRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-neutral-900/50">
                      <td className="py-3 px-4 whitespace-nowrap text-neutral-400">
                        {new Date(req.createdAt).toLocaleString('az-AZ')}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap font-bold text-white">
                        {req.userName || req.userId}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap font-black text-sm text-rose-400">
                        -{req.amount.toFixed(2)} AZN
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap font-mono text-neutral-300">
                        {req.cardNumberOrIban} ({req.cardHolderName})
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {req.status === 'pending' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40">
                            Gözləyir
                          </span>
                        )}
                        {req.status === 'completed' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                            Ödənildi
                          </span>
                        )}
                        {req.status === 'rejected' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40">
                            Rədd edildi
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-right">
                        {req.status === 'pending' && (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => approveWithdrawal(req.id)}
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px]"
                            >
                              Təsdiqlə
                            </button>
                            <button
                              onClick={() => {
                                setWithdrawalRejectId(req.id);
                                setWithdrawalRejectReason('');
                              }}
                              className="px-3 py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600/40 text-rose-300 text-[11px]"
                            >
                              Rədd et
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: USERS & INVESTORS */}
      {activeTab === 'users' && (
        <div className="rounded-3xl glass-card border border-neutral-800 overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-neutral-800">
            <h3 className="text-base font-bold text-white">Qeydiyyatdan Keçmiş İnvestorlar</h3>
            <p className="text-xs text-neutral-400">
              İnvestorların real balansı və hesab statusu
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-900/90 text-neutral-400 uppercase tracking-wider text-[10px] border-b border-neutral-800">
                <tr>
                  <th className="py-3 px-4">İnvestor</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Balans</th>
                  <th className="py-3 px-4">KYC</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Əməliyyat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800 text-neutral-300">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-neutral-900/50">
                    <td className="py-3 px-4 whitespace-nowrap font-bold text-white">
                      {u.name}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-neutral-400">
                      {u.email}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap font-black text-sm text-[#F6E09E]">
                      {(u.balance || 0).toFixed(2)} AZN
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {u.kyc?.isVerified ? (
                        <span className="text-emerald-400 font-bold">✓ Təsdiqli</span>
                      ) : (
                        <span className="text-neutral-500">Təsdiqlənməyib</span>
                      )}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          u.isActive
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-rose-500/20 text-rose-400'
                        }`}
                      >
                        {u.isActive ? 'Aktiv' : 'Dondurulub'}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setBalanceModalUser(u);
                            setNewBalanceInput(u.balance.toString());
                          }}
                          className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-[11px] font-semibold"
                        >
                          Balansı Dəyiş
                        </button>
                        <button
                          onClick={() => toggleUserStatus(u.id)}
                          className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 text-[11px]"
                        >
                          {u.isActive ? 'Dondur' : 'Aç'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: STAGES */}
      {activeTab === 'stages' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stages.map((stage) => (
            <div
              key={stage.id}
              className="p-5 rounded-2xl glass-card border border-neutral-800 bg-[#0E1624]/60 space-y-3"
            >
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-white">Mərhələ #{stage.id}</span>
                <span className="text-xs font-mono font-bold text-[#F6E09E]">
                  {stage.minAmount} AZN
                </span>
              </div>
              <h4 className="text-sm font-black text-amber-400">{stage.stageTitle}</h4>
              <p className="text-[11px] text-neutral-400 leading-relaxed line-clamp-2">
                {stage.description}
              </p>
              <div className="pt-2 border-t border-neutral-800 flex justify-end">
                <button
                  onClick={() => setEditingStage(stage)}
                  className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold"
                >
                  Düzəliş et
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 7: AUDIT & LEDGER */}
      {activeTab === 'ledger' && (
        <div className="rounded-3xl glass-card border border-neutral-800 overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-neutral-800">
            <h3 className="text-base font-bold text-white">Elektron Audit və Ledger Jurnalı</h3>
            <p className="text-xs text-neutral-400">
              Bütün təsdiqlənmiş və rədd edilmiş maliyyə əməliyyatlarının dəyişdirilməz arxivi
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-900/90 text-neutral-400 uppercase tracking-wider text-[10px] border-b border-neutral-800">
                <tr>
                  <th className="py-3 px-4">Tarix</th>
                  <th className="py-3 px-4">Növ</th>
                  <th className="py-3 px-4">Məbləğ</th>
                  <th className="py-3 px-4">Açıqlama</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800 text-neutral-300">
                {ledger.map((entry) => (
                  <tr key={entry.id} className="hover:bg-neutral-900/50">
                    <td className="py-3 px-4 whitespace-nowrap text-neutral-400 font-mono">
                      {new Date(entry.timestamp).toLocaleString('az-AZ')}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap uppercase font-bold text-amber-400">
                      {entry.type}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap font-black">
                      {entry.amount.toFixed(2)} {entry.currency}
                    </td>
                    <td className="py-3 px-4 text-neutral-300">{entry.description}</td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-neutral-800 text-neutral-300">
                        {entry.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODALS */}
      {/* ========================================================================= */}

      {/* 1. PROFESSIONAL RECEIPT VIEWER MODAL (Zoom, Rotate, Fullscreen) */}
      {viewingReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md">
          <div className="relative max-w-3xl w-full bg-[#0E1624] rounded-3xl p-5 sm:p-6 border border-[#D4AF37]/50 shadow-2xl flex flex-col max-h-[92vh]">
            {/* Header */}
            <div className="flex justify-between items-center pb-3 border-b border-neutral-800 mb-3">
              <div>
                <h4 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#D4AF37]" />
                  Ödəniş Çekinin Detallı İncələnməsi
                </h4>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  Depozit: <span className="text-[#F6E09E] font-mono">{viewingReceipt.depositId}</span> • İnvestor: {viewingReceipt.userName}
                </p>
              </div>
              <button
                onClick={() => setViewingReceipt(null)}
                className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800"
              >
                ✕
              </button>
            </div>

            {/* Toolbar: Zoom In, Zoom Out, Rotate, Reset */}
            <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-neutral-900 border border-neutral-800 mb-3 text-xs">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setReceiptZoom((z) => Math.min(3, z + 0.25))}
                  className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 flex items-center gap-1"
                  title="Yaxınlaşdır"
                >
                  <ZoomIn className="w-4 h-4" />
                  <span className="hidden sm:inline">Böyüt</span>
                </button>
                <button
                  type="button"
                  onClick={() => setReceiptZoom((z) => Math.max(0.5, z - 0.25))}
                  className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 flex items-center gap-1"
                  title="Uzaqlaşdır"
                >
                  <ZoomOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Kiçilt</span>
                </button>
                <button
                  type="button"
                  onClick={() => setReceiptRotation((r) => (r + 90) % 360)}
                  className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 flex items-center gap-1"
                  title="Fırlat"
                >
                  <RotateCw className="w-4 h-4" />
                  <span className="hidden sm:inline">Fırlat</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setReceiptZoom(1);
                    setReceiptRotation(0);
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 text-[11px]"
                >
                  Sıfırla
                </button>
              </div>

              <span className="text-[11px] text-neutral-400 font-mono">
                Ölçü: {Math.round(receiptZoom * 100)}% • Bucaq: {receiptRotation}°
              </span>
            </div>

            {/* Receipt Image Stage */}
            <div className="flex-1 w-full overflow-auto flex items-center justify-center bg-black/70 rounded-2xl p-4 border border-neutral-800 min-h-[300px]">
              <img
                src={viewingReceipt.url}
                alt="Ödəniş çeki"
                style={{
                  transform: `scale(${receiptZoom}) rotate(${receiptRotation}deg)`,
                  transition: 'transform 0.2s ease-out',
                }}
                className="max-w-full max-h-[60vh] object-contain rounded-lg shadow-lg"
              />
            </div>

            {/* Footer */}
            <div className="mt-4 flex justify-between items-center text-xs">
              <span className="text-neutral-400">
                Yüklənmə tarixi: {new Date(viewingReceipt.date).toLocaleString('az-AZ')}
              </span>
              <button
                onClick={() => setViewingReceipt(null)}
                className="px-5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold"
              >
                Pəncərəni bağla
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. APPROVE MODAL WITH VERIFICATION NOTE */}
      {approveModalDeposit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative max-w-md w-full bg-[#0E1624] rounded-3xl p-6 border border-emerald-600/50 shadow-2xl space-y-4">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              Depoziti Təsdiqlə və Balansa Əlavə Et
            </h4>

            <div className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-neutral-400">İnvestor:</span>
                <span className="font-bold text-white">{approveModalDeposit.userName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Təsdiq olunacaq məbləğ:</span>
                <span className="font-extrabold text-emerald-400 font-mono text-sm">
                  +{approveModalDeposit.amount.toFixed(2)} AZN
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Referans Kodu:</span>
                <span className="font-mono text-neutral-300">{approveModalDeposit.referenceCode}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1">
                Təsdiq Qeydi (İstəyə bağlı):
              </label>
              <input
                type="text"
                value={approveNote}
                onChange={(e) => setApproveNote(e.target.value)}
                placeholder="Məsələn: Kapital Bank çıxarışı ilə yoxlanıldı və təsdiq edildi"
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setApproveModalDeposit(null)}
                className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 text-xs font-semibold hover:bg-neutral-700"
              >
                Ləğv et
              </button>
              <button
                type="button"
                disabled={isActionLoading}
                onClick={handleConfirmApprove}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md disabled:opacity-50"
              >
                {isActionLoading ? 'Təsdiqlənir...' : 'Təsdiqlə və Balansı Artır'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. REJECT MODAL WITH REQUIRED REASON & NOTE */}
      {rejectModalDeposit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative max-w-md w-full bg-[#0E1624] rounded-3xl p-6 border border-rose-600/50 shadow-2xl space-y-4">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <XCircle className="w-5 h-5 text-rose-400" />
              Depozit Sorğusunu Rədd Et
            </h4>

            <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 text-xs flex justify-between items-center">
              <span className="text-neutral-400">İnvestor & Məbləğ:</span>
              <span className="font-bold text-white">
                {rejectModalDeposit.userName} ({rejectModalDeposit.amount.toFixed(2)} AZN)
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1">
                Rədd Edilmə Səbəbi * (İnvestorun ekranında görünəcək):
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Məs: Bank çıxarışında ödəniş qeydə alınmadı və ya çek oxunmur..."
                rows={3}
                required
                className="w-full p-3 rounded-xl bg-neutral-900 border border-neutral-700 text-white text-xs focus:border-rose-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1">
                Daxili Admin Audit Qeydi (İstəyə bağlı):
              </label>
              <input
                type="text"
                value={rejectVerificationNote}
                onChange={(e) => setRejectVerificationNote(e.target.value)}
                placeholder="Məs: RRN kodu üzrə bank bazasında heç bir daxilolma tapılmadı"
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs focus:border-rose-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRejectModalDeposit(null)}
                className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 text-xs font-semibold hover:bg-neutral-700"
              >
                Ləğv et
              </button>
              <button
                type="button"
                disabled={isActionLoading}
                onClick={handleConfirmReject}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md disabled:opacity-50"
              >
                {isActionLoading ? 'İcra olunur...' : 'Rədd Etməni Təsdiqlə'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. DEPOSIT DETAILS MODAL */}
      {selectedDepositDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative max-w-lg w-full bg-[#0E1624] rounded-3xl p-6 border border-[#D4AF37]/50 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-neutral-800">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <Info className="w-4 h-4 text-[#D4AF37]" />
                Depozit Məlumat Kartı
              </h4>
              <button
                onClick={() => setSelectedDepositDetails(null)}
                className="text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-neutral-300">
              <div className="flex justify-between py-1 border-b border-neutral-800">
                <span className="text-neutral-400">Depozit ID:</span>
                <span className="font-mono text-[#F6E09E] font-bold">{selectedDepositDetails.id}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-800">
                <span className="text-neutral-400">İnvestor ID & Adı:</span>
                <span className="font-bold text-white">
                  {selectedDepositDetails.userName} ({selectedDepositDetails.userId})
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-800">
                <span className="text-neutral-400">E-poçt / Əlaqə:</span>
                <span>{selectedDepositDetails.userEmail}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-800">
                <span className="text-neutral-400">Məbləğ:</span>
                <span className="font-black text-sm text-white">
                  {selectedDepositDetails.amount.toFixed(2)} AZN
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-800">
                <span className="text-neutral-400">Plan:</span>
                <span className="text-amber-300 font-semibold">
                  {selectedDepositDetails.planName || selectedDepositDetails.planId || 'Veyra Prime Plan'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-800">
                <span className="text-neutral-400">Referans Kodu:</span>
                <span className="font-mono text-neutral-200">{selectedDepositDetails.referenceCode}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-800">
                <span className="text-neutral-400">Ödəniş Metodu & Kart:</span>
                <span>{selectedDepositDetails.paymentMethod} • {selectedDepositDetails.bankAccount}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-800">
                <span className="text-neutral-400">Yaradılma Tarixi:</span>
                <span>{new Date(selectedDepositDetails.createdAt).toLocaleString('az-AZ')}</span>
              </div>
              {selectedDepositDetails.approvedAt && (
                <div className="flex justify-between py-1 border-b border-neutral-800">
                  <span className="text-neutral-400">Təsdiq Tarixi:</span>
                  <span className="text-emerald-400">
                    {new Date(selectedDepositDetails.approvedAt).toLocaleString('az-AZ')} ({selectedDepositDetails.approvedBy})
                  </span>
                </div>
              )}
              {selectedDepositDetails.rejectionReason && (
                <div className="py-2">
                  <span className="text-neutral-400 block mb-1">Rədd Edilmə Səbəbi:</span>
                  <p className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-900 text-rose-300">
                    {selectedDepositDetails.rejectionReason}
                  </p>
                </div>
              )}
            </div>

            <div className="pt-3 flex justify-end">
              <button
                onClick={() => setSelectedDepositDetails(null)}
                className="px-5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold"
              >
                Bağla
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. PLAN EDIT/CREATE MODAL */}
      {editingPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative max-w-md w-full bg-[#0E1624] rounded-3xl p-6 border border-amber-600/50 shadow-2xl space-y-4">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-400" />
              {editingPlan.id ? 'Planı Redaktə Et' : 'Yeni Depozit Planı Yarat'}
            </h4>

            <form onSubmit={handleSavePlan} className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-300 font-bold mb-1">Plan Adı:</label>
                <input
                  type="text"
                  value={editingPlan.name || ''}
                  onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">Min Məbləğ (AZN):</label>
                  <input
                    type="number"
                    value={editingPlan.minAmount || 0}
                    onChange={(e) => setEditingPlan({ ...editingPlan, minAmount: Number(e.target.value) })}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">Maks Məbləğ (AZN):</label>
                  <input
                    type="number"
                    value={editingPlan.maxAmount || 0}
                    onChange={(e) => setEditingPlan({ ...editingPlan, maxAmount: Number(e.target.value) })}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">Gəlirlilik Faizi (məs: 0.65):</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingPlan.profitRate || 0}
                    onChange={(e) => setEditingPlan({ ...editingPlan, profitRate: Number(e.target.value) })}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">Müddət (Gün):</label>
                  <input
                    type="number"
                    value={editingPlan.durationDays || 30}
                    onChange={(e) => setEditingPlan({ ...editingPlan, durationDays: Number(e.target.value) })}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 font-bold mb-1">Risk Səviyyəsi:</label>
                <select
                  value={editingPlan.riskLevel || 'Aşağı'}
                  onChange={(e) =>
                    setEditingPlan({
                      ...editingPlan,
                      riskLevel: e.target.value as 'Çox Aşağı' | 'Aşağı' | 'Orta' | 'Düşünülmüş',
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white focus:border-amber-500 focus:outline-none"
                >
                  <option value="Çox Aşağı">Çox Aşağı</option>
                  <option value="Aşağı">Aşağı</option>
                  <option value="Orta">Orta</option>
                  <option value="Düşünülmüş">Düşünülmüş</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="plan-active-check"
                  checked={editingPlan.isActive ?? true}
                  onChange={(e) => setEditingPlan({ ...editingPlan, isActive: e.target.checked })}
                  className="rounded text-amber-500 focus:ring-amber-500"
                />
                <label htmlFor="plan-active-check" className="text-neutral-300 cursor-pointer">
                  Plan aktivdir (İnvestorlar seçə bilər)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setEditingPlan(null)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 font-semibold"
                >
                  Ləğv et
                </button>
                <button
                  type="submit"
                  disabled={isActionLoading}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold"
                >
                  Yadda Saxla
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. BALANCE ADJUSTMENT MODAL */}
      {balanceModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 rounded-3xl glass-card border border-[#D4AF37]/50 bg-[#0E1624] text-white shadow-2xl relative">
            <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
              <Wallet className="w-5 h-5 text-[#D4AF37]" />
              İnvestor Balansını Tənzimlə
            </h3>
            <p className="text-xs text-neutral-400 mb-4">
              <span className="font-semibold text-white">{balanceModalUser.name}</span> ({balanceModalUser.email})
            </p>

            {balanceEditSuccess && (
              <div className="p-3 mb-4 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs text-center font-medium">
                {balanceEditSuccess}
              </div>
            )}

            <div className="space-y-4">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex justify-between items-center text-xs">
                <span className="text-neutral-400">Cari Qeyd Olunan Balans:</span>
                <span className="font-bold text-[#F6E09E] font-mono text-sm">
                  {balanceModalUser.balance.toFixed(2)} AZN
                </span>
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-300 mb-1.5 block">
                  Yeni Balans Məbləği (AZN):
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={newBalanceInput}
                  onChange={(e) => setNewBalanceInput(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/20 text-white font-mono font-bold text-base focus:border-[#D4AF37] focus:outline-none"
                  placeholder="0.00"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setNewBalanceInput('0')}
                  className="flex-1 py-2 px-3 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-semibold transition-all cursor-pointer"
                >
                  Balansı Sıfırla (0.00 AZN)
                </button>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    const parsed = parseFloat(newBalanceInput);
                    if (isNaN(parsed) || parsed < 0) {
                      alert('Zəhmət olmasa düzgün məbləğ daxil edin');
                      return;
                    }
                    updateUserBalance(balanceModalUser.id, parsed);
                    setBalanceEditSuccess(`Balans uğurla ${parsed.toFixed(2)} AZN olaraq təyin edildi!`);
                    setTimeout(() => {
                      setBalanceModalUser(null);
                      setBalanceEditSuccess(null);
                    }, 1200);
                  }}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#F6E09E] to-[#D4AF37] text-neutral-950 font-bold text-xs hover:brightness-110 active:scale-[0.98] transition-all shadow-md cursor-pointer"
                >
                  Təsdiq Et və Yadda Saxla
                </button>
                <button
                  type="button"
                  onClick={() => setBalanceModalUser(null)}
                  className="px-4 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold transition-all cursor-pointer"
                >
                  Bağla
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. WITHDRAWAL REJECT MODAL */}
      {withdrawalRejectId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative max-w-md w-full bg-[#0E1624] rounded-3xl p-6 border border-rose-800/60 shadow-2xl space-y-4">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <XCircle className="w-5 h-5 text-rose-400" />
              Çıxarış Sorğusunu Rədd Et
            </h4>
            <textarea
              value={withdrawalRejectReason}
              onChange={(e) => setWithdrawalRejectReason(e.target.value)}
              placeholder="Rədd etmə səbəbini daxil edin..."
              rows={3}
              className="w-full p-3 rounded-xl bg-neutral-900 border border-neutral-700 text-white text-xs focus:border-rose-500 focus:outline-none"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setWithdrawalRejectId(null)}
                className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 text-xs font-semibold"
              >
                Ləğv et
              </button>
              <button
                onClick={() => {
                  rejectWithdrawal(withdrawalRejectId, withdrawalRejectReason || 'Kart məlumatları uyğun gəlmədi');
                  setWithdrawalRejectId(null);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md"
              >
                Rədd Etməni Təsdiqlə
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. EDIT STAGE MODAL */}
      {editingStage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative max-w-md w-full bg-[#0E1624] rounded-3xl p-6 border border-neutral-700 shadow-2xl space-y-4">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-amber-400" />
              Mərhələni Redaktə Et (Mərhələ #{editingStage.id})
            </h4>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateStage(editingStage);
                setEditingStage(null);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block text-neutral-300 font-bold mb-1">Başlıq:</label>
                <input
                  type="text"
                  value={editingStage.stageTitle}
                  onChange={(e) => setEditingStage({ ...editingStage, stageTitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-bold mb-1">Təsvir:</label>
                <textarea
                  rows={3}
                  value={editingStage.description}
                  onChange={(e) => setEditingStage({ ...editingStage, description: e.target.value })}
                  className="w-full p-3 rounded-xl bg-neutral-900 border border-neutral-800 text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setEditingStage(null)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 text-xs font-semibold"
                >
                  Ləğv et
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold shadow-md"
                >
                  Yadda Saxla
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { VeyraHomeStage } from '../types';
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
  } = useApp();

  const [adminPassword, setAdminPassword] = useState('');
  const [adminAuthError, setAdminAuthError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const [activeTab, setActiveTab] = useState<'deposits' | 'withdrawals' | 'investments' | 'stages' | 'users' | 'ledger'>('deposits');
  const [selectedReceiptUrl, setSelectedReceiptUrl] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState<string>('');
  const [rejectModalId, setRejectModalId] = useState<string | null>(null);
  const [rejectType, setRejectType] = useState<'deposit' | 'withdrawal'>('deposit');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Editing product/stage modal state
  const [editingStage, setEditingStage] = useState<VeyraHomeStage | null>(null);

  // Admin password gate with server verification
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
          {/* Glowing Emblem */}
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

  // Sales and Financial Statistics
  const totalApprovedDeposits = depositRequests
    .filter((d) => d.status === 'completed')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalPendingDepositAmount = pendingDeposits.reduce((acc, curr) => acc + curr.amount, 0);

  const totalInvestmentSalesVolume = userInvestments.reduce((acc, curr) => acc + curr.investedAmount, 0);

  const totalApprovedWithdrawals = withdrawalRequests
    .filter((w) => w.status === 'completed')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalUserBalances = users.reduce((acc, curr) => acc + (curr.balance || 0), 0);
  const totalKycVerified = users.filter((u) => u.kyc?.isVerified).length;

  const handleOpenRejectModal = (id: string, type: 'deposit' | 'withdrawal') => {
    setRejectModalId(id);
    setRejectType(type);
    setRejectReason('');
  };

  const handleConfirmReject = () => {
    if (!rejectModalId) return;
    if (rejectType === 'deposit') {
      rejectDeposit(rejectModalId, rejectReason || 'Ödəniş rekvizitləri təsdiqlənmədi');
    } else {
      rejectWithdrawal(rejectModalId, rejectReason || 'Kart məlumatları uyğun gəlmədi');
    }
    setRejectModalId(null);
  };

  const handleSaveStage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStage) return;
    updateStage(editingStage);
    setEditingStage(null);
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
            Depozitlər, çıxarışlar, məhsul sifarişləri, mərhələ paketləri və istifadəçi portfellərinin auditli idarəetməsi
          </p>
        </div>

        {/* Admin Header Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setActiveView('dashboard')}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>İnvestor Kabinetinə Keç</span>
          </button>

          <button
            onClick={logoutAdmin}
            id="admin-logout-btn"
            className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95"
          >
            <LogOut className="w-4 h-4" />
            <span>Admin Çıxışı</span>
          </button>
        </div>
      </div>

      {/* SALES & FINANCIAL STATISTICS OVERVIEW */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-amber-400" />
            Satış və Maliyyə Statistikası
          </h2>
          <span className="text-[11px] text-neutral-500">Real vaxt rejimi</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          <div className="p-4 rounded-2xl glass-card border border-amber-500/30 bg-[#0E1624]/60">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
              Təsdiqlənmiş Depozit
            </span>
            <span className="text-xl sm:text-2xl font-black text-amber-400 mt-1 block">
              {totalApprovedDeposits.toLocaleString('az-AZ', { minimumFractionDigits: 2 })} ₼
            </span>
            <span className="text-[10px] text-amber-500/80 block mt-0.5">
              +{totalPendingDepositAmount.toFixed(2)} ₼ gözləyir
            </span>
          </div>

          <div className="p-4 rounded-2xl glass-card border border-emerald-500/30 bg-[#0E1624]/60">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
              Məhsul Satış Həcmi
            </span>
            <span className="text-xl sm:text-2xl font-black text-emerald-400 mt-1 block">
              {totalInvestmentSalesVolume.toLocaleString('az-AZ', { minimumFractionDigits: 2 })} ₼
            </span>
            <span className="text-[10px] text-neutral-500 block mt-0.5">
              {userInvestments.length} aktiv investisiya
            </span>
          </div>

          <div className="p-4 rounded-2xl glass-card border border-rose-500/30 bg-[#0E1624]/60">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
              Ödənilmiş Çıxarışlar
            </span>
            <span className="text-xl sm:text-2xl font-black text-rose-400 mt-1 block">
              {totalApprovedWithdrawals.toLocaleString('az-AZ', { minimumFractionDigits: 2 })} ₼
            </span>
            <span className="text-[10px] text-neutral-500 block mt-0.5">
              {pendingWithdrawals.length} təsdiq gözləyən
            </span>
          </div>

          <div className="p-4 rounded-2xl glass-card border border-blue-500/30 bg-[#0E1624]/60">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
              Sərbəst Balanslar
            </span>
            <span className="text-xl sm:text-2xl font-black text-blue-400 mt-1 block">
              {totalUserBalances.toLocaleString('az-AZ', { minimumFractionDigits: 2 })} ₼
            </span>
            <span className="text-[10px] text-neutral-500 block mt-0.5">
              İnvestor cüzdanlarında
            </span>
          </div>

          <div className="p-4 rounded-2xl glass-card border border-neutral-800 bg-[#0E1624]/60 col-span-2 sm:col-span-1">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
              İnvestorlar & KYC
            </span>
            <span className="text-xl sm:text-2xl font-black text-white mt-1 block">
              {users.length} <span className="text-xs text-neutral-400 font-normal">nəfər</span>
            </span>
            <span className="text-[10px] text-emerald-400 block mt-0.5">
              {totalKycVerified} KYC təsdiqli ({users.length ? Math.round((totalKycVerified / users.length) * 100) : 0}%)
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
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
          <span>Depozit Sifarişləri ({pendingDeposits.length > 0 ? `${pendingDeposits.length} yeni` : depositRequests.length})</span>
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
          <span>Çıxarış Sifarişləri ({pendingWithdrawals.length > 0 ? `${pendingWithdrawals.length} yeni` : withdrawalRequests.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('investments')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'investments'
              ? 'bg-amber-500 text-neutral-950 font-black shadow-md'
              : 'text-neutral-300 hover:bg-neutral-800'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Məhsul Satışları ({userInvestments.length})</span>
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
          <span>Məhsullar / Mərhələlər (8)</span>
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
          onClick={() => setActiveTab('ledger')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'ledger'
              ? 'bg-amber-500 text-neutral-950 font-black shadow-md'
              : 'text-neutral-300 hover:bg-neutral-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Audit & Ledger Jurnalı</span>
        </button>
      </div>

      {/* TAB 1: DEPOZİT SİFARİŞLƏRİ */}
      {activeTab === 'deposits' && (
        <div className="space-y-4">
          <div className="rounded-3xl glass-card border border-neutral-800 overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-neutral-800 flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold text-white">
                  Depozit Sifarişləri və Ödəniş Çekləri
                </h3>
                <p className="text-xs text-neutral-400">
                  Çeki yoxlayın və təsdiq etdikdə vəsait avtomatik olaraq investorun balansına köçürülür
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-900/90 text-neutral-400 uppercase tracking-wider text-[10px] border-b border-neutral-800">
                  <tr>
                    <th className="py-3 px-4">Tarix</th>
                    <th className="py-3 px-4">İnvestor</th>
                    <th className="py-3 px-4">Məbləğ</th>
                    <th className="py-3 px-4">Referans Kodu</th>
                    <th className="py-3 px-4">Ödəniş Çeki</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Status Dəyiş / Əməliyyat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800 text-neutral-300">
                  {depositRequests.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-neutral-500">
                        Hələ heç bir depozit sifarişi daxil olmayıb.
                      </td>
                    </tr>
                  ) : (
                    depositRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-neutral-900/50">
                        <td className="py-3 px-4 whitespace-nowrap text-neutral-400">
                          {new Date(req.createdAt).toLocaleString('az-AZ')}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="font-bold text-white">{req.userName}</div>
                          <div className="text-[10px] text-neutral-400">{req.userEmail}</div>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap font-black text-sm text-[#F6E09E]">
                          {req.amount.toFixed(2)} AZN
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap font-mono text-neutral-300">
                          <span className="px-2 py-0.5 rounded bg-neutral-800 text-[11px]">
                            {req.referenceCode}
                          </span>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          {req.receiptUrl ? (
                            <button
                              onClick={() => setSelectedReceiptUrl(req.receiptUrl || null)}
                              className="px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Çekə Bax</span>
                            </button>
                          ) : (
                            <span className="text-neutral-500 text-[11px]">Yoxdur</span>
                          )}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          {req.status === 'pending' && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center gap-1 w-fit">
                              <Clock className="w-3 h-3" />
                              Gözləyir
                            </span>
                          )}
                          {req.status === 'completed' && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1 w-fit">
                              <CheckCircle className="w-3 h-3" />
                              Təsdiqləndi
                            </span>
                          )}
                          {req.status === 'rejected' && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center gap-1 w-fit">
                              <XCircle className="w-3 h-3" />
                              Rədd edildi
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap text-right">
                          {req.status === 'pending' ? (
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => approveDeposit(req.id)}
                                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center gap-1 transition-colors shadow-sm"
                              >
                                <CheckCircle className="w-3.5 h-3.5" />
                                <span>Təsdiqlə</span>
                              </button>
                              <button
                                onClick={() => handleOpenRejectModal(req.id, 'deposit')}
                                className="px-3 py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600/40 text-rose-300 border border-rose-600/40 font-bold text-[11px] flex items-center gap-1 transition-colors"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                <span>Rədd et</span>
                              </button>
                            </div>
                          ) : (
                            <span className="text-[11px] text-neutral-500">Yekunlaşıb</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ÇIXARIŞ SİFARİŞLƏRİ */}
      {activeTab === 'withdrawals' && (
        <div className="space-y-4">
          <div className="rounded-3xl glass-card border border-neutral-800 overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-neutral-800 flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold text-white">
                  Çıxarış Sifarişləri və Bank Rekvizitləri
                </h3>
                <p className="text-xs text-neutral-400">
                  Kart nömrəsi, FİN kod və şəxsiyyət seriyasını yoxlayıb bank ödənişini təsdiqləyin
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-900/90 text-neutral-400 uppercase tracking-wider text-[10px] border-b border-neutral-800">
                  <tr>
                    <th className="py-3 px-4">Tarix</th>
                    <th className="py-3 px-4">İnvestor</th>
                    <th className="py-3 px-4">Məbləğ</th>
                    <th className="py-3 px-4">Bank & Kart</th>
                    <th className="py-3 px-4">Kart Sahibi & FİN</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Status Dəyiş / Əməliyyat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800 text-neutral-300">
                  {withdrawalRequests.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-neutral-500">
                        Hələ heç bir çıxarış sifarişi daxil olmayıb.
                      </td>
                    </tr>
                  ) : (
                    withdrawalRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-neutral-900/50">
                        <td className="py-3 px-4 whitespace-nowrap text-neutral-400">
                          {new Date(req.createdAt).toLocaleString('az-AZ')}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="font-bold text-white">{req.userName}</div>
                          <div className="text-[10px] text-neutral-400">{req.userEmail}</div>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="font-black text-sm text-rose-400">
                            {req.amount.toFixed(2)} AZN
                          </div>
                          <div className="text-[10px] text-neutral-400">
                            Xalis: {req.netAmount.toFixed(2)} AZN (Komissiya: {req.fee.toFixed(2)} ₼)
                          </div>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="font-mono text-white text-[11px] font-semibold">
                            {req.cardNumberOrIban}
                          </div>
                          <div className="text-[10px] text-neutral-400">{req.bankName}</div>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="text-white font-medium">{req.cardHolderName}</div>
                          <div className="text-[10px] text-neutral-400 font-mono">
                            FİN: {req.finCode} | Seriya: {req.idSerial}
                          </div>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          {req.status === 'pending' && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center gap-1 w-fit">
                              <Clock className="w-3 h-3" />
                              Gözləyir
                            </span>
                          )}
                          {req.status === 'completed' && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1 w-fit">
                              <CheckCircle className="w-3 h-3" />
                              Köçürüldü
                            </span>
                          )}
                          {req.status === 'rejected' && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center gap-1 w-fit">
                              <XCircle className="w-3 h-3" />
                              Rədd edildi
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap text-right">
                          {req.status === 'pending' ? (
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => approveWithdrawal(req.id)}
                                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center gap-1 transition-colors shadow-sm"
                              >
                                <CheckCircle className="w-3.5 h-3.5" />
                                <span>Köçürməni Təsdiqlə</span>
                              </button>
                              <button
                                onClick={() => handleOpenRejectModal(req.id, 'withdrawal')}
                                className="px-3 py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600/40 text-rose-300 border border-rose-600/40 font-bold text-[11px] flex items-center gap-1 transition-colors"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                <span>Rədd et & Qaytar</span>
                              </button>
                            </div>
                          ) : (
                            <span className="text-[11px] text-neutral-500">Yekunlaşıb</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: MƏHSUL SATIŞLARI (İNVESTİSİYA SİFARİŞLƏRİ) */}
      {activeTab === 'investments' && (
        <div className="space-y-4">
          <div className="rounded-3xl glass-card border border-neutral-800 overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-neutral-800 flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold text-white">
                  Məhsul Satışları və İnvestisiya Portfelləri
                </h3>
                <p className="text-xs text-neutral-400">
                  İnvestorların aldığı Veyra Home tikinti mərhələləri və toplanan gəlir hesabatı
                </p>
              </div>
              <span className="text-xs text-amber-400 font-bold">
                Cəmi Satış: {totalInvestmentSalesVolume.toFixed(2)} AZN
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-900/90 text-neutral-400 uppercase tracking-wider text-[10px] border-b border-neutral-800">
                  <tr>
                    <th className="py-3 px-4">Sifariş ID</th>
                    <th className="py-3 px-4">İnvestor ID</th>
                    <th className="py-3 px-4">Alınmış Məhsul / Mərhələ</th>
                    <th className="py-3 px-4">Yatırılan Məbləğ</th>
                    <th className="py-3 px-4">Gündəlik Qazanc (%)</th>
                    <th className="py-3 px-4">Toplanmış Qazanc</th>
                    <th className="py-3 px-4">Başlama Tarixi</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800 text-neutral-300">
                  {userInvestments.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-neutral-500">
                        Hələ heç bir məhsul satışı qeydə alınmayıb.
                      </td>
                    </tr>
                  ) : (
                    userInvestments.map((inv) => (
                      <tr key={inv.id} className="hover:bg-neutral-900/50">
                        <td className="py-3 px-4 font-mono text-[11px] text-neutral-400">
                          {inv.id}
                        </td>
                        <td className="py-3 px-4 font-mono text-[11px] text-neutral-300">
                          {inv.userId}
                        </td>
                        <td className="py-3 px-4 font-bold text-white whitespace-nowrap">
                          {inv.stageName}
                        </td>
                        <td className="py-3 px-4 font-extrabold text-[#F6E09E] whitespace-nowrap">
                          {inv.investedAmount.toFixed(2)} AZN
                        </td>
                        <td className="py-3 px-4 text-emerald-400 font-bold whitespace-nowrap">
                          +{(inv.profitRate * 100).toFixed(2)}% / gün
                        </td>
                        <td className="py-3 px-4 font-bold text-emerald-400 whitespace-nowrap">
                          +{inv.profitAccrued.toFixed(2)} AZN
                        </td>
                        <td className="py-3 px-4 text-neutral-400 whitespace-nowrap">
                          {new Date(inv.startDate).toLocaleDateString('az-AZ')}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                            {inv.status === 'active' ? 'Aktiv' : inv.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: MƏHSULLAR / MƏRHƏLƏLƏR */}
      {activeTab === 'stages' && (
        <div className="space-y-4">
          <div className="rounded-3xl glass-card border border-neutral-800 overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-neutral-800 flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold text-white">
                  Veyra Home Tikinti və İnvestisiya Məhsulları
                </h3>
                <p className="text-xs text-neutral-400">
                  8 investisiya paketinin minimum məbləğ, gündəlik gəlir faizi və şərtlərinin idarə edilməsi
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-900/90 text-neutral-400 uppercase tracking-wider text-[10px] border-b border-neutral-800">
                  <tr>
                    <th className="py-3 px-4">№</th>
                    <th className="py-3 px-4">Məhsul Adı</th>
                    <th className="py-3 px-4">Min. Giriş</th>
                    <th className="py-3 px-4">Gündəlik Faiz</th>
                    <th className="py-3 px-4">Müddət</th>
                    <th className="py-3 px-4">Risk Səviyyəsi</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Redaktə Et</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800 text-neutral-300">
                  {stages.map((stg) => (
                    <tr key={stg.id} className="hover:bg-neutral-900/50">
                      <td className="py-3 px-4 font-mono font-bold text-neutral-500">
                        #{stg.id}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-white">{stg.name}</div>
                        <div className="text-[10px] text-neutral-400">{stg.stageTitle}</div>
                      </td>
                      <td className="py-3 px-4 font-bold text-[#F6E09E] whitespace-nowrap">
                        {stg.minAmount} AZN
                      </td>
                      <td className="py-3 px-4 font-bold text-emerald-400 whitespace-nowrap">
                        +{(stg.dailyProfitRate * 100).toFixed(2)}% / gün
                      </td>
                      <td className="py-3 px-4 text-neutral-300 whitespace-nowrap">
                        {stg.durationDays} gün
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-neutral-800 text-neutral-300">
                          {stg.riskLevel}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {stg.isActive ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                            Aktiv
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-neutral-800 text-neutral-500">
                            Deaktiv
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => setEditingStage(stg)}
                          className="px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 font-bold text-[11px] inline-flex items-center gap-1 transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Redaktə Et</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: İNVESTORLAR */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="rounded-3xl glass-card border border-neutral-800 overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-neutral-800 flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold text-white">Qeydiyyatlı İnvestorlar</h3>
                <p className="text-xs text-neutral-400">{users.length} investor hesabı sistemdə mövcuddur</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-900/90 text-neutral-400 uppercase tracking-wider text-[10px] border-b border-neutral-800">
                  <tr>
                    <th className="py-3 px-4">İnvestor</th>
                    <th className="py-3 px-4">Sərbəst Balans</th>
                    <th className="py-3 px-4">Veyra Home Yatırımı</th>
                    <th className="py-3 px-4">Qazanılmış Gəlir</th>
                    <th className="py-3 px-4">KYC Vəziyyəti</th>
                    <th className="py-3 px-4">Hesab Vəziyyəti</th>
                    <th className="py-3 px-4 text-right">Status Dəyiş</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800 text-neutral-300">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-neutral-900/50">
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-bold text-white">{u.name}</div>
                        <div className="text-[10px] text-neutral-400 font-mono">{u.email}</div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap font-black text-sm text-[#F6E09E]">
                        {u.balance.toFixed(2)} AZN
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap font-bold text-white">
                        {u.totalInvested.toFixed(2)} AZN
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap font-bold text-emerald-400">
                        +{u.totalProfit.toFixed(2)} AZN
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {u.kyc?.isVerified ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1 w-fit">
                            <ShieldCheck className="w-3 h-3" />
                            Təsdiqli
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center gap-1 w-fit">
                            <Clock className="w-3 h-3" />
                            Təsdiqlənməyib
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {u.isActive ? (
                          <span className="text-emerald-400 font-semibold text-[11px] flex items-center gap-1">
                            <UserCheck className="w-3.5 h-3.5" />
                            Aktiv
                          </span>
                        ) : (
                          <span className="text-rose-400 font-semibold text-[11px] flex items-center gap-1">
                            <UserX className="w-3.5 h-3.5" />
                            Dondurulub
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => toggleUserStatus(u.id)}
                          className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                            u.isActive
                              ? 'bg-rose-500/15 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30'
                              : 'bg-emerald-500/15 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30'
                          }`}
                        >
                          {u.isActive ? 'Dondur' : 'Aktivləşdir'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: AUDIT & LEDGER JURNALI */}
      {activeTab === 'ledger' && (
        <div className="space-y-4">
          <div className="rounded-3xl glass-card border border-neutral-800 overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-neutral-800 flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold text-white">Maliyyə Audit Jurnalı</h3>
                <p className="text-xs text-neutral-400">Ledger-ə yazılan hər bir maliyyə əməliyyatı dəqiq izlənir</p>
              </div>
              <span className="text-xs text-neutral-400 font-mono">
                {ledger.length} qeyd
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-900/90 text-neutral-400 uppercase tracking-wider text-[10px] border-b border-neutral-800">
                  <tr>
                    <th className="py-3 px-4">Tarix</th>
                    <th className="py-3 px-4">İstifadəçi ID</th>
                    <th className="py-3 px-4">Növ</th>
                    <th className="py-3 px-4">Məbləğ</th>
                    <th className="py-3 px-4">Əvvəlki</th>
                    <th className="py-3 px-4">Yekun</th>
                    <th className="py-3 px-4">Təsvir</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800 text-neutral-300">
                  {ledger.map((item) => (
                    <tr key={item.id} className="hover:bg-neutral-900/50">
                      <td className="py-3 px-4 whitespace-nowrap text-neutral-400 font-mono text-[11px]">
                        {new Date(item.timestamp).toLocaleString('az-AZ')}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap font-mono text-neutral-400 text-[11px]">
                        {item.userId.slice(0, 8)}...
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap font-bold">
                        {item.type === 'deposit' && <span className="text-emerald-400">Depozit</span>}
                        {item.type === 'withdrawal' && <span className="text-rose-400">Çıxarış</span>}
                        {item.type === 'investment' && <span className="text-blue-400">İnvestisiya</span>}
                        {item.type === 'income' && <span className="text-[#F6E09E]">Gəlir Paylanması</span>}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap font-extrabold text-white">
                        {item.amount > 0 ? `+${item.amount.toFixed(2)}` : item.amount.toFixed(2)} AZN
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-neutral-400 font-mono">
                        {item.balanceBefore.toFixed(2)} AZN
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap font-mono text-[#F6E09E] font-bold">
                        {item.balanceAfter.toFixed(2)} AZN
                      </td>
                      <td className="py-3 px-4 text-neutral-300">
                        {item.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Edit Product/Stage Modal */}
      {editingStage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative max-w-lg w-full bg-[#0E1624] rounded-3xl p-6 border border-amber-500/40 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-amber-400" />
                Məhsulu Redaktə Et: {editingStage.name}
              </h4>
              <button
                onClick={() => setEditingStage(null)}
                className="p-1 text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveStage} className="space-y-4">
              <div>
                <label className="text-xs text-neutral-400 block mb-1">Məhsulun Adı</label>
                <input
                  type="text"
                  value={editingStage.name}
                  onChange={(e) => setEditingStage({ ...editingStage, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-neutral-400 block mb-1">Minimum Giriş (AZN)</label>
                  <input
                    type="number"
                    value={editingStage.minAmount}
                    onChange={(e) =>
                      setEditingStage({ ...editingStage, minAmount: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full p-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs text-neutral-400 block mb-1">Gündəlik Gəlir (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={(editingStage.dailyProfitRate * 100).toFixed(2)}
                    onChange={(e) =>
                      setEditingStage({
                        ...editingStage,
                        dailyProfitRate: (parseFloat(e.target.value) || 0) / 100,
                      })
                    }
                    className="w-full p-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-white text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-neutral-400 block mb-1">Müddət (Gün)</label>
                  <input
                    type="number"
                    value={editingStage.durationDays}
                    onChange={(e) =>
                      setEditingStage({ ...editingStage, durationDays: parseInt(e.target.value, 10) || 0 })
                    }
                    className="w-full p-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs text-neutral-400 block mb-1">Aktivlik Statusu</label>
                  <select
                    value={editingStage.isActive ? 'true' : 'false'}
                    onChange={(e) =>
                      setEditingStage({ ...editingStage, isActive: e.target.value === 'true' })
                    }
                    className="w-full p-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-white text-xs"
                  >
                    <option value="true">Aktiv (Satışda)</option>
                    <option value="false">Deaktiv (Bağlı)</option>
                  </select>
                </div>
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

      {/* Modal: Fullscreen Receipt Viewer */}
      {selectedReceiptUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="relative max-w-2xl w-full bg-[#0E1624] rounded-3xl p-6 border border-[#D4AF37]/40 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#D4AF37]" />
                Yüklənmiş Ödəniş Çeki / Qəbz
              </h4>
              <button
                onClick={() => setSelectedReceiptUrl(null)}
                className="p-1 rounded-full text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="w-full max-h-[70vh] overflow-auto flex items-center justify-center bg-black/60 rounded-2xl p-2 border border-neutral-800">
              <img
                src={selectedReceiptUrl}
                alt="Ödəniş çeki tam ölçüdə"
                className="max-w-full max-h-[65vh] object-contain rounded-xl"
              />
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setSelectedReceiptUrl(null)}
                className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold"
              >
                Pəncərəni bağla
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Rejection Reason Dialog */}
      {rejectModalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative max-w-md w-full bg-[#0E1624] rounded-3xl p-6 border border-rose-800/60 shadow-2xl space-y-4">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <XCircle className="w-5 h-5 text-rose-400" />
              Sorğunu Rədd Etmə Səbəbi
            </h4>

            <p className="text-xs text-neutral-300">
              İnvestora bildiriş olaraq göndəriləcək səbəbi daxil edin:
            </p>

            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Məs: Bank çıxarışında ödəniş tapılmadı və ya kart məlumatları uyğun gəlmir..."
              rows={3}
              className="w-full p-3 rounded-xl bg-neutral-900 border border-neutral-700 text-white text-xs focus:border-rose-500 focus:outline-none"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setRejectModalId(null)}
                className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 text-xs font-semibold"
              >
                Ləğv et
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md"
              >
                Rədd Etməni Təsdiqlə
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

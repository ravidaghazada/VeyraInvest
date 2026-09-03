import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
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

  const [activeTab, setActiveTab] = useState<'deposits' | 'withdrawals' | 'users' | 'stages' | 'ledger'>('deposits');
  const [selectedReceiptUrl, setSelectedReceiptUrl] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState<string>('');
  const [rejectModalId, setRejectModalId] = useState<string | null>(null);
  const [rejectType, setRejectType] = useState<'deposit' | 'withdrawal'>('deposit');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Admin password gate
  const handleAdminLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminAuthError(null);
    if (!adminPassword) {
      setAdminAuthError('Zəhmət olmasa admin şifrəsini daxil edin');
      return;
    }
    const success = loginAdmin(adminPassword);
    if (!success) {
      setAdminAuthError('Təhlükəsizlik xətası: Parol yalnışdır! Daxil olmaq hüququnuz yoxdur.');
    } else {
      setAdminPassword('');
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
            Bu bölmə yalnız sistem rəhbəri üçün nəzərdə tutulub. Davam etmək üçün təsdiqlənmiş admin şifrəsini daxil edin.
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
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#F6E09E] via-[#D4AF37] to-[#B88E1D] text-neutral-950 font-bold text-sm hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_4px_20px_rgba(212,175,55,0.3)]"
            >
              Daxil Ol
            </button>
          </form>

          <button
            type="button"
            onClick={() => setActiveView('dashboard')}
            className="mt-6 text-xs text-neutral-400 hover:text-white flex items-center justify-center gap-1.5 mx-auto transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Əsas səhifəyə qayıt</span>
          </button>
        </div>
      </div>
    );
  }

  const pendingDeposits = depositRequests.filter((d) => d.status === 'pending');
  const pendingWithdrawals = withdrawalRequests.filter((w) => w.status === 'pending');

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
            Depozitlər, çıxarışlar, maliyyə jurnalı və istifadəçi portfellərinin auditli idarəetməsi
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

      {/* Quick Status Pill Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="p-4 rounded-2xl glass-card border border-amber-500/30">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Gözləyən Depozitlər</span>
          <span className="text-2xl font-black text-amber-400">{pendingDeposits.length}</span>
          <span className="text-[10px] text-neutral-500 block mt-0.5">Çek yoxlanışı tələb olunur</span>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-rose-500/30">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Gözləyən Çıxarışlar</span>
          <span className="text-2xl font-black text-rose-400">{pendingWithdrawals.length}</span>
          <span className="text-[10px] text-neutral-500 block mt-0.5">Bank köçürməsi təsdiqi</span>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-neutral-800">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Qeydiyyatlı İnvestorlar</span>
          <span className="text-2xl font-black text-white">{users.length}</span>
          <span className="text-[10px] text-neutral-500 block mt-0.5">Sistem üzrə</span>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-neutral-800">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Ledger Əməliyyatları</span>
          <span className="text-2xl font-black text-[#F6E09E]">{ledger.length}</span>
          <span className="text-[10px] text-neutral-500 block mt-0.5">Dəyişdirilməz qeydlər</span>
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
          <span>Depozit Sorğuları ({pendingDeposits.length})</span>
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
          <span>Çıxarış Sorğuları ({pendingWithdrawals.length})</span>
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

      {/* TAB 1: DEPOZİT SORĞULARI */}
      {activeTab === 'deposits' && (
        <div className="space-y-4">
          <div className="rounded-3xl glass-card border border-neutral-800 overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-neutral-800 flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold text-white">
                  Gözləyən Depozitlər və Ödəniş Çekləri
                </h3>
                <p className="text-xs text-neutral-400">
                  Çeki yoxlayın və təsdiq etdikdə vəsait istifadəçinin balansına köçürüləcək
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-900/90 text-neutral-400 uppercase tracking-wider text-[10px] border-b border-neutral-800">
                  <tr>
                    <th className="py-3 px-4">Tarix</th>
                    <th className="py-3 px-4">İstifadəçi</th>
                    <th className="py-3 px-4">Məbləğ</th>
                    <th className="py-3 px-4">Referans Kodu</th>
                    <th className="py-3 px-4">Ödəniş Çeki</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Əməliyyat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800 text-neutral-300">
                  {depositRequests.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-neutral-500">
                        Hələ heç bir depozit sorğusu daxil olmayıb.
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
                        <td className="py-3 px-4 whitespace-nowrap font-black text-base text-[#F6E09E]">
                          {req.amount.toFixed(2)} AZN
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap font-mono text-neutral-200">
                          {req.referenceCode}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          {req.receiptUrl ? (
                            <button
                              onClick={() => setSelectedReceiptUrl(req.receiptUrl)}
                              className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-[#D4AF37]/20 hover:text-[#F6E09E] border border-neutral-700 text-xs flex items-center gap-1.5 transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />
                              <span>Çekə bax</span>
                            </button>
                          ) : (
                            <span className="text-neutral-500 italic">Yoxdur</span>
                          )}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          {req.status === 'pending' && (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-950/80 text-amber-300 border border-amber-700">
                              🟡 Gözləyir
                            </span>
                          )}
                          {req.status === 'approved' && (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-700">
                              ✓ Təsdiqləndi
                            </span>
                          )}
                          {req.status === 'rejected' && (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-950/80 text-rose-300 border border-rose-700">
                              ✕ Rədd edildi
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap text-right">
                          {req.status === 'pending' ? (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => {
                                  approveDeposit(req.id);
                                }}
                                id={`admin-approve-deposit-${req.id}`}
                                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 transition-all shadow-md active:scale-95"
                              >
                                <CheckCircle className="w-3.5 h-3.5" />
                                <span>[ Təsdiq et ]</span>
                              </button>

                              <button
                                onClick={() => handleOpenRejectModal(req.id, 'deposit')}
                                id={`admin-reject-deposit-${req.id}`}
                                className="px-3 py-1.5 rounded-xl bg-rose-900/80 hover:bg-rose-800 text-rose-200 font-bold text-xs flex items-center gap-1 transition-all active:scale-95 border border-rose-700/60"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                <span>[ Rədd et ]</span>
                              </button>
                            </div>
                          ) : (
                            <span className="text-[11px] text-neutral-500">Tamamlandı</span>
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

      {/* TAB 2: ÇIXARIŞ SORĞULARI */}
      {activeTab === 'withdrawals' && (
        <div className="space-y-4">
          <div className="rounded-3xl glass-card border border-neutral-800 overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-neutral-800 flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold text-white">
                  Gözləyən Vəsait Çıxarışları
                </h3>
                <p className="text-xs text-neutral-400">
                  İnvestorların Azərbaycan bank kartlarına köçürmə tələbləri
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-900/90 text-neutral-400 uppercase tracking-wider text-[10px] border-b border-neutral-800">
                  <tr>
                    <th className="py-3 px-4">Tarix</th>
                    <th className="py-3 px-4">İstifadəçi</th>
                    <th className="py-3 px-4">Məbləğ</th>
                    <th className="py-3 px-4">Kart Nömrəsi</th>
                    <th className="py-3 px-4">Bank & Sahib</th>
                    <th className="py-3 px-4">FİN Kod</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Əməliyyat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800 text-neutral-300">
                  {withdrawalRequests.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-neutral-500">
                        Hələ heç bir çıxarış sorğusu yoxdur.
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
                        <td className="py-3 px-4 whitespace-nowrap font-black text-base text-rose-400">
                          {req.amount.toFixed(2)} AZN
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap font-mono text-neutral-200">
                          {req.cardNumber}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="text-white font-medium">{req.bankName}</div>
                          <div className="text-[10px] text-neutral-400">{req.cardHolder}</div>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap font-mono font-bold text-amber-300">
                          {req.finCode}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          {req.status === 'pending' && (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-950/80 text-amber-300 border border-amber-700">
                              🟡 Yoxlanılır
                            </span>
                          )}
                          {req.status === 'approved' && (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-700">
                              ✓ Köçürüldü
                            </span>
                          )}
                          {req.status === 'rejected' && (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-950/80 text-rose-300 border border-rose-700">
                              ✕ Rədd edildi
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap text-right">
                          {req.status === 'pending' ? (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => approveWithdrawal(req.id)}
                                id={`admin-approve-withdraw-${req.id}`}
                                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 transition-all shadow-md active:scale-95"
                              >
                                <CheckCircle className="w-3.5 h-3.5" />
                                <span>[ Təsdiq et ]</span>
                              </button>

                              <button
                                onClick={() => handleOpenRejectModal(req.id, 'withdrawal')}
                                id={`admin-reject-withdraw-${req.id}`}
                                className="px-3 py-1.5 rounded-xl bg-rose-900/80 hover:bg-rose-800 text-rose-200 font-bold text-xs flex items-center gap-1 transition-all active:scale-95 border border-rose-700/60"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                <span>[ Rədd et (Qaytar) ]</span>
                              </button>
                            </div>
                          ) : (
                            <span className="text-[11px] text-neutral-500">Tamamlandı</span>
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

      {/* TAB 3: İNVESTORLAR */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="rounded-3xl glass-card border border-neutral-800 overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-neutral-800 flex justify-between items-center">
              <h3 className="text-base font-bold text-white">İnvestor Portfelləri</h3>
              <span className="text-xs text-neutral-400">{users.length} qeydiyyatlı istifadəçi</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-900/90 text-neutral-400 uppercase tracking-wider text-[10px] border-b border-neutral-800">
                  <tr>
                    <th className="py-3 px-4">İnvestor</th>
                    <th className="py-3 px-4">Sərbəst Balans</th>
                    <th className="py-3 px-4">Veyra Home Yatırımı</th>
                    <th className="py-3 px-4">Qazanılmış Gəlir</th>
                    <th className="py-3 px-4">Ev Səviyyəsi</th>
                    <th className="py-3 px-4">KYC</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800 text-neutral-300">
                  {users.map((u) => {
                    const stage = stages.find((s) => s.id === u.homeStageId) || stages[0];
                    return (
                      <tr key={u.id} className="hover:bg-neutral-900/50">
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="font-bold text-white">{u.name}</div>
                          <div className="text-[10px] text-neutral-400">{u.email}</div>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap font-black text-sm text-[#F6E09E]">
                          {u.balance.toFixed(2)} AZN
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap font-bold text-white">
                          {u.totalInvested.toFixed(2)} AZN
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap font-bold text-emerald-400">
                          +{u.totalEarned.toFixed(2)} AZN
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#D4AF37]/15 text-[#F6E09E] border border-[#D4AF37]/30">
                            {stage.name} ({stage.stageTitle})
                          </span>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          {u.kyc.isVerified ? (
                            <span className="text-emerald-400 font-semibold text-[11px]">✓ Təsdiqli</span>
                          ) : (
                            <span className="text-amber-400 text-[11px]">Gözləyir</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: LEDGER JURNALI */}
      {activeTab === 'ledger' && (
        <div className="space-y-4">
          <div className="rounded-3xl glass-card border border-neutral-800 overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-neutral-800 flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold text-white">Bütün Maliyyə Audit Jurnalı</h3>
                <p className="text-xs text-neutral-400">Ledger-ə yazılan hər bir qəpik dəqiq izlənir</p>
              </div>
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
                        {new Date(item.createdAt).toLocaleString('az-AZ')}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap font-mono text-neutral-400 text-[11px]">
                        {item.userId.slice(0, 8)}...
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap font-bold">
                        {item.type === 'deposit' && <span className="text-emerald-400">Depozit</span>}
                        {item.type === 'withdrawal' && <span className="text-rose-400">Çıxarış</span>}
                        {item.type === 'investment' && <span className="text-blue-400">İnvestisiya</span>}
                        {item.type === 'profit_distribution' && <span className="text-[#F6E09E]">Gəlir Paylanması</span>}
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

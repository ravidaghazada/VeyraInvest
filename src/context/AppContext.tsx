import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  User,
  LedgerEntry,
  DepositRequest,
  WithdrawalRequest,
  VeyraHomeStage,
  UserInvestment,
  UserNotification,
  AuditLog,
  PaymentSettings,
  DepositPlan,
  DepositStats,
} from '../types';
import { INITIAL_STAGES } from '../constants/stages';
import { api } from '../services/api';
import { authService, AuthResponse } from '../services/authService';

interface AppContextType {
  user: User | null;
  users: User[];
  isAdmin: boolean;
  activeView: 'landing' | 'dashboard' | 'products' | 'calculator' | 'visualizer' | 'howItWorks' | 'about' | 'history' | 'admin' | 'legal';
  setActiveView: (view: 'landing' | 'dashboard' | 'products' | 'calculator' | 'visualizer' | 'howItWorks' | 'about' | 'history' | 'admin' | 'legal') => void;
  stages: VeyraHomeStage[];
  transactions: LedgerEntry[];
  depositRequests: DepositRequest[];
  withdrawalRequests: WithdrawalRequest[];
  userInvestments: UserInvestment[];
  notifications: UserNotification[];
  auditLogs: AuditLog[];
  paymentSettings: PaymentSettings | null;
  depositPlans: DepositPlan[];
  depositStats: DepositStats | null;
  refreshDeposits: () => Promise<void>;
  refreshPaymentSettings: () => Promise<void>;
  refreshDepositPlans: () => Promise<void>;
  updatePaymentSettings: (settings: Partial<PaymentSettings>) => Promise<void>;
  upsertDepositPlan: (plan: Partial<DepositPlan>) => Promise<void>;
  deleteDepositPlan: (id: string) => Promise<void>;
  
  // Modals
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'register';
  setAuthModalMode: (mode: 'login' | 'register') => void;
  openAuthModal: (mode?: 'login' | 'register') => void;
  isDepositModalOpen: boolean;
  setIsDepositModalOpen: (open: boolean) => void;
  isWithdrawalModalOpen: boolean;
  setIsWithdrawalModalOpen: (open: boolean) => void;
  selectedDepositStageAmount?: number;
  setSelectedDepositStageAmount: (amount?: number) => void;

  // Actions
  loginWithGoogle: (mode?: 'login' | 'register') => Promise<AuthResponse>;
  loginWithEmail: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  registerWithEmail: (name: string, email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  loginAdmin: (password: string) => Promise<{ success: boolean; error?: string }>;
  logoutAdmin: () => void;
  
  // Financial Operations
  submitDepositRequest: (
    amount: number,
    referenceCode: string,
    receiptDataUrl: string,
    receiptFileName: string,
    planId?: string
  ) => Promise<DepositRequest>;
  approveDeposit: (depositId: string, note?: string) => Promise<void>;
  rejectDeposit: (depositId: string, reason: string, note?: string) => Promise<void>;
  
  submitWithdrawalRequest: (
    amount: number,
    cardNumberOrIban: string,
    bankName: string,
    cardHolderName: string,
    finCode: string,
    idSerial: string
  ) => Promise<{ success: boolean; error?: string }>;
  approveWithdrawal: (withdrawalId: string) => void;
  rejectWithdrawal: (withdrawalId: string, reason: string) => void;
  
  investInStage: (stageId: number, amount: number) => { success: boolean; message: string };
  updateStage: (stage: VeyraHomeStage) => void;
  toggleUserStatus: (userId: string) => void;
  markNotificationAsRead: (notificationId: string) => void;
  updateUserBalance: (userId: string, newBalance: number) => void;
  reconcileBalance: () => void;
  
  // Helpers
  getUserHomeStage: () => VeyraHomeStage;
  getNextHomeStage: () => { stage: VeyraHomeStage | null; neededAmount: number };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: 'veyra_current_user',
  USERS: 'veyra_users_list',
  TRANSACTIONS: 'veyra_transactions',
  DEPOSITS: 'veyra_deposit_requests',
  WITHDRAWALS: 'veyra_withdrawal_requests',
  STAGES: 'veyra_stages',
  INVESTMENTS: 'veyra_investments',
  NOTIFICATIONS: 'veyra_notifications',
  AUDIT_LOGS: 'veyra_audit_logs',
  IS_ADMIN: 'veyra_is_admin',
  ADMIN_TOKEN: 'veyra_admin_token',
};

const getInitialViewFromUrl = (): 'landing' | 'dashboard' | 'products' | 'calculator' | 'visualizer' | 'howItWorks' | 'about' | 'history' | 'admin' | 'legal' => {
  if (typeof window !== 'undefined') {
    const path = window.location.pathname.replace(/^\/+/, '').toLowerCase();
    const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
    const target = path || hash;
    if (target === 'admin') return 'admin';
    if (target === 'dashboard') return 'dashboard';
    if (target === 'products') return 'products';
    if (target === 'calculator') return 'calculator';
    if (target === 'visualizer') return 'visualizer';
    if (target === 'howitworks' || target === 'how-it-works') return 'howItWorks';
    if (target === 'about') return 'about';
    if (target === 'history') return 'history';
    if (target === 'legal') return 'legal';
  }
  return 'landing';
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Primary default user
  const initialDefaultUser: User = {
    id: 'usr_veyra_8892',
    name: 'Rəşad Əliyev',
    email: 'investor.ali@gmail.com',
    balance: 0.00,
    totalInvested: 0.00,
    totalProfit: 0.00,
    todayChange: 0.00,
    role: 'investor',
    createdAt: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString(),
    isActive: true,
    authProvider: 'google',
    kyc: {
      isVerified: false,
      fullName: 'Rəşad Əliyev',
      finCode: '',
      idSerial: '',
      documentType: 'Azərbaycan Şəxsiyyət Vəsiqəsi',
      status: 'unsubmitted',
    },
  };

  // State initialization with persistence
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS);
    if (saved) {
      try {
        const parsedList: User[] = JSON.parse(saved);
        if (Array.isArray(parsedList)) {
          return parsedList.map((u) => (u.balance === 150 ? { ...u, balance: 0.00 } : u));
        }
      } catch (e) {
        console.error(e);
      }
    }
    return [initialDefaultUser];
  });

  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    if (saved) {
      try {
        const parsed: User = JSON.parse(saved);
        if (parsed && parsed.balance === 150) {
          parsed.balance = 0.00;
        }
        return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return null; // Start on public landing page by default
  });

  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEYS.IS_ADMIN) === 'true';
  });

  const [activeView, setActiveViewState] = useState<'landing' | 'dashboard' | 'products' | 'calculator' | 'visualizer' | 'howItWorks' | 'about' | 'history' | 'admin' | 'legal'>(getInitialViewFromUrl);

  const setActiveView = (view: 'landing' | 'dashboard' | 'products' | 'calculator' | 'visualizer' | 'howItWorks' | 'about' | 'history' | 'admin' | 'legal') => {
    setActiveViewState(view);
    if (typeof window !== 'undefined') {
      const targetPath = view === 'landing' ? '/' : `/${view}`;
      if (window.location.pathname !== targetPath) {
        window.history.pushState({ view }, '', targetPath);
      }
    }
  };

  // Browser navigation (back / forward buttons) support
  useEffect(() => {
    const handlePopState = () => {
      setActiveViewState(getInitialViewFromUrl());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Admin Session Verification & Persistence
  useEffect(() => {
    if (isAdmin) {
      let token = sessionStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN);
      if (!token) {
        token = 'admin-session-' + Date.now();
        sessionStorage.setItem(STORAGE_KEYS.ADMIN_TOKEN, token);
      }
    }
  }, [isAdmin]);

  const [stages, setStages] = useState<VeyraHomeStage[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STAGES);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0]?.dailyIncome && parsed[0]?.monthlyIncome) {
          return parsed;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_STAGES;
  });

  const [transactions, setTransactions] = useState<LedgerEntry[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return saved ? JSON.parse(saved) : [];
  });

  const [depositRequests, setDepositRequests] = useState<DepositRequest[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DEPOSITS);
    return saved ? JSON.parse(saved) : [];
  });

  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WITHDRAWALS);
    return saved ? JSON.parse(saved) : [];
  });

  const [userInvestments, setUserInvestments] = useState<UserInvestment[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.INVESTMENTS);
    return saved ? JSON.parse(saved) : [];
  });

  const [notifications, setNotifications] = useState<UserNotification[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return saved ? JSON.parse(saved) : [];
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
    return saved ? JSON.parse(saved) : [];
  });

  // Real backend-connected states
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings | null>(null);
  const [depositPlans, setDepositPlans] = useState<DepositPlan[]>([]);
  const [depositStats, setDepositStats] = useState<DepositStats | null>(null);

  // Modals state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false);
  const [selectedDepositStageAmount, setSelectedDepositStageAmount] = useState<number | undefined>(undefined);

  const openAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  // Sync with real backend server
  const refreshPaymentSettings = useCallback(async () => {
    try {
      const data = await api.getPaymentSettings();
      setPaymentSettings(data);
    } catch {
      // ignore
    }
  }, []);

  const refreshDepositPlans = useCallback(async () => {
    try {
      const data = await api.getDepositPlans();
      setDepositPlans(data);
    } catch {
      // ignore
    }
  }, []);

  const refreshDeposits = useCallback(async () => {
    try {
      if (isAdmin) {
        const res = await api.getDeposits({ limit: 100 });
        if (res.deposits) {
          setDepositRequests(res.deposits);
        }
        const stats = await api.getDepositStats();
        if (stats) setDepositStats(stats);
      } else if (user?.id) {
        const syncRes = await api.syncUser(user.id, user.email);
        if (syncRes?.user) {
          setUser((prev) => (prev ? { ...prev, balance: syncRes.user.balance, totalInvested: syncRes.user.totalInvested } : null));
        }
        if (syncRes?.deposits) {
          setDepositRequests(syncRes.deposits);
        }
      }
    } catch {
      // ignore
    }
  }, [isAdmin, user?.id, user?.email]);

  // Initial load of backend configs
  useEffect(() => {
    refreshPaymentSettings();
    refreshDepositPlans();
  }, [refreshPaymentSettings, refreshDepositPlans]);

  // Periodic real-time sync with server
  useEffect(() => {
    refreshDeposits();
    const interval = setInterval(() => {
      refreshDeposits();
    }, 3500);
    return () => clearInterval(interval);
  }, [refreshDeposits]);

  // Persistence effects
  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      // sync with users array
      setUsers((prev) => prev.map((u) => (u.id === user.id ? user : u)));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DEPOSITS, JSON.stringify(depositRequests));
  }, [depositRequests]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WITHDRAWALS, JSON.stringify(withdrawalRequests));
  }, [withdrawalRequests]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STAGES, JSON.stringify(stages));
  }, [stages]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INVESTMENTS, JSON.stringify(userInvestments));
  }, [userInvestments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.IS_ADMIN, isAdmin ? 'true' : 'false');
  }, [isAdmin]);

  // Real investment calculation engine: update accrual based on daily rate
  useEffect(() => {
    if (!user) return;
    const interval = setInterval(() => {
      // Calculate realistic accrual for active investments
      setUserInvestments((prevInvestments) => {
        let hasChanges = false;
        const updated = prevInvestments.map((inv) => {
          if (inv.status !== 'active') return inv;
          const stage = stages.find((s) => s.id === inv.stageId);
          if (!stage) return inv;
          // Accrue small continuous increment (dailyProfitRate / (24 * 3600))
          const ratePerSecond = (stage.dailyProfitRate / 100) / 86400;
          const addedProfit = Number((inv.investedAmount * ratePerSecond * 2).toFixed(6));
          if (addedProfit > 0) {
            hasChanges = true;
            return {
              ...inv,
              profitAccrued: Number((inv.profitAccrued + addedProfit).toFixed(4)),
              currentValue: Number((inv.investedAmount + inv.profitAccrued + addedProfit).toFixed(4)),
              lastProfitCalculation: new Date().toISOString(),
            };
          }
          return inv;
        });

        if (hasChanges && user) {
          const totalProfitSum = updated
            .filter((inv) => inv.userId === user.id)
            .reduce((acc, curr) => acc + curr.profitAccrued, 0);
          
          setUser((prev) => {
            if (!prev) return null;
            return {
              ...prev,
              totalProfit: Number(totalProfitSum.toFixed(2)),
              todayChange: Number((totalProfitSum * 0.2).toFixed(2)),
            };
          });
        }
        return updated;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [user?.id, stages]);

  // Reconcile user balance to reflect genuine approved transactions and eliminate stale/fake balances
  const reconcileBalance = () => {
    if (!user) return;
    const approvedDepositTotal = depositRequests
      .filter((d) => d.userId === user.id && (d.status === 'completed' || d.status === 'approved'))
      .reduce((sum, d) => sum + (Number(d.amount) || 0), 0);

    const approvedWithdrawalTotal = withdrawalRequests
      .filter((w) => w.userId === user.id && w.status === 'completed')
      .reduce((sum, w) => sum + (Number(w.amount) || 0), 0);

    const activeInvestmentsTotal = userInvestments
      .filter((inv) => inv.userId === user.id && inv.status === 'active')
      .reduce((sum, inv) => sum + (Number(inv.investedAmount) || 0), 0);

    const realBalance = Number(Math.max(0, approvedDepositTotal - approvedWithdrawalTotal - activeInvestmentsTotal).toFixed(2));

    const updatedUser: User = {
      ...user,
      balance: realBalance,
      totalInvested: activeInvestmentsTotal,
    };
    setUser(updatedUser);
    setUsers((prev) => prev.map((u) => (u.id === user.id ? updatedUser : u)));
  };

  // Automatically reset stale 150 AZN or unverified balance on load
  useEffect(() => {
    if (user) {
      const approvedCount = depositRequests.filter(
        (d) => d.userId === user.id && (d.status === 'completed' || d.status === 'approved')
      ).length;
      if (user.balance === 150 || (user.balance > 0 && approvedCount === 0)) {
        reconcileBalance();
      }
    }
  }, [user?.id, depositRequests]);

  // Auth functions
  const loginWithGoogle = async (mode: 'login' | 'register' = 'login'): Promise<AuthResponse> => {
    try {
      const result = await authService.startGoogleAuth(mode);
      if (result.success && result.user) {
        const authedUser: User = {
          ...result.user,
          balance: Number(result.user.balance) || 0.0,
          totalInvested: Number(result.user.totalInvested) || 0.0,
          totalProfit: Number(result.user.totalProfit) || 0.0,
          todayChange: 0.0,
          role: result.user.role || 'investor',
          isActive: result.user.isActive !== false,
          authProvider: 'google',
          kyc: result.user.kyc || {
            isVerified: result.user.kycStatus === 'verified',
            fullName: result.user.name,
            finCode: '',
            idSerial: '',
            documentType: 'Azərbaycan Şəxsiyyət Vəsiqəsi',
            status: (result.user.kycStatus as any) || 'unsubmitted',
          },
        };

        if (!authedUser.isActive) {
          return {
            success: false,
            error: 'Hesabınız dondurulub. Zəhmət olmasa Veyra Invest rəhbərliyi ilə əlaqə saxlayın.',
          };
        }

        // Save session
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(authedUser));
        if (result.token) {
          localStorage.setItem('veyra_user_token', result.token);
        }

        setUser(authedUser);
        setUsers((prev) => {
          const exists = prev.some((u) => u.id === authedUser.id || u.email.toLowerCase() === authedUser.email.toLowerCase());
          if (exists) {
            return prev.map((u) => (u.id === authedUser.id || u.email.toLowerCase() === authedUser.email.toLowerCase() ? authedUser : u));
          }
          return [...prev, authedUser];
        });

        setIsAuthModalOpen(false);
        setActiveView('dashboard');
        return { success: true, user: authedUser };
      }

      return result;
    } catch (err: any) {
      return {
        success: false,
        error: err.message || 'Gözlənilməz xəta baş verdi',
      };
    }
  };

  const loginWithEmail = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    if (!email || !pass) return { success: false, error: 'E-poçt və şifrə tələb olunur.' };
    const res = await authService.loginWithEmail(email, pass);
    if (res.success && res.user) {
      const authedUser: User = {
        ...res.user,
        balance: Number(res.user.balance) || 0.0,
        totalInvested: Number(res.user.totalInvested) || 0.0,
        totalProfit: Number(res.user.totalProfit) || 0.0,
        todayChange: 0.0,
        role: res.user.role || 'investor',
        isActive: res.user.isActive !== false,
        authProvider: (res.user.authProvider as any) || 'email',
        kyc: res.user.kyc || {
          isVerified: res.user.kycStatus === 'verified',
          fullName: res.user.name,
          finCode: '',
          idSerial: '',
          documentType: 'Azərbaycan Şəxsiyyət Vəsiqəsi',
          status: (res.user.kycStatus as any) || 'unsubmitted',
        },
      };

      if (!authedUser.isActive) {
        return { success: false, error: 'Hesabınız dondurulub.' };
      }

      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(authedUser));
      if (res.token) {
        localStorage.setItem('veyra_user_token', res.token);
      }
      setUser(authedUser);
      setIsAuthModalOpen(false);
      setActiveView('dashboard');
      return { success: true };
    }
    return { success: false, error: res.error || 'Daxil olmaq mümkün olmadı.' };
  };

  const registerWithEmail = async (name: string, email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    if (!name || !email || !pass) return { success: false, error: 'Bütün sahələri doldurun.' };
    const res = await authService.registerWithEmail(name, email, pass);
    if (res.success && res.user) {
      const authedUser: User = {
        ...res.user,
        balance: Number(res.user.balance) || 0.0,
        totalInvested: Number(res.user.totalInvested) || 0.0,
        totalProfit: Number(res.user.totalProfit) || 0.0,
        todayChange: 0.0,
        role: res.user.role || 'investor',
        isActive: res.user.isActive !== false,
        authProvider: 'email',
        kyc: res.user.kyc || {
          isVerified: false,
          fullName: res.user.name,
          finCode: '',
          idSerial: '',
          documentType: 'Azərbaycan Şəxsiyyət Vəsiqəsi',
          status: 'unsubmitted',
        },
      };

      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(authedUser));
      if (res.token) {
        localStorage.setItem('veyra_user_token', res.token);
      }
      setUser(authedUser);
      setUsers((prev) => [...prev, authedUser]);
      setIsAuthModalOpen(false);
      setActiveView('dashboard');
      return { success: true };
    }
    return { success: false, error: res.error || 'Qeydiyyat zamanı xəta baş verdi.' };
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem('veyra_user_token');
    setUser(null);
    setActiveView('landing');
  };

  const loginAdmin = async (password: string): Promise<{ success: boolean; error?: string }> => {
    const trimmed = password.trim();
    // Fast-path: verified admin master passwords
    if (trimmed === 'Ravid2212a' || trimmed === 'uytruytr') {
      localStorage.setItem(STORAGE_KEYS.IS_ADMIN, 'true');
      sessionStorage.setItem(STORAGE_KEYS.ADMIN_TOKEN, 'admin-session-' + Date.now());
      setIsAdmin(true);
      setActiveView('admin');
      
      // Async notify server if available
      try {
        fetch('/api/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password: trimmed }),
        }).then(async (res) => {
          const data = await res.json().catch(() => ({}));
          if (data?.token) sessionStorage.setItem(STORAGE_KEYS.ADMIN_TOKEN, data.token);
        }).catch(() => {});
      } catch {}

      return { success: true };
    }

    try {
      // Call Server-side verification API (Vercel Serverless / dev server)
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: trimmed }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        if (data.token) sessionStorage.setItem(STORAGE_KEYS.ADMIN_TOKEN, data.token);
        localStorage.setItem(STORAGE_KEYS.IS_ADMIN, 'true');
        setIsAdmin(true);
        setActiveView('admin');
        return { success: true };
      } else {
        setIsAdmin(false);
        localStorage.removeItem(STORAGE_KEYS.IS_ADMIN);
        sessionStorage.removeItem(STORAGE_KEYS.ADMIN_TOKEN);
        return {
          success: false,
          error: data.error || 'Təhlükəsizlik xətası: Parol yalnışdır! Daxil olmaq hüququnuz yoxdur.',
        };
      }
    } catch {
      return { success: false, error: 'Təhlükəsizlik xətası: Parol yalnışdır! Daxil olmaq hüququnuz yoxdur.' };
    }
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    localStorage.removeItem(STORAGE_KEYS.IS_ADMIN);
    sessionStorage.removeItem(STORAGE_KEYS.ADMIN_TOKEN);
    setActiveView('landing');
  };

  // Submit manual deposit request to real backend
  const submitDepositRequest = async (
    amount: number,
    referenceCode: string,
    receiptDataUrl: string,
    receiptFileName: string,
    planId?: string
  ): Promise<DepositRequest> => {
    if (!user) throw new Error('İstifadəçi daxil olmayıb');

    try {
      const realDeposit = await api.createDeposit({
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        amount,
        planId: planId || 'plan_50',
        receiptDataUrl,
        receiptFileName,
        acceptedTerms: true,
      });

      setDepositRequests((prev) => [realDeposit, ...prev.filter((d) => d.id !== realDeposit.id)]);
      await refreshDeposits();
      return realDeposit;
    } catch (err: any) {
      console.error('Server deposit creation error:', err);
      throw err;
    }
  };

  // Admin approves deposit on real backend
  const approveDeposit = async (depositId: string, note?: string) => {
    try {
      const result = await api.approveDeposit(depositId, note);
      if (result && result.deposit) {
        setDepositRequests((prev) =>
          prev.map((d) => (d.id === depositId ? { ...d, ...result.deposit, status: 'completed' } : d))
        );
        await refreshDeposits();
      }
    } catch (err: any) {
      console.error('Approve deposit error:', err);
      throw err;
    }
  };

  // Admin rejects deposit on real backend
  const rejectDeposit = async (depositId: string, reason: string, note?: string) => {
    try {
      const result = await api.rejectDeposit(depositId, reason, note);
      if (result && result.deposit) {
        setDepositRequests((prev) =>
          prev.map((d) => (d.id === depositId ? { ...d, ...result.deposit, status: 'rejected' } : d))
        );
        await refreshDeposits();
      }
    } catch (err: any) {
      console.error('Reject deposit error:', err);
      throw err;
    }
  };

  const updatePaymentSettings = async (updates: Partial<PaymentSettings>) => {
    const updated = await api.updatePaymentSettings(updates);
    setPaymentSettings(updated);
  };

  const upsertDepositPlan = async (plan: Partial<DepositPlan>) => {
    if (plan.id) {
      const updated = await api.updateDepositPlan(plan.id, plan);
      setDepositPlans((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    } else {
      const created = await api.createDepositPlan(plan);
      setDepositPlans((prev) => [...prev, created]);
    }
  };

  const deleteDepositPlan = async (id: string) => {
    await api.deleteDepositPlan(id);
    setDepositPlans((prev) => prev.filter((p) => p.id !== id));
  };

  // Submit withdrawal
  const submitWithdrawalRequest = async (
    amount: number,
    cardNumberOrIban: string,
    bankName: string,
    cardHolderName: string,
    finCode: string,
    idSerial: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'Daxil olunmayıb' };
    if (amount <= 0) return { success: false, error: 'Məbləğ sıfırdan böyük olmalıdır' };
    if (user.balance < amount) {
      return { success: false, error: 'Balansınızda kifayət qədər sərbəst vəsait yoxdur' };
    }

    const oldBalance = user.balance;
    const newBalance = Number((oldBalance - amount).toFixed(2));

    const newWithdrawal: WithdrawalRequest = {
      id: 'wth_' + Math.random().toString(36).substring(2, 10).toUpperCase(),
      userId: user.id,
      userEmail: user.email,
      userName: user.name,
      amount: Number(amount.toFixed(2)),
      fee: 0.00,
      netAmount: Number(amount.toFixed(2)),
      currency: 'AZN',
      cardNumberOrIban,
      bankName: bankName || 'Azərbaycan Bank Kartı',
      cardHolderName: cardHolderName || user.name,
      finCode,
      idSerial,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    setWithdrawalRequests((prev) => [newWithdrawal, ...prev]);

    // Update user balance immediately held for withdrawal
    const updatedUser = {
      ...user,
      balance: newBalance,
      kyc: {
        ...user.kyc,
        finCode: finCode || user.kyc.finCode,
        idSerial: idSerial || user.kyc.idSerial,
      },
    };
    setUser(updatedUser);
    setUsers((prev) => prev.map((u) => (u.id === user.id ? updatedUser : u)));

    // Ledger entry
    const ledgerEntry: LedgerEntry = {
      id: 'led_' + Math.random().toString(36).substring(2, 10),
      userId: user.id,
      type: 'withdrawal',
      amount: amount,
      currency: 'AZN',
      status: 'pending',
      timestamp: new Date().toISOString(),
      referenceId: newWithdrawal.id,
      description: `Çıxarış sorğusu yaradıldı (${cardNumberOrIban.slice(0, 4)}...${cardNumberOrIban.slice(-4)})`,
      balanceBefore: oldBalance,
      balanceAfter: newBalance,
    };
    setTransactions((prev) => [ledgerEntry, ...prev]);

    // Notification
    const notif: UserNotification = {
      id: 'notif_' + Math.random().toString(36).substring(2, 9),
      userId: user.id,
      title: 'Çıxarış sorğunuz yaradıldı',
      message: `${amount.toFixed(2)} AZN məbləğində vəsait çıxarış üçün yoxlanışdadır. Yoxlama tamamlandıqdan sonra kartınıza köçürüləcəkdir.`,
      type: 'withdrawal',
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [notif, ...prev]);

    return { success: true };
  };

  const approveWithdrawal = (withdrawalId: string) => {
    const wth = withdrawalRequests.find((w) => w.id === withdrawalId);
    if (!wth || wth.status === 'completed') return;

    setWithdrawalRequests((prev) =>
      prev.map((w) =>
        w.id === withdrawalId ? { ...w, status: 'completed', approvedAt: new Date().toISOString() } : w
      )
    );

    // Ledger entry
    const ledgerEntry: LedgerEntry = {
      id: 'led_' + Math.random().toString(36).substring(2, 10),
      userId: wth.userId,
      type: 'withdrawal',
      amount: wth.amount,
      currency: 'AZN',
      status: 'completed',
      timestamp: new Date().toISOString(),
      referenceId: wth.id,
      description: `Çıxarış tamamlandı: ${wth.amount.toFixed(2)} AZN (${wth.cardNumberOrIban})`,
      balanceBefore: 0,
      balanceAfter: 0,
    };
    setTransactions((prev) => [ledgerEntry, ...prev]);

    // User notification
    const notif: UserNotification = {
      id: 'notif_' + Math.random().toString(36).substring(2, 9),
      userId: wth.userId,
      title: '✓ Çıxarış uğurla həyata keçirildi!',
      message: `${wth.amount.toFixed(2)} AZN məbləğ bank hesabınıza köçürüldü.`,
      type: 'withdrawal',
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [notif, ...prev]);

    // Audit log
    const audit: AuditLog = {
      id: 'aud_' + Math.random().toString(36).substring(2, 10),
      adminId: 'adm_01',
      adminEmail: 'admin@veyra.az',
      userId: wth.userId,
      action: 'WITHDRAWAL_APPROVED',
      details: `${wth.amount.toFixed(2)} AZN çıxarış təsdiqləndi`,
      timestamp: new Date().toISOString(),
      entityId: wth.id,
    };
    setAuditLogs((prev) => [audit, ...prev]);
  };

  const rejectWithdrawal = (withdrawalId: string, reason: string) => {
    const wth = withdrawalRequests.find((w) => w.id === withdrawalId);
    if (!wth) return;

    const targetUser = users.find((u) => u.id === wth.userId);
    if (!targetUser) return;

    // Refund back to balance
    const restoredBalance = Number((targetUser.balance + wth.amount).toFixed(2));

    setWithdrawalRequests((prev) =>
      prev.map((w) =>
        w.id === withdrawalId ? { ...w, status: 'rejected', rejectionReason: reason } : w
      )
    );

    setUsers((prev) =>
      prev.map((u) => (u.id === targetUser.id ? { ...u, balance: restoredBalance } : u))
    );

    if (user && user.id === targetUser.id) {
      setUser((prev) => (prev ? { ...prev, balance: restoredBalance } : null));
    }

    // Ledger entry
    const ledgerEntry: LedgerEntry = {
      id: 'led_' + Math.random().toString(36).substring(2, 10),
      userId: targetUser.id,
      type: 'withdrawal',
      amount: wth.amount,
      currency: 'AZN',
      status: 'rejected',
      timestamp: new Date().toISOString(),
      referenceId: wth.id,
      description: `Çıxarış rədd edildi və vəsait balansa qaytarıldı: ${reason}`,
      balanceBefore: targetUser.balance,
      balanceAfter: restoredBalance,
    };
    setTransactions((prev) => [ledgerEntry, ...prev]);

    // Notification
    const notif: UserNotification = {
      id: 'notif_' + Math.random().toString(36).substring(2, 9),
      userId: targetUser.id,
      title: 'Çıxarış sorğunuz rədd edildi',
      message: `${wth.amount.toFixed(2)} AZN məbləğində çıxarış rədd edildi və balansınıza qaytarıldı. Səbəb: ${reason}`,
      type: 'withdrawal',
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  // Invest in Veyra Home stage
  const investInStage = (stageId: number, amount: number): { success: boolean; message: string } => {
    if (!user) return { success: false, message: 'İnvestisiya etmək üçün daxil olun' };
    const stage = stages.find((s) => s.id === stageId);
    if (!stage) return { success: false, message: 'Seçilmiş məhsul tapılmadı' };
    if (amount < stage.minAmount) {
      return { success: false, message: `Bu məhsul üçün minimum məbləğ ${stage.minAmount} AZN təşkil edir.` };
    }
    if (user.balance < amount) {
      return { success: false, message: `Balansınızda kifayət qədər vəsait yoxdur. Zəhmət olmasa əvvəlcə vəsait əlavə edin.` };
    }

    const oldBalance = user.balance;
    const newBalance = Number((oldBalance - amount).toFixed(2));
    const newInvested = Number((user.totalInvested + amount).toFixed(2));

    const newInvestment: UserInvestment = {
      id: 'inv_' + Math.random().toString(36).substring(2, 9),
      userId: user.id,
      stageId: stage.id,
      stageName: stage.name,
      investedAmount: amount,
      currentValue: amount,
      profitAccrued: 0,
      profitRate: stage.dailyProfitRate,
      startDate: new Date().toISOString(),
      lastProfitCalculation: new Date().toISOString(),
      status: 'active',
    };

    setUserInvestments((prev) => [newInvestment, ...prev]);

    const updatedUser: User = {
      ...user,
      balance: newBalance,
      totalInvested: newInvested,
    };
    setUser(updatedUser);
    setUsers((prev) => prev.map((u) => (u.id === user.id ? updatedUser : u)));

    // Ledger entry
    const ledgerEntry: LedgerEntry = {
      id: 'led_' + Math.random().toString(36).substring(2, 10),
      userId: user.id,
      type: 'investment',
      amount: amount,
      currency: 'AZN',
      status: 'completed',
      timestamp: new Date().toISOString(),
      referenceId: newInvestment.id,
      description: `${stage.name} (${stage.stageTitle}) investisiyası aktivləşdirildi`,
      balanceBefore: oldBalance,
      balanceAfter: newBalance,
    };
    setTransactions((prev) => [ledgerEntry, ...prev]);

    // Notification
    const notif: UserNotification = {
      id: 'notif_' + Math.random().toString(36).substring(2, 9),
      userId: user.id,
      title: `🏠 ${stage.name} İnvestisiyası Uğurla Başladı!`,
      message: `${amount.toFixed(2)} AZN investisiya portfelinizə əlavə edildi. Veyra Home layihəniz inkişaf etməyə başladı.`,
      type: 'investment',
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [notif, ...prev]);

    return { success: true, message: `${stage.name} uğurla aktivləşdirildi!` };
  };

  const updateStage = (updatedStage: VeyraHomeStage) => {
    setStages((prev) => prev.map((s) => (s.id === updatedStage.id ? updatedStage : s)));
  };

  const toggleUserStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, isActive: !u.isActive } : u))
    );
    if (user && user.id === userId) {
      setUser((prev) => (prev ? { ...prev, isActive: !prev.isActive } : null));
    }
  };

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
    );
  };

  const updateUserBalance = (userId: string, newBalance: number) => {
    const validAmount = Number(Math.max(0, newBalance).toFixed(2));
    const target = users.find((u) => u.id === userId);
    const oldBalance = target ? target.balance : 0;

    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, balance: validAmount } : u))
    );

    if (user && user.id === userId) {
      setUser((prev) => (prev ? { ...prev, balance: validAmount } : null));
    }

    // Ledger entry for audit
    const ledgerEntry: LedgerEntry = {
      id: 'led_' + Math.random().toString(36).substring(2, 10),
      userId,
      type: 'adjustment',
      amount: Math.abs(validAmount - oldBalance),
      currency: 'AZN',
      status: 'completed',
      timestamp: new Date().toISOString(),
      referenceId: 'ADJ_' + Date.now(),
      description: `Admin tərəfindən balans tənzimləməsi: ${oldBalance.toFixed(2)} AZN -> ${validAmount.toFixed(2)} AZN`,
      balanceBefore: oldBalance,
      balanceAfter: validAmount,
    };
    setTransactions((prev) => [ledgerEntry, ...prev]);

    // Audit log
    const audit: AuditLog = {
      id: 'aud_' + Math.random().toString(36).substring(2, 10),
      adminId: 'adm_master',
      adminEmail: 'admin@veyra.az',
      userId,
      action: 'BALANCE_UPDATED',
      details: `Balans düzəldildi: ${oldBalance.toFixed(2)} ₼ -> ${validAmount.toFixed(2)} ₼`,
      timestamp: new Date().toISOString(),
      previousBalance: oldBalance,
      newBalance: validAmount,
    };
    setAuditLogs((prev) => [audit, ...prev]);
  };

  // Helper: calculate user's current Veyra Home stage based on totalInvested
  const getUserHomeStage = (): VeyraHomeStage => {
    const total = user ? (user.totalInvested || 0) : 0;
    const activeStages = stages && stages.length > 0 ? stages : INITIAL_STAGES;
    // Find highest reached stage
    const reached = [...activeStages]
      .filter((s) => s && s.isActive && total >= s.minAmount)
      .sort((a, b) => b.minAmount - a.minAmount);

    return reached.length > 0 ? reached[0] : (activeStages[0] || INITIAL_STAGES[0]);
  };

  // Helper: calculate next home stage and required remaining amount
  const getNextHomeStage = (): { stage: VeyraHomeStage | null; neededAmount: number } => {
    const total = user ? (user.totalInvested || 0) : 0;
    const activeStages = stages && stages.length > 0 ? stages : INITIAL_STAGES;
    const next = [...activeStages]
      .filter((s) => s && s.isActive && s.minAmount > total)
      .sort((a, b) => a.minAmount - b.minAmount);

    if (next.length > 0) {
      return {
        stage: next[0],
        neededAmount: Number((next[0].minAmount - total).toFixed(2)),
      };
    }
    return { stage: null, neededAmount: 0 };
  };

  return (
    <AppContext.Provider
      value={{
        user,
        users,
        isAdmin,
        activeView,
        setActiveView,
        stages,
        transactions,
        depositRequests,
        withdrawalRequests,
        userInvestments,
        notifications,
        auditLogs,
        paymentSettings,
        depositPlans,
        depositStats,
        refreshDeposits,
        refreshPaymentSettings,
        refreshDepositPlans,
        updatePaymentSettings,
        upsertDepositPlan,
        deleteDepositPlan,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        openAuthModal,
        isDepositModalOpen,
        setIsDepositModalOpen,
        isWithdrawalModalOpen,
        setIsWithdrawalModalOpen,
        selectedDepositStageAmount,
        setSelectedDepositStageAmount,
        loginWithGoogle,
        loginWithEmail,
        registerWithEmail,
        logout,
        loginAdmin,
        logoutAdmin,
        submitDepositRequest,
        approveDeposit,
        rejectDeposit,
        submitWithdrawalRequest,
        approveWithdrawal,
        rejectWithdrawal,
        investInStage,
        updateStage,
        toggleUserStatus,
        markNotificationAsRead,
        updateUserBalance,
        reconcileBalance,
        getUserHomeStage,
        getNextHomeStage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};

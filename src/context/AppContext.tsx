import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  LedgerEntry,
  DepositRequest,
  WithdrawalRequest,
  VeyraHomeStage,
  UserInvestment,
  UserNotification,
  AuditLog,
} from '../types';
import { INITIAL_STAGES } from '../constants/stages';

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
  loginWithGoogle: (email?: string, name?: string) => Promise<boolean>;
  loginWithEmail: (email: string, pass: string) => Promise<boolean>;
  registerWithEmail: (name: string, email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  loginAdmin: (password: string) => Promise<{ success: boolean; error?: string }>;
  logoutAdmin: () => void;
  
  // Financial Operations
  submitDepositRequest: (amount: number, referenceCode: string, receiptDataUrl: string, receiptFileName: string) => Promise<DepositRequest>;
  approveDeposit: (depositId: string) => void;
  rejectDeposit: (depositId: string, reason: string) => void;
  
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
        return JSON.parse(saved);
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
        return JSON.parse(saved);
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

  // Server-side Admin Session Verification
  useEffect(() => {
    const token = sessionStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN);
    if (isAdmin && token) {
      fetch('/api/admin/verify', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (!res.ok) {
            // Token rejected by server
            setIsAdmin(false);
            localStorage.removeItem(STORAGE_KEYS.IS_ADMIN);
            sessionStorage.removeItem(STORAGE_KEYS.ADMIN_TOKEN);
          }
        })
        .catch(() => {
          // Keep current state on network disconnect
        });
    }
  }, [isAdmin]);

  const [stages, setStages] = useState<VeyraHomeStage[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STAGES);
    if (saved) {
      try {
        return JSON.parse(saved);
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

  // Auth functions
  const loginWithGoogle = async (googleEmail?: string, googleName?: string): Promise<boolean> => {
    const email = googleEmail || 'ravidagayev3169@gmail.com';
    const name = googleName || (email.toLowerCase().includes('ravid') ? 'Ravid Ağayev' : 'Google İnvestor');
    let targetUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    // Calculate real verified balance from approved deposits only
    const approvedDepositTotal = depositRequests
      .filter((d) => d.userId === targetUser?.id && d.status === 'completed')
      .reduce((sum, d) => sum + (Number(d.amount) || 0), 0);

    const approvedWithdrawalTotal = withdrawalRequests
      .filter((w) => w.userId === targetUser?.id && w.status === 'completed')
      .reduce((sum, w) => sum + (Number(w.amount) || 0), 0);

    const verifiedBalance = Number(Math.max(0, approvedDepositTotal - approvedWithdrawalTotal).toFixed(2));

    if (!targetUser) {
      targetUser = {
        id: 'usr_' + Math.random().toString(36).substring(2, 9),
        name,
        email,
        balance: 0.00, // Strictly 0.00 AZN initial balance
        totalInvested: 0.00,
        totalProfit: 0.00,
        todayChange: 0.00,
        role: 'investor',
        createdAt: new Date().toISOString(),
        isActive: true,
        authProvider: 'google',
        kyc: {
          isVerified: false,
          fullName: name,
          finCode: '',
          idSerial: '',
          documentType: 'Azərbaycan Şəxsiyyət Vəsiqəsi',
          status: 'unsubmitted',
        },
      };
      setUsers((prev) => [...prev, targetUser!]);
    } else {
      // Re-verify existing user: reset any fake balance to real approved deposit total
      targetUser = {
        ...targetUser,
        name: targetUser.name || name,
        balance: verifiedBalance,
        totalInvested: approvedDepositTotal > 0 ? (targetUser.totalInvested || 0) : 0.00,
        totalProfit: approvedDepositTotal > 0 ? (targetUser.totalProfit || 0) : 0.00,
        todayChange: approvedDepositTotal > 0 ? (targetUser.todayChange || 0) : 0.00,
        kyc: targetUser.kyc || {
          isVerified: false,
          fullName: targetUser.name || name,
          finCode: '',
          idSerial: '',
          documentType: 'Azərbaycan Şəxsiyyət Vəsiqəsi',
          status: 'unsubmitted',
        },
      };
      setUsers((prev) => prev.map((u) => (u.id === targetUser!.id ? targetUser! : u)));
    }

    if (!targetUser.isActive) {
      alert('Hesabınız dondurulub. Zəhmət olmasa Veyra Invest rəhbərliyi ilə əlaqə saxlayın.');
      return false;
    }

    setUser(targetUser);
    setIsAuthModalOpen(false);
    setActiveView('dashboard');
    return true;
  };

  const loginWithEmail = async (email: string, pass: string): Promise<boolean> => {
    if (!email || !pass) return false;
    let targetUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    
    if (!targetUser) {
      // Auto register for convenient experience
      targetUser = {
        id: 'usr_' + Math.random().toString(36).substring(2, 9),
        name: email.split('@')[0],
        email,
        balance: 0.00,
        totalInvested: 0.00,
        totalProfit: 0.00,
        todayChange: 0.00,
        role: 'investor',
        createdAt: new Date().toISOString(),
        isActive: true,
        authProvider: 'gmail',
        kyc: {
          isVerified: false,
          fullName: email.split('@')[0],
          finCode: '',
          idSerial: '',
          documentType: 'Azərbaycan Şəxsiyyət Vəsiqəsi',
          status: 'unsubmitted',
        },
      };
      setUsers((prev) => [...prev, targetUser!]);
    }

    if (!targetUser.isActive) {
      alert('Hesabınız dondurulub.');
      return false;
    }

    setUser(targetUser);
    setIsAuthModalOpen(false);
    setActiveView('dashboard');
    return true;
  };

  const registerWithEmail = async (name: string, email: string, pass: string): Promise<boolean> => {
    if (!email || !name) return false;
    const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return loginWithEmail(email, pass);
    }

    const newUser: User = {
      id: 'usr_' + Math.random().toString(36).substring(2, 9),
      name,
      email,
      balance: 0.00,
      totalInvested: 0.00,
      totalProfit: 0.00,
      todayChange: 0.00,
      role: 'investor',
      createdAt: new Date().toISOString(),
      isActive: true,
      authProvider: 'gmail',
      kyc: {
        isVerified: false,
        fullName: name,
        finCode: '',
        idSerial: '',
        documentType: 'Azərbaycan Şəxsiyyət Vəsiqəsi',
        status: 'unsubmitted',
      },
    };

    setUsers((prev) => [...prev, newUser]);
    setUser(newUser);
    setIsAuthModalOpen(false);
    setActiveView('dashboard');
    return true;
  };

  const logout = () => {
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

  // Submit manual deposit request
  const submitDepositRequest = async (
    amount: number,
    referenceCode: string,
    receiptDataUrl: string,
    receiptFileName: string
  ): Promise<DepositRequest> => {
    if (!user) throw new Error('İstifadəçi daxil olmayıb');

    const newDeposit: DepositRequest = {
      id: 'dep_' + Math.random().toString(36).substring(2, 10).toUpperCase(),
      userId: user.id,
      userEmail: user.email,
      userName: user.name,
      amount: Number(amount.toFixed(2)),
      currency: 'AZN',
      status: 'pending',
      createdAt: new Date().toISOString(),
      paymentMethod: 'Birbank / Kapital Bank',
      bankAccount: '4169 7388 4952 8363',
      referenceCode,
      receiptUrl: receiptDataUrl,
      receiptFileName,
    };

    // Add to deposit requests
    setDepositRequests((prev) => [newDeposit, ...prev]);

    // Initial Ledger entry in pending status
    const ledgerEntry: LedgerEntry = {
      id: 'led_' + Math.random().toString(36).substring(2, 10),
      userId: user.id,
      type: 'deposit',
      amount: Number(amount.toFixed(2)),
      currency: 'AZN',
      status: 'pending',
      timestamp: new Date().toISOString(),
      referenceId: newDeposit.id,
      description: `Birbank / Kapital Bank depozit sorğusu (Ref: ${referenceCode})`,
      balanceBefore: user.balance,
      balanceAfter: user.balance, // Note: Balance unchanged until admin approval!
    };
    setTransactions((prev) => [ledgerEntry, ...prev]);

    // Notification
    const notif: UserNotification = {
      id: 'notif_' + Math.random().toString(36).substring(2, 9),
      userId: user.id,
      title: 'Depozit sorğunuz qəbul edildi',
      message: `${amount.toFixed(2)} AZN məbləğində depozit ödəniş sübutunuz qəbul edildi və yoxlanışa göndərildi.`,
      type: 'deposit',
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [notif, ...prev]);

    return newDeposit;
  };

  // Admin approves deposit -> Increases user balance, updates ledger, sends notification, logs audit
  const approveDeposit = (depositId: string) => {
    const deposit = depositRequests.find((d) => d.id === depositId);
    if (!deposit || deposit.status === 'completed') return;

    const targetUser = users.find((u) => u.id === deposit.userId);
    if (!targetUser) return;

    const oldBalance = targetUser.balance;
    const newBalance = Number((oldBalance + deposit.amount).toFixed(2));

    // Update deposit request
    setDepositRequests((prev) =>
      prev.map((d) =>
        d.id === depositId
          ? { ...d, status: 'completed', approvedAt: new Date().toISOString(), approvedBy: 'Admin' }
          : d
      )
    );

    // Update user balance
    setUsers((prev) =>
      prev.map((u) => (u.id === targetUser.id ? { ...u, balance: newBalance } : u))
    );

    if (user && user.id === targetUser.id) {
      setUser((prev) => (prev ? { ...prev, balance: newBalance } : null));
    }

    // Ledger completed entry
    const ledgerEntry: LedgerEntry = {
      id: 'led_' + Math.random().toString(36).substring(2, 10),
      userId: targetUser.id,
      type: 'deposit',
      amount: deposit.amount,
      currency: 'AZN',
      status: 'completed',
      timestamp: new Date().toISOString(),
      referenceId: deposit.id,
      description: `Depozit təsdiqləndi: +${deposit.amount.toFixed(2)} AZN (Birbank / Kapital Bank)`,
      balanceBefore: oldBalance,
      balanceAfter: newBalance,
    };
    setTransactions((prev) => [ledgerEntry, ...prev]);

    // User notification
    const notif: UserNotification = {
      id: 'notif_' + Math.random().toString(36).substring(2, 9),
      userId: targetUser.id,
      title: '✓ Depozit təsdiqləndi!',
      message: `${deposit.amount.toFixed(2)} AZN məbləğində vəsait balansınıza uğurla əlavə edildi. Yeni balansınız: ${newBalance.toFixed(2)} AZN.`,
      type: 'deposit',
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [notif, ...prev]);

    // Audit log
    const audit: AuditLog = {
      id: 'aud_' + Math.random().toString(36).substring(2, 10),
      adminId: 'adm_01',
      adminEmail: 'admin@veyra.az',
      userId: targetUser.id,
      action: 'DEPOSIT_APPROVED',
      details: `${deposit.amount.toFixed(2)} AZN depozit təsdiqləndi. Ref: ${deposit.referenceCode}`,
      timestamp: new Date().toISOString(),
      previousBalance: oldBalance,
      newBalance: newBalance,
      entityId: deposit.id,
    };
    setAuditLogs((prev) => [audit, ...prev]);
  };

  // Admin rejects deposit
  const rejectDeposit = (depositId: string, reason: string) => {
    const deposit = depositRequests.find((d) => d.id === depositId);
    if (!deposit) return;

    setDepositRequests((prev) =>
      prev.map((d) =>
        d.id === depositId
          ? { ...d, status: 'rejected', rejectionReason: reason || 'Ödəniş sübutu uyğun deyil.' }
          : d
      )
    );

    // Ledger entry
    const ledgerEntry: LedgerEntry = {
      id: 'led_' + Math.random().toString(36).substring(2, 10),
      userId: deposit.userId,
      type: 'deposit',
      amount: deposit.amount,
      currency: 'AZN',
      status: 'rejected',
      timestamp: new Date().toISOString(),
      referenceId: deposit.id,
      description: `Depozit rədd edildi: ${reason || 'Ödəniş sübutu uyğun deyil.'}`,
      balanceBefore: 0,
      balanceAfter: 0,
    };
    setTransactions((prev) => [ledgerEntry, ...prev]);

    // Notification
    const notif: UserNotification = {
      id: 'notif_' + Math.random().toString(36).substring(2, 9),
      userId: deposit.userId,
      title: 'Depozit sorğunuz rədd edildi',
      message: `${deposit.amount.toFixed(2)} AZN məbləğində depozit sorğunuz təsdiqlənmədi. Səbəb: ${reason}`,
      type: 'deposit',
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [notif, ...prev]);

    // Audit log
    const audit: AuditLog = {
      id: 'aud_' + Math.random().toString(36).substring(2, 10),
      adminId: 'adm_01',
      adminEmail: 'admin@veyra.az',
      userId: deposit.userId,
      action: 'DEPOSIT_REJECTED',
      details: `${deposit.amount.toFixed(2)} AZN depozit rədd edildi. Səbəb: ${reason}`,
      timestamp: new Date().toISOString(),
      entityId: deposit.id,
    };
    setAuditLogs((prev) => [audit, ...prev]);
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

import fs from 'fs';
import path from 'path';

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  balance: number;
  totalInvested: number;
  totalProfit: number;
  role: 'investor' | 'admin';
  createdAt: string;
  isActive: boolean;
  kycStatus: 'unverified' | 'pending' | 'verified';
  authProvider?: 'google' | 'email' | 'gmail';
  googleId?: string;
  passwordHash?: string;
}

export interface DepositPlanRecord {
  id: string;
  name: string;
  minAmount: number;
  maxAmount: number;
  durationDays: number;
  profitRate: number;
  dailyIncome?: number;
  monthlyIncome?: number;
  terms: string;
  riskLevel: 'Çox Aşağı' | 'Aşağı' | 'Orta' | 'Düşünülmüş';
  isActive: boolean;
  order: number;
}

export interface PaymentSettingsRecord {
  id: string;
  bankName: string;
  accountHolder: string;
  cardNumber: string;
  maskedCard: string;
  iban: string;
  paymentMethod: string;
  instructions: string;
  isActive: boolean;
  updatedAt: string;
  updatedBy: string;
}

export interface DepositReceiptRecord {
  id: string;
  depositId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  dataUrl: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface DepositRecord {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  amount: number;
  currency: string;
  stageId?: number;
  stageName: string;
  planId?: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  adminNote?: string;
  paymentMethod: string;
  bankAccount: string;
  txHash?: string;
  referenceNumber: string;
  receiptUrl?: string;
  hasReceipt: boolean;
  receiptFileName?: string;
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  ip?: string;
  dailyIncome?: number;
  monthlyIncome?: number;
}

export interface BalanceTransactionRecord {
  id: string;
  userId: string;
  type: 'deposit' | 'withdrawal' | 'profit' | 'investment';
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  referenceId?: string;
  description: string;
  createdAt: string;
}

export interface AdminAuditLogRecord {
  id: string;
  adminId: string;
  adminEmail: string;
  action: string;
  details: string;
  timestamp: string;
}

export interface DatabaseSchema {
  users: UserRecord[];
  deposits: DepositRecord[];
  deposit_receipts: DepositReceiptRecord[];
  deposit_plans: DepositPlanRecord[];
  balance_transactions: BalanceTransactionRecord[];
  admin_audit_logs: AdminAuditLogRecord[];
  payment_settings: PaymentSettingsRecord;
}

const DEFAULT_PLANS: DepositPlanRecord[] = [
  {
    id: 'plan_25',
    name: 'Veyra Start',
    minAmount: 25,
    maxAmount: 49,
    durationDays: 30,
    profitRate: 6.0,
    dailyIncome: 1.5,
    monthlyIncome: 45,
    terms: 'Gündəlik gəlir: 1.50 AZN • Aylıq gəlir: 45 AZN',
    riskLevel: 'Çox Aşağı',
    isActive: true,
    order: 1,
  },
  {
    id: 'plan_50',
    name: 'Veyra Build',
    minAmount: 50,
    maxAmount: 99,
    durationDays: 30,
    profitRate: 6.0,
    dailyIncome: 3.0,
    monthlyIncome: 90,
    terms: 'Gündəlik gəlir: 3.00 AZN • Aylıq gəlir: 90 AZN',
    riskLevel: 'Çox Aşağı',
    isActive: true,
    order: 2,
  },
  {
    id: 'plan_100',
    name: 'Veyra Growth',
    minAmount: 100,
    maxAmount: 249,
    durationDays: 30,
    profitRate: 6.0,
    dailyIncome: 6.0,
    monthlyIncome: 180,
    terms: 'Gündəlik gəlir: 6.00 AZN • Aylıq gəlir: 180 AZN',
    riskLevel: 'Aşağı',
    isActive: true,
    order: 3,
  },
  {
    id: 'plan_250',
    name: 'Veyra Residence',
    minAmount: 250,
    maxAmount: 499,
    durationDays: 30,
    profitRate: 6.0,
    dailyIncome: 15.0,
    monthlyIncome: 450,
    terms: 'Gündəlik gəlir: 15.00 AZN • Aylıq gəlir: 450 AZN',
    riskLevel: 'Aşağı',
    isActive: true,
    order: 4,
  },
  {
    id: 'plan_500',
    name: 'Veyra Premium',
    minAmount: 500,
    maxAmount: 749,
    durationDays: 30,
    profitRate: 6.0,
    dailyIncome: 30.0,
    monthlyIncome: 900,
    terms: 'Gündəlik gəlir: 30.00 AZN • Aylıq gəlir: 900 AZN',
    riskLevel: 'Aşağı',
    isActive: true,
    order: 5,
  },
  {
    id: 'plan_750',
    name: 'Veyra Prestij',
    minAmount: 750,
    maxAmount: 999,
    durationDays: 30,
    profitRate: 6.0,
    dailyIncome: 45.0,
    monthlyIncome: 1350,
    terms: 'Gündəlik gəlir: 45.00 AZN • Aylıq gəlir: 1350 AZN',
    riskLevel: 'Orta',
    isActive: true,
    order: 6,
  },
  {
    id: 'plan_1000',
    name: 'Veyra Luxury',
    minAmount: 1000,
    maxAmount: 1199,
    durationDays: 30,
    profitRate: 6.0,
    dailyIncome: 60.0,
    monthlyIncome: 1800,
    terms: 'Gündəlik gəlir: 60.00 AZN • Aylıq gəlir: 1800 AZN',
    riskLevel: 'Düşünülmüş',
    isActive: true,
    order: 7,
  },
  {
    id: 'plan_1200',
    name: 'Veyra Elite',
    minAmount: 1200,
    maxAmount: 50000,
    durationDays: 30,
    profitRate: 6.0,
    dailyIncome: 72.0,
    monthlyIncome: 2160,
    terms: 'Gündəlik gəlir: 72.00 AZN • Aylıq gəlir: 2160 AZN',
    riskLevel: 'Düşünülmüş',
    isActive: true,
    order: 8,
  },
];

const DEFAULT_PAYMENT_SETTINGS: PaymentSettingsRecord = {
  id: 'pay_settings_main',
  bankName: 'Kapital Bank / Birbank',
  accountHolder: 'Veyra İnvest',
  cardNumber: '4169 7388 4952 8363',
  maskedCard: '4169 7388 4952 8363',
  iban: 'AZ21NABZ01350100000000012345',
  paymentMethod: 'Birbank / Kapital Bank',
  instructions: 'Ödənişi göstərilən hesaba/karta köçürün. Ödəniş etdikdən sonra qəbzi yükləyin.',
  isActive: true,
  updatedAt: new Date().toISOString(),
  updatedBy: 'Sistem',
};

class Database {
  private data: DatabaseSchema;
  private filePath: string;

  constructor() {
    this.filePath = path.join('/tmp', 'veyra_db.json');
    this.data = this.getDefaultSchema();
    this.load();
  }

  private getDefaultSchema(): DatabaseSchema {
    return {
      users: [
        {
          id: 'usr_default_investor',
          name: 'Ravid Ağayev',
          email: 'ravidagayev3169@gmail.com',
          balance: 0,
          totalInvested: 0,
          totalProfit: 0,
          role: 'investor',
          createdAt: '2026-03-01T10:00:00.000Z',
          isActive: true,
          kycStatus: 'verified',
        },
      ],
      deposits: [],
      deposit_receipts: [],
      deposit_plans: DEFAULT_PLANS,
      balance_transactions: [],
      admin_audit_logs: [],
      payment_settings: DEFAULT_PAYMENT_SETTINGS,
    };
  }

  private load() {
    try {
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, 'utf-8');
        const parsed = JSON.parse(raw);
        this.data = {
          ...this.getDefaultSchema(),
          ...parsed,
          payment_settings: {
            ...DEFAULT_PAYMENT_SETTINGS,
            ...(parsed.payment_settings || {}),
          },
          deposit_plans:
            parsed.deposit_plans && parsed.deposit_plans.length > 0
              ? parsed.deposit_plans
              : DEFAULT_PLANS,
        };
      }
    } catch {
      this.data = this.getDefaultSchema();
    }
  }

  private save() {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch {}
  }

  public getUsers(): UserRecord[] {
    return [...this.data.users];
  }

  public getUserById(id: string): UserRecord | null {
    return this.data.users.find((u) => u.id === id) || null;
  }

  public getUserByEmail(email: string): UserRecord | null {
    return (
      this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null
    );
  }

  public getUserByGoogleId(googleId: string): UserRecord | null {
    if (!googleId) return null;
    return this.data.users.find((u) => u.googleId === googleId) || null;
  }

  public upsertUser(user: Partial<UserRecord> & { id: string; email: string }): UserRecord {
    const existingIndex = this.data.users.findIndex(
      (u) =>
        u.id === user.id ||
        (user.googleId && u.googleId === user.googleId) ||
        u.email.toLowerCase() === user.email.toLowerCase()
    );
    if (existingIndex >= 0) {
      const existing = this.data.users[existingIndex];
      const updated: UserRecord = {
        ...existing,
        ...user,
        name: user.name || existing.name,
        avatarUrl: user.avatarUrl || existing.avatarUrl,
        googleId: user.googleId || existing.googleId,
        authProvider: user.authProvider || existing.authProvider,
        balance: user.balance !== undefined ? user.balance : existing.balance,
      };
      this.data.users[existingIndex] = updated;
      this.save();
      return updated;
    } else {
      const newUser: UserRecord = {
        id: user.id,
        name: user.name || user.email.split('@')[0],
        email: user.email,
        phone: user.phone,
        avatarUrl: user.avatarUrl,
        balance: user.balance || 0,
        totalInvested: user.totalInvested || 0,
        totalProfit: user.totalProfit || 0,
        role: user.role || 'investor',
        createdAt: user.createdAt || new Date().toISOString(),
        isActive: true,
        kycStatus: user.kycStatus || 'unverified',
        authProvider: user.authProvider || 'google',
        googleId: user.googleId,
        passwordHash: user.passwordHash,
      };
      this.data.users.push(newUser);
      this.save();
      return newUser;
    }
  }

  public getDeposits(params: {
    userId?: string;
    status?: string;
    search?: string;
    planId?: string;
    sortBy?: 'newest' | 'oldest';
    page?: number;
    limit?: number;
  }) {
    let list = [...this.data.deposits];
    if (params.userId) {
      list = list.filter((d) => d.userId === params.userId);
    }
    if (params.status && params.status !== 'all') {
      list = list.filter((d) => d.status === params.status);
    }
    if (params.search) {
      const q = params.search.toLowerCase();
      list = list.filter(
        (d) =>
          d.userName.toLowerCase().includes(q) ||
          d.userEmail.toLowerCase().includes(q) ||
          d.referenceNumber.toLowerCase().includes(q)
      );
    }
    list.sort((a, b) =>
      params.sortBy === 'oldest'
        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const total = list.length;
    const page = params.page || 1;
    const limit = params.limit || 50;
    const items = list.slice((page - 1) * limit, page * limit);
    return { items, total, page, totalPages: Math.ceil(total / limit) || 1 };
  }

  public createDeposit(data: Partial<DepositRecord>): { deposit: DepositRecord } {
    const deposit: DepositRecord = {
      id: 'dep_' + Math.random().toString(36).substring(2, 9),
      userId: data.userId || 'usr_unknown',
      userEmail: data.userEmail || '',
      userName: data.userName || '',
      amount: Number(data.amount) || 0,
      currency: 'AZN',
      stageName: data.stageName || 'Veyra Layihəsi',
      status: 'pending',
      paymentMethod: data.paymentMethod || 'Kart Transferi',
      bankAccount: data.bankAccount || '',
      referenceNumber: 'REF' + Math.floor(100000 + Math.random() * 900000),
      hasReceipt: Boolean(data.hasReceipt),
      receiptFileName: data.receiptFileName,
      createdAt: new Date().toISOString(),
      dailyIncome: data.dailyIncome,
      monthlyIncome: data.monthlyIncome,
    };
    this.data.deposits.unshift(deposit);
    this.save();
    return { deposit };
  }

  public updateDepositStatus(
    depositId: string,
    status: 'approved' | 'rejected',
    adminId: string,
    reason?: string
  ): DepositRecord {
    const dep = this.data.deposits.find((d) => d.id === depositId);
    if (!dep) throw new Error('Depozit tapılmadı');
    dep.status = status;
    dep.reviewedAt = new Date().toISOString();
    dep.reviewedBy = adminId;
    if (reason) dep.rejectionReason = reason;

    if (status === 'approved') {
      const user = this.data.users.find((u) => u.id === dep.userId);
      if (user) {
        user.balance = Number((user.balance + dep.amount).toFixed(2));
      }
    }
    this.save();
    return dep;
  }

  public getDepositPlans(includeInactive = false): DepositPlanRecord[] {
    if (includeInactive) return [...this.data.deposit_plans];
    return this.data.deposit_plans.filter((p) => p.isActive);
  }

  public upsertDepositPlan(plan: Partial<DepositPlanRecord>, adminId: string): DepositPlanRecord {
    const idx = this.data.deposit_plans.findIndex((p) => p.id === plan.id);
    if (idx >= 0) {
      this.data.deposit_plans[idx] = { ...this.data.deposit_plans[idx], ...plan };
      this.save();
      return this.data.deposit_plans[idx];
    } else {
      const newPlan: DepositPlanRecord = {
        id: plan.id || 'plan_' + Math.random().toString(36).substring(2, 7),
        name: plan.name || 'Yeni Plan',
        minAmount: plan.minAmount || 25,
        maxAmount: plan.maxAmount || 50000,
        durationDays: plan.durationDays || 30,
        profitRate: plan.profitRate || 6.0,
        dailyIncome: plan.dailyIncome,
        monthlyIncome: plan.monthlyIncome,
        terms: plan.terms || '',
        riskLevel: plan.riskLevel || 'Aşağı',
        isActive: plan.isActive !== false,
        order: this.data.deposit_plans.length + 1,
      };
      this.data.deposit_plans.push(newPlan);
      this.save();
      return newPlan;
    }
  }

  public deleteDepositPlan(id: string, adminId: string): boolean {
    const before = this.data.deposit_plans.length;
    this.data.deposit_plans = this.data.deposit_plans.filter((p) => p.id !== id);
    this.save();
    return this.data.deposit_plans.length < before;
  }

  public getPaymentSettings(): PaymentSettingsRecord {
    return { ...this.data.payment_settings };
  }

  public updatePaymentSettings(settings: Partial<PaymentSettingsRecord>, adminId: string): PaymentSettingsRecord {
    this.data.payment_settings = {
      ...this.data.payment_settings,
      ...settings,
      updatedAt: new Date().toISOString(),
      updatedBy: adminId,
    };
    this.save();
    return { ...this.data.payment_settings };
  }

  public getReceiptByDepositId(depositId: string): DepositReceiptRecord | null {
    return this.data.deposit_receipts.find((r) => r.depositId === depositId) || null;
  }

  public saveReceipt(receipt: DepositReceiptRecord): void {
    const idx = this.data.deposit_receipts.findIndex((r) => r.depositId === receipt.depositId);
    if (idx >= 0) {
      this.data.deposit_receipts[idx] = receipt;
    } else {
      this.data.deposit_receipts.push(receipt);
    }
    this.save();
  }

  public getAuditLogs(): AdminAuditLogRecord[] {
    return [...this.data.admin_audit_logs];
  }

  public logAdminAction(log: Omit<AdminAuditLogRecord, 'id' | 'timestamp'>): void {
    this.data.admin_audit_logs.unshift({
      ...log,
      id: 'aud_' + Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toISOString(),
    });
    this.save();
  }
}

export const db = new Database();

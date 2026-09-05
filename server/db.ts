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
  dataUrl: string; // base64 receipt data
  uploadedAt: string;
  uploadedBy: string;
}

export interface DepositRecord {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone?: string;
  amount: number;
  planId: string;
  planName: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  paymentMethod: string;
  paymentDestinationUsed: string;
  referenceCode: string;
  receiptId?: string;
  receiptFileName?: string;
  receiptPreview?: string;
  verificationStatus: 'pending_review' | 'verified_approved' | 'rejected_invalid';
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  verificationNote?: string;
  transactionReferenceId?: string;
}

export interface BalanceTransactionRecord {
  id: string;
  userId: string;
  type: 'deposit' | 'withdrawal' | 'investment' | 'bonus' | 'adjustment';
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  status: 'completed' | 'pending' | 'rejected';
  referenceId: string;
  description: string;
  timestamp: string;
  createdBy: string;
}

export interface AdminAuditLogRecord {
  id: string;
  adminId: string;
  adminEmail: string;
  action:
    | 'ADMIN_APPROVED_DEPOSIT'
    | 'ADMIN_REJECTED_DEPOSIT'
    | 'ADMIN_CHANGED_DEPOSIT_STATUS'
    | 'ADMIN_VIEWED_RECEIPT'
    | 'ADMIN_UPDATED_PAYMENT_SETTINGS'
    | 'ADMIN_UPDATED_PLAN'
    | 'ADMIN_UPDATED_BALANCE';
  depositId?: string;
  userId?: string;
  previousStatus?: string;
  newStatus?: string;
  previousBalance?: number;
  newBalance?: number;
  details: string;
  ip?: string;
  timestamp: string;
}

export interface AdminUserRecord {
  id: string;
  username: string;
  role: 'super_admin' | 'finance_admin';
  name: string;
  email: string;
  lastLogin?: string;
}

export interface DatabaseSchema {
  users: UserRecord[];
  deposits: DepositRecord[];
  deposit_receipts: DepositReceiptRecord[];
  deposit_plans: DepositPlanRecord[];
  balance_transactions: BalanceTransactionRecord[];
  admin_audit_logs: AdminAuditLogRecord[];
  payment_settings: PaymentSettingsRecord;
  admin_users: AdminUserRecord[];
}

// Initial seed data
const DEFAULT_PLANS: DepositPlanRecord[] = [
  {
    id: 'plan_25',
    name: 'Başlanğıc Giriş Payı',
    minAmount: 25,
    maxAmount: 49,
    durationDays: 14,
    profitRate: 0.45,
    terms: 'Mərhələ 1: Torpaq analizi və layihələndirmə fondu. 14 günlük sabit dövr.',
    riskLevel: 'Çox Aşağı',
    isActive: true,
    order: 1,
  },
  {
    id: 'plan_50',
    name: 'Təməl Qazıntı Paketi',
    minAmount: 50,
    maxAmount: 99,
    durationDays: 21,
    profitRate: 0.55,
    terms: 'Mərhələ 2: Qazıntı və bünövrə möhkəmləndirmə mərhələsi.',
    riskLevel: 'Çox Aşağı',
    isActive: true,
    order: 2,
  },
  {
    id: 'plan_100',
    name: 'Dəmir-Beton Karkas',
    minAmount: 100,
    maxAmount: 199,
    durationDays: 30,
    profitRate: 0.65,
    terms: 'Mərhələ 3: Monolit beton karkas quraşdırılması.',
    riskLevel: 'Aşağı',
    isActive: true,
    order: 3,
  },
  {
    id: 'plan_200',
    name: 'Divarlar & Hörgü Mərhələsi',
    minAmount: 200,
    maxAmount: 499,
    durationDays: 45,
    profitRate: 0.72,
    terms: 'Mərhələ 4: Daxili və xarici kərpic hörgü təchizatı.',
    riskLevel: 'Aşağı',
    isActive: true,
    order: 4,
  },
  {
    id: 'plan_500',
    name: 'Dam & İzolyasiya Paketi',
    minAmount: 500,
    maxAmount: 999,
    durationDays: 60,
    profitRate: 0.80,
    terms: 'Mərhələ 5: Hidroizolyasiya və dam örtüyü tikintisi.',
    riskLevel: 'Orta',
    isActive: true,
    order: 5,
  },
  {
    id: 'plan_1000',
    name: 'Premium Fasad & Vitraj',
    minAmount: 1000,
    maxAmount: 1199,
    durationDays: 75,
    profitRate: 0.88,
    terms: 'Mərhələ 6: Avropa istehsalı vitraj və termo-fasad.',
    riskLevel: 'Orta',
    isActive: true,
    order: 6,
  },
  {
    id: 'plan_1200',
    name: 'Lüks Villa Tamamlama Portfeli',
    minAmount: 1200,
    maxAmount: 50000,
    durationDays: 90,
    profitRate: 0.95,
    terms: 'Mərhələ 7: Açar təhvili, landşaft və smart villa avtomatlaşdırması.',
    riskLevel: 'Düşünülmüş',
    isActive: true,
    order: 7,
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
  instructions:
    'Ödənişi göstərilən hesaba/karta köçürün. Ödəniş etdikdən sonra qəbzi yükləyin.',
  isActive: true,
  updatedAt: new Date().toISOString(),
  updatedBy: 'Sistem',
};

const DEFAULT_ADMIN_USERS: AdminUserRecord[] = [
  {
    id: 'adm_01',
    username: 'admin',
    role: 'super_admin',
    name: 'Veyra Mərkəzi Baş İnzibatçı',
    email: 'admin@veyrainvest.az',
  },
];

function maskCardNumber(card: string): string {
  const clean = card.replace(/\s+/g, '');
  if (clean.length < 8) return card;
  const first4 = clean.slice(0, 4);
  const last4 = clean.slice(-4);
  return `${first4} •••• •••• ${last4}`;
}

// Database Engine with JSON File Persistence & In-Memory Sync
class Database {
  private data: DatabaseSchema;
  private filePath: string;
  private isLoaded = false;

  constructor() {
    // Resolve safe path
    const dataDir = path.resolve(process.cwd(), 'data');
    let targetPath = path.join(dataDir, 'veyra_db.json');

    // Attempt directory creation
    try {
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
    } catch {
      // Fallback for read-only root environments like serverless
      targetPath = path.join('/tmp', 'veyra_db.json');
    }

    this.filePath = targetPath;
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
      admin_users: DEFAULT_ADMIN_USERS,
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
      } else {
        this.save();
      }
      this.isLoaded = true;
    } catch (err) {
      console.warn('DB Load warning (using in-memory fallback):', err);
      this.data = this.getDefaultSchema();
      this.isLoaded = true;
    }
  }

  private save() {
    try {
      const dir = path.dirname(this.filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      const tempPath = `${this.filePath}.tmp.${Date.now()}`;
      fs.writeFileSync(tempPath, JSON.stringify(this.data, null, 2), 'utf-8');
      fs.renameSync(tempPath, this.filePath);
    } catch (err) {
      console.warn('DB Save warning:', err);
    }
  }

  // Users
  public getUsers(): UserRecord[] {
    return [...this.data.users];
  }

  public getUserById(id: string): UserRecord | null {
    return this.data.users.find((u) => u.id === id) || null;
  }

  public getUserByEmail(email: string): UserRecord | null {
    return (
      this.data.users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      ) || null
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

  public updateUserBalance(
    userId: string,
    amountDelta: number,
    adminId: string,
    reason: string
  ): { user: UserRecord; transaction: BalanceTransactionRecord } {
    let targetUser = this.data.users.find((u) => u.id === userId);
    if (!targetUser) {
      throw new Error(`İstifadəçi tapılmadı (ID: ${userId})`);
    }

    const prevBalance = Number(targetUser.balance.toFixed(2));
    const newBalance = Number((prevBalance + amountDelta).toFixed(2));
    if (newBalance < 0) {
      throw new Error('Balans mənfi ola bilməz.');
    }

    targetUser.balance = newBalance;

    // Create ledger transaction
    const transaction: BalanceTransactionRecord = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      userId,
      type: amountDelta >= 0 ? 'deposit' : 'withdrawal',
      amount: Math.abs(amountDelta),
      balanceBefore: prevBalance,
      balanceAfter: newBalance,
      status: 'completed',
      referenceId: `bal_${Date.now()}`,
      description: reason,
      timestamp: new Date().toISOString(),
      createdBy: adminId,
    };

    this.data.balance_transactions.unshift(transaction);
    this.save();

    return { user: targetUser, transaction };
  }

  // Payment Settings
  public getPaymentSettings(): PaymentSettingsRecord {
    return { ...this.data.payment_settings };
  }

  public updatePaymentSettings(
    updates: Partial<PaymentSettingsRecord>,
    adminId: string
  ): PaymentSettingsRecord {
    const prev = this.data.payment_settings;
    const cardNumber = updates.cardNumber || prev.cardNumber;
    const maskedCard = updates.maskedCard || maskCardNumber(cardNumber);

    this.data.payment_settings = {
      ...prev,
      ...updates,
      cardNumber,
      maskedCard,
      updatedAt: new Date().toISOString(),
      updatedBy: adminId,
    };

    this.createAuditLog({
      adminId,
      adminEmail: 'admin@veyrainvest.az',
      action: 'ADMIN_UPDATED_PAYMENT_SETTINGS',
      details: `Ödəniş rekvizitləri yeniləndi: Bank ${this.data.payment_settings.bankName}, Kart ${maskedCard}`,
    });

    this.save();
    return this.data.payment_settings;
  }

  // Deposit Plans
  public getDepositPlans(includeInactive = false): DepositPlanRecord[] {
    const plans = includeInactive
      ? this.data.deposit_plans
      : this.data.deposit_plans.filter((p) => p.isActive);
    return [...plans].sort((a, b) => a.order - b.order);
  }

  public getDepositPlanById(id: string): DepositPlanRecord | null {
    return this.data.deposit_plans.find((p) => p.id === id) || null;
  }

  public upsertDepositPlan(
    plan: Partial<DepositPlanRecord> & { name: string; minAmount: number },
    adminId: string
  ): DepositPlanRecord {
    const id = plan.id || `plan_${Date.now()}`;
    const index = this.data.deposit_plans.findIndex((p) => p.id === id);

    const fullPlan: DepositPlanRecord = {
      id,
      name: plan.name,
      minAmount: plan.minAmount,
      maxAmount: plan.maxAmount || plan.minAmount * 10,
      durationDays: plan.durationDays || 30,
      profitRate: plan.profitRate || 0.65,
      terms: plan.terms || 'Standart Veyra Home investisiya şərtləri.',
      riskLevel: plan.riskLevel || 'Aşağı',
      isActive: plan.isActive !== undefined ? plan.isActive : true,
      order: plan.order || this.data.deposit_plans.length + 1,
    };

    if (index >= 0) {
      this.data.deposit_plans[index] = fullPlan;
    } else {
      this.data.deposit_plans.push(fullPlan);
    }

    this.createAuditLog({
      adminId,
      adminEmail: 'admin@veyrainvest.az',
      action: 'ADMIN_UPDATED_PLAN',
      details: `Depozit planı yeniləndi: ${fullPlan.name} (Min: ${fullPlan.minAmount} AZN)`,
    });

    this.save();
    return fullPlan;
  }

  public deleteDepositPlan(id: string, adminId: string): boolean {
    const index = this.data.deposit_plans.findIndex((p) => p.id === id);
    if (index === -1) return false;
    const removed = this.data.deposit_plans.splice(index, 1)[0];
    this.createAuditLog({
      adminId,
      adminEmail: 'admin@veyrainvest.az',
      action: 'ADMIN_UPDATED_PLAN',
      details: `Depozit planı silindi: ${removed.name}`,
    });
    this.save();
    return true;
  }

  // Deposits
  public createDeposit(input: {
    userId: string;
    userName: string;
    userEmail: string;
    userPhone?: string;
    amount: number;
    planId: string;
    receiptDataUrl?: string;
    receiptFileName?: string;
  }): { deposit: DepositRecord; receipt?: DepositReceiptRecord } {
    const plan = this.getDepositPlanById(input.planId);
    const planName = plan ? plan.name : 'Standart Depozit Planı';
    const settings = this.getPaymentSettings();

    // Generate unique real Deposit ID
    const randomHex = Math.random().toString(36).substring(2, 7).toUpperCase();
    const depositId = `DEP-${new Date().getFullYear()}-${randomHex}`;
    const referenceCode = `VYR-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    let receiptRecord: DepositReceiptRecord | undefined;
    let receiptId: string | undefined;

    if (input.receiptDataUrl) {
      receiptId = `rcpt_${depositId}`;
      receiptRecord = {
        id: receiptId,
        depositId,
        fileName: input.receiptFileName || `qebz_${depositId}.jpg`,
        fileType: input.receiptDataUrl.startsWith('data:image/png')
          ? 'image/png'
          : input.receiptDataUrl.startsWith('data:application/pdf')
          ? 'application/pdf'
          : 'image/jpeg',
        fileSize: Math.round(input.receiptDataUrl.length * 0.75),
        dataUrl: input.receiptDataUrl,
        uploadedAt: new Date().toISOString(),
        uploadedBy: input.userId,
      };
      this.data.deposit_receipts.push(receiptRecord);
    }

    const deposit: DepositRecord = {
      id: depositId,
      userId: input.userId,
      userName: input.userName,
      userEmail: input.userEmail,
      userPhone: input.userPhone,
      amount: Number(input.amount.toFixed(2)),
      planId: input.planId,
      planName,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      paymentMethod: settings.paymentMethod,
      paymentDestinationUsed: `${settings.bankName} (${settings.maskedCard})`,
      referenceCode,
      receiptId,
      receiptFileName: input.receiptFileName,
      receiptPreview: input.receiptDataUrl, // store dataUrl for admin viewing
      verificationStatus: 'pending_review',
      transactionReferenceId: `TXN-${Date.now()}-${randomHex}`,
    };

    this.data.deposits.unshift(deposit);

    // Ensure user exists in db
    this.upsertUser({
      id: input.userId,
      email: input.userEmail,
      name: input.userName,
    });

    this.save();
    return { deposit, receipt: receiptRecord };
  }

  public getDeposits(options?: {
    userId?: string;
    status?: string;
    search?: string;
    planId?: string;
    sortBy?: 'newest' | 'oldest';
    page?: number;
    limit?: number;
  }): { deposits: DepositRecord[]; total: number; page: number; totalPages: number } {
    let list = [...this.data.deposits];

    if (options?.userId) {
      list = list.filter((d) => d.userId === options.userId);
    }

    if (options?.status && options.status !== 'all') {
      list = list.filter((d) => d.status.toLowerCase() === options.status!.toLowerCase());
    }

    if (options?.planId && options.planId !== 'all') {
      list = list.filter((d) => d.planId === options.planId);
    }

    if (options?.search) {
      const q = options.search.toLowerCase().trim();
      list = list.filter(
        (d) =>
          d.id.toLowerCase().includes(q) ||
          d.userName.toLowerCase().includes(q) ||
          d.userEmail.toLowerCase().includes(q) ||
          d.referenceCode.toLowerCase().includes(q) ||
          (d.transactionReferenceId && d.transactionReferenceId.toLowerCase().includes(q))
      );
    }

    if (options?.sortBy === 'oldest') {
      list.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else {
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    const total = list.length;
    const page = Math.max(1, options?.page || 1);
    const limit = Math.max(1, options?.limit || 50);
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginated = list.slice(startIndex, startIndex + limit);

    return { deposits: paginated, total, page, totalPages };
  }

  public getDepositById(id: string): DepositRecord | null {
    return this.data.deposits.find((d) => d.id === id) || null;
  }

  public getDepositReceipt(depositId: string): DepositReceiptRecord | null {
    return (
      this.data.deposit_receipts.find((r) => r.depositId === depositId) || null
    );
  }

  // Approve deposit server-side
  public approveDeposit(
    depositId: string,
    adminId: string,
    verificationNote?: string
  ): {
    deposit: DepositRecord;
    user: UserRecord;
    transaction: BalanceTransactionRecord;
  } {
    const depositIndex = this.data.deposits.findIndex((d) => d.id === depositId);
    if (depositIndex === -1) {
      throw new Error(`Depozit tapılmadı (ID: ${depositId})`);
    }

    const deposit = this.data.deposits[depositIndex];
    if (deposit.status === 'approved') {
      throw new Error('Bu depozit artıq təsdiqlənib.');
    }

    const now = new Date().toISOString();
    const prevStatus = deposit.status;

    // Find or create target user
    let user = this.data.users.find((u) => u.id === deposit.userId);
    if (!user) {
      user = this.upsertUser({
        id: deposit.userId,
        email: deposit.userEmail,
        name: deposit.userName,
        balance: 0,
      });
    }

    const prevBalance = Number(user.balance.toFixed(2));
    const newBalance = Number((prevBalance + deposit.amount).toFixed(2));

    // Update user balance in database
    user.balance = newBalance;
    user.totalInvested = Number(((user.totalInvested || 0) + deposit.amount).toFixed(2));

    // Update deposit record
    const updatedDeposit: DepositRecord = {
      ...deposit,
      status: 'approved',
      verificationStatus: 'verified_approved',
      approvedBy: adminId || 'Admin',
      approvedAt: now,
      updatedAt: now,
      verificationNote: verificationNote || 'Mərkəzi bank çıxarışı ilə təsdiqləndi',
    };
    this.data.deposits[depositIndex] = updatedDeposit;

    // Create balance transaction in ledger
    const transaction: BalanceTransactionRecord = {
      id: `tx_dep_${deposit.id}`,
      userId: user.id,
      type: 'deposit',
      amount: deposit.amount,
      balanceBefore: prevBalance,
      balanceAfter: newBalance,
      status: 'completed',
      referenceId: deposit.id,
      description: `Depozit təsdiqləndi: +${deposit.amount.toFixed(2)} AZN (${deposit.planName})`,
      timestamp: now,
      createdBy: adminId || 'Admin',
    };
    this.data.balance_transactions.unshift(transaction);

    // Create admin audit log
    this.createAuditLog({
      adminId: adminId || 'adm_01',
      adminEmail: 'admin@veyrainvest.az',
      action: 'ADMIN_APPROVED_DEPOSIT',
      depositId: deposit.id,
      userId: user.id,
      previousStatus: prevStatus,
      newStatus: 'approved',
      previousBalance: prevBalance,
      newBalance: newBalance,
      details: `${deposit.amount.toFixed(2)} AZN depozit təsdiqləndi. Qeyd: ${
        verificationNote || 'Təsdiqləndi'
      }`,
    });

    this.save();
    return { deposit: updatedDeposit, user, transaction };
  }

  // Reject deposit server-side
  public rejectDeposit(
    depositId: string,
    adminId: string,
    reason: string,
    verificationNote?: string
  ): { deposit: DepositRecord } {
    if (!reason || !reason.trim()) {
      throw new Error('Rədd etmə səbəbi mütləq qeyd edilməlidir.');
    }

    const depositIndex = this.data.deposits.findIndex((d) => d.id === depositId);
    if (depositIndex === -1) {
      throw new Error(`Depozit tapılmadı (ID: ${depositId})`);
    }

    const deposit = this.data.deposits[depositIndex];
    if (deposit.status === 'approved') {
      throw new Error('Artıq təsdiqlənmiş depoziti rədd etmək mümkün deyil.');
    }

    const now = new Date().toISOString();
    const prevStatus = deposit.status;

    const updatedDeposit: DepositRecord = {
      ...deposit,
      status: 'rejected',
      verificationStatus: 'rejected_invalid',
      rejectionReason: reason.trim(),
      verificationNote: verificationNote || 'Qəbz təsdiqlənmədi',
      approvedBy: adminId || 'Admin',
      approvedAt: now,
      updatedAt: now,
    };
    this.data.deposits[depositIndex] = updatedDeposit;

    // Create admin audit log
    this.createAuditLog({
      adminId: adminId || 'adm_01',
      adminEmail: 'admin@veyrainvest.az',
      action: 'ADMIN_REJECTED_DEPOSIT',
      depositId: deposit.id,
      userId: deposit.userId,
      previousStatus: prevStatus,
      newStatus: 'rejected',
      details: `Depozit rədd edildi: ${deposit.amount.toFixed(2)} AZN. Səbəb: ${reason.trim()}`,
    });

    this.save();
    return { deposit: updatedDeposit };
  }

  // Audit Logs
  public createAuditLog(log: Omit<AdminAuditLogRecord, 'id' | 'timestamp'>): AdminAuditLogRecord {
    const record: AdminAuditLogRecord = {
      id: `aud_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      ...log,
    };
    this.data.admin_audit_logs.unshift(record);
    this.save();
    return record;
  }

  public getAuditLogs(limit = 100): AdminAuditLogRecord[] {
    return this.data.admin_audit_logs.slice(0, limit);
  }

  // Statistics
  public getDepositStats() {
    const deposits = this.data.deposits;
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    let totalCount = deposits.length;
    let pendingCount = 0;
    let approvedCount = 0;
    let rejectedCount = 0;

    let totalAmount = 0;
    let approvedAmount = 0;
    let pendingAmount = 0;
    let rejectedAmount = 0;

    let todayCount = 0;
    let todayAmount = 0;

    for (const d of deposits) {
      totalAmount += d.amount;
      if (d.status === 'pending') {
        pendingCount++;
        pendingAmount += d.amount;
      } else if (d.status === 'approved') {
        approvedCount++;
        approvedAmount += d.amount;
      } else if (d.status === 'rejected') {
        rejectedCount++;
        rejectedAmount += d.amount;
      }

      if (d.createdAt.startsWith(todayStr)) {
        todayCount++;
        todayAmount += d.amount;
      }
    }

    return {
      totalDeposits: totalCount,
      pendingDeposits: pendingCount,
      approvedDeposits: approvedCount,
      rejectedDeposits: rejectedCount,
      totalDepositedAmount: Number(totalAmount.toFixed(2)),
      totalApprovedAmount: Number(approvedAmount.toFixed(2)),
      totalPendingAmount: Number(pendingAmount.toFixed(2)),
      totalRejectedAmount: Number(rejectedAmount.toFixed(2)),
      todayDeposits: todayCount,
      todayDepositedAmount: Number(todayAmount.toFixed(2)),
    };
  }

  // Ledger entries
  public getTransactions(userId?: string): BalanceTransactionRecord[] {
    if (userId) {
      return this.data.balance_transactions.filter((t) => t.userId === userId);
    }
    return [...this.data.balance_transactions];
  }
}

export const db = new Database();

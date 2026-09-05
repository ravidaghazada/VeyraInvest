/**
 * Veyra Invest - Types and Data Models
 * Strict financial ledger and state structures
 */

export type TransactionType = 'deposit' | 'withdrawal' | 'investment' | 'income' | 'fee' | 'adjustment';

export type TransactionStatus = 'pending' | 'processing' | 'completed' | 'rejected' | 'failed' | 'cancelled';

export interface LedgerEntry {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number; // Stored in AZN
  currency: 'AZN';
  status: TransactionStatus;
  timestamp: string;
  referenceId: string;
  description: string;
  balanceBefore: number;
  balanceAfter: number;
}

export interface PaymentSettings {
  bankName: string;
  accountHolder: string;
  cardNumber?: string;
  maskedCard: string;
  iban: string;
  paymentMethod: string;
  instructions: string;
  isActive: boolean;
  updatedAt?: string;
}

export interface DepositPlan {
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

export interface DepositStats {
  totalDeposits: number;
  pendingDeposits: number;
  approvedDeposits: number;
  rejectedDeposits: number;
  totalDepositedAmount: number;
  totalApprovedAmount: number;
  totalPendingAmount: number;
  totalRejectedAmount: number;
  todayDeposits: number;
  todayDepositedAmount: number;
}

export interface DepositRequest {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  userPhone?: string;
  amount: number;
  currency: 'AZN';
  status: 'pending' | 'processing' | 'completed' | 'approved' | 'rejected' | 'cancelled';
  createdAt: string;
  updatedAt?: string;
  paymentMethod: string;
  paymentDestinationUsed?: string;
  bankAccount?: string;
  referenceCode: string;
  receiptUrl?: string; // base64 or file URL
  receiptId?: string;
  receiptFileName?: string;
  receiptPreview?: string;
  rejectionReason?: string;
  verificationNote?: string;
  verificationStatus?: 'pending_review' | 'verified_approved' | 'rejected_invalid';
  approvedAt?: string;
  approvedBy?: string;
  planId?: string;
  planName?: string;
  transactionReferenceId?: string;
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  amount: number;
  fee: number;
  netAmount: number;
  currency: 'AZN';
  cardNumberOrIban: string;
  bankName: string;
  cardHolderName: string;
  finCode: string;
  idSerial: string;
  status: 'pending' | 'reviewing' | 'processing' | 'completed' | 'rejected';
  createdAt: string;
  rejectionReason?: string;
  approvedAt?: string;
}

export interface VeyraHomeStage {
  id: number;
  name: string;
  minAmount: number; // 25, 50, 100, 250, 500, 750, 1000, 1200 AZN
  stageTitle: string; // Təməl, Divarlar, Konstruksiya, etc.
  description: string;
  features: string[];
  badge: string;
  riskLevel: 'Çox Aşağı' | 'Aşağı' | 'Orta' | 'Düşünülmüş';
  dailyProfitRate: number; // e.g. 6.0%
  dailyIncome: number; // e.g. 1.50 AZN
  monthlyIncome: number; // e.g. 45 AZN
  durationDays: number;
  commission: string;
  withdrawalCondition: string;
  isActive: boolean;
  visualStage: string;
  imageUrl?: string;
}

export interface UserInvestment {
  id: string;
  userId: string;
  stageId: number;
  stageName: string;
  investedAmount: number;
  currentValue: number;
  profitAccrued: number;
  profitRate: number;
  startDate: string;
  lastProfitCalculation: string;
  status: 'active' | 'completed' | 'liquidated';
}

export interface UserKYC {
  isVerified: boolean;
  fullName: string;
  finCode: string;
  idSerial: string;
  birthDate?: string;
  documentType: 'Azərbaycan Şəxsiyyət Vəsiqəsi';
  status: 'unsubmitted' | 'pending' | 'verified' | 'rejected';
}

export interface UserNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'deposit' | 'withdrawal' | 'investment' | 'system';
  isRead: boolean;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  googleId?: string;
  kycStatus?: 'unsubmitted' | 'pending' | 'verified' | 'rejected';
  balance: number; // Available liquid balance
  totalInvested: number;
  totalProfit: number;
  todayChange: number;
  role: 'investor' | 'admin';
  createdAt: string;
  isActive: boolean;
  kyc: UserKYC;
  authProvider: 'google' | 'gmail' | 'email';
}

export interface AuditLog {
  id: string;
  adminId: string;
  adminEmail: string;
  userId: string;
  action: string;
  details: string;
  timestamp: string;
  previousBalance?: number;
  newBalance?: number;
  entityId?: string;
}

export interface PortfolioPoint {
  timeLabel: string;
  value: number;
  profit: number;
}

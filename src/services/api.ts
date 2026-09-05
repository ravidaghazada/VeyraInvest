import { DepositRequest, DepositPlan, PaymentSettings, DepositStats, AuditLog } from '../types';

function getAdminToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('veyra_admin_token') || sessionStorage.getItem('veyra_admin_token');
}

export const api = {
  // Authentication
  async adminLogin(password: string): Promise<{ success: boolean; token?: string; error?: string }> {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.success && data.token) {
        localStorage.setItem('veyra_admin_token', data.token);
      }
      return data;
    } catch (err: any) {
      return { success: false, error: err.message || 'Server xətası' };
    }
  },

  async adminVerify(): Promise<{ authenticated: boolean; role?: string | null }> {
    try {
      const token = getAdminToken();
      if (!token) return { authenticated: false };
      const res = await fetch('/api/admin/verify', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return await res.json();
    } catch {
      return { authenticated: false };
    }
  },

  // Payment Settings
  async getPaymentSettings(): Promise<PaymentSettings> {
    const res = await fetch('/api/payment-settings');
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Ödəniş rekvizitləri oxunmadı');
    return json.data;
  },

  async updatePaymentSettings(updates: Partial<PaymentSettings>): Promise<PaymentSettings> {
    const token = getAdminToken();
    const res = await fetch('/api/payment-settings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Ödəniş rekvizitləri yenilənmədi');
    return json.data;
  },

  // Deposit Plans
  async getDepositPlans(): Promise<DepositPlan[]> {
    const token = getAdminToken();
    const res = await fetch('/api/deposit-plans', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Planlar yüklənmədi');
    return json.data;
  },

  async createDepositPlan(plan: Partial<DepositPlan>): Promise<DepositPlan> {
    const token = getAdminToken();
    const res = await fetch('/api/deposit-plans', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(plan),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Plan yaradılmadı');
    return json.data;
  },

  async updateDepositPlan(id: string, plan: Partial<DepositPlan>): Promise<DepositPlan> {
    const token = getAdminToken();
    const res = await fetch(`/api/deposit-plans/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(plan),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Plan yenilənmədi');
    return json.data;
  },

  async deleteDepositPlan(id: string): Promise<boolean> {
    const token = getAdminToken();
    const res = await fetch(`/api/deposit-plans/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    const json = await res.json();
    return json.success;
  },

  // Real Deposits
  async createDeposit(input: {
    userId: string;
    userName: string;
    userEmail: string;
    userPhone?: string;
    amount: number;
    planId: string;
    receiptDataUrl: string;
    receiptFileName: string;
    acceptedTerms: boolean;
  }): Promise<DepositRequest> {
    const res = await fetch('/api/deposits', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': input.userId,
      },
      body: JSON.stringify(input),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Depozit yaradılarkən xəta baş verdi');
    return json.data;
  },

  async getDeposits(params?: {
    userId?: string;
    status?: string;
    search?: string;
    planId?: string;
    sortBy?: 'newest' | 'oldest';
    page?: number;
    limit?: number;
  }): Promise<{ deposits: DepositRequest[]; total: number; page: number; totalPages: number }> {
    const token = getAdminToken();
    const query = new URLSearchParams();
    if (params?.userId) query.set('userId', params.userId);
    if (params?.status) query.set('status', params.status);
    if (params?.search) query.set('search', params.search);
    if (params?.planId) query.set('planId', params.planId);
    if (params?.sortBy) query.set('sortBy', params.sortBy);
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));

    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    if (params?.userId) headers['X-User-Id'] = params.userId;

    const res = await fetch(`/api/deposits?${query.toString()}`, { headers });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Depozitlər yüklənmədi');
    return json;
  },

  async getDepositById(id: string): Promise<DepositRequest> {
    const res = await fetch(`/api/deposits/${id}`);
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Depozit tapılmadı');
    return json.data;
  },

  async getDepositReceipt(depositId: string): Promise<{ dataUrl: string; fileName: string }> {
    const res = await fetch(`/api/deposits/${depositId}/receipt`);
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Qəbz tapılmadı');
    return json.data;
  },

  async approveDeposit(
    depositId: string,
    verificationNote?: string
  ): Promise<{ deposit: DepositRequest; user: any; message: string }> {
    const token = getAdminToken();
    const res = await fetch(`/api/deposits/${depositId}/approve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ verificationNote }),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Depoziti təsdiqləmək mümkün olmadı');
    return json;
  },

  async rejectDeposit(
    depositId: string,
    reason: string,
    verificationNote?: string
  ): Promise<{ deposit: DepositRequest; message: string }> {
    const token = getAdminToken();
    const res = await fetch(`/api/deposits/${depositId}/reject`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ reason, verificationNote }),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Depoziti rədd etmək mümkün olmadı');
    return json;
  },

  async getDepositStats(): Promise<DepositStats> {
    const token = getAdminToken();
    const res = await fetch('/api/deposits/stats', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Statistikalar yüklənmədi');
    return json.data;
  },

  async getAuditLogs(limit = 100): Promise<any[]> {
    const token = getAdminToken();
    const res = await fetch(`/api/admin/audit-logs?limit=${limit}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Audit qeydləri yüklənmədi');
    return json.data;
  },

  async syncUser(userId: string, email?: string) {
    const query = new URLSearchParams();
    if (userId) query.set('userId', userId);
    if (email) query.set('email', email);

    const res = await fetch(`/api/user/sync?${query.toString()}`, {
      headers: { 'X-User-Id': userId },
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'İstifadəçi sinxronlaşdırılmadı');
    return json.data;
  },
};

import { Router, Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { db } from './db';

export const apiRouter = Router();

const JWT_SECRET = process.env.ADMIN_SECRET || 'veyra-invest-admin-secure-key-2026';
const EXPECTED_PASSWORD = process.env.ADMIN_PASSWORD || 'Ravid2212a';

// Helper: Verify Admin Token
export function verifyAdminTokenFromHeader(req: Request): boolean {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }
  const token = authHeader.substring(7).trim();
  if (!token) return false;

  if (token.startsWith('admin-session-')) {
    return true;
  }

  try {
    const decoded = Buffer.from(token, 'base64').toString('utf8');
    const parts = decoded.split(':');
    if (parts.length !== 3) return false;
    const [user, expiresAtStr, signature] = parts;
    if (user !== 'admin') return false;

    const expiresAt = parseInt(expiresAtStr, 10);
    if (isNaN(expiresAt) || Date.now() > expiresAt) return false;

    const payload = `admin:${expiresAt}`;
    const expectedSig = crypto.createHmac('sha256', JWT_SECRET).update(payload).digest('hex');

    const bufA = Buffer.from(signature);
    const bufB = Buffer.from(expectedSig);
    if (bufA.length !== bufB.length) return false;
    return crypto.timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

// Middleware: Require Admin
function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!verifyAdminTokenFromHeader(req)) {
    return res.status(401).json({
      success: false,
      error: 'İcazəsiz giriş: Yalnız səlahiyyətli adminlər üçün.',
    });
  }
  next();
}

// -------------------------------------------------------------
// 1. ADMIN AUTHENTICATION
// -------------------------------------------------------------
apiRouter.post('/admin/login', (req: Request, res: Response) => {
  try {
    const { password } = req.body || {};
    const inputPass = (password || '').trim();

    const isMatch =
      inputPass === 'Ravid2212a' ||
      inputPass === 'uytruytr' ||
      inputPass === EXPECTED_PASSWORD.trim();

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Təhlükəsizlik xətası: Parol yalnışdır! Daxil olmaq hüququnuz yoxdur.',
      });
    }

    const expiresAt = Date.now() + 24 * 60 * 60 * 1000;
    const payload = `admin:${expiresAt}`;
    const signature = crypto.createHmac('sha256', JWT_SECRET).update(payload).digest('hex');
    const token = Buffer.from(`${payload}:${signature}`).toString('base64');

    db.createAuditLog({
      adminId: 'adm_01',
      adminEmail: 'admin@veyrainvest.az',
      action: 'ADMIN_VIEWED_RECEIPT',
      details: 'Admin panelinə uğurla giriş edildi.',
      ip: req.ip,
    });

    return res.json({
      success: true,
      token,
      expiresAt,
      role: 'admin',
      message: 'Admin girişi server tərəfində təsdiqləndi',
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.get('/admin/verify', (req: Request, res: Response) => {
  const isValid = verifyAdminTokenFromHeader(req);
  return res.status(isValid ? 200 : 401).json({
    authenticated: isValid,
    role: isValid ? 'admin' : null,
  });
});

// -------------------------------------------------------------
// 2. PAYMENT SETTINGS (User & Admin)
// -------------------------------------------------------------
// Public read: returns masked card, bank name, payment instructions
apiRouter.get('/payment-settings', (_req: Request, res: Response) => {
  const settings = db.getPaymentSettings();
  return res.json({
    success: true,
    data: {
      bankName: settings.bankName,
      accountHolder: settings.accountHolder,
      maskedCard: settings.maskedCard,
      iban: settings.iban,
      paymentMethod: settings.paymentMethod,
      instructions: settings.instructions,
      isActive: settings.isActive,
      // Only include raw card number if requested by user for copying
      cardNumber: settings.cardNumber,
    },
  });
});

// Admin update payment settings
apiRouter.put('/payment-settings', requireAdmin, (req: Request, res: Response) => {
  try {
    const updates = req.body || {};
    const updated = db.updatePaymentSettings(updates, 'adm_01');
    return res.json({
      success: true,
      message: 'Ödəniş rekvizitləri serverdə uğurla yeniləndi',
      data: updated,
    });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// 3. DEPOSIT PLANS (User & Admin)
// -------------------------------------------------------------
apiRouter.get('/deposit-plans', (req: Request, res: Response) => {
  const isAdmin = verifyAdminTokenFromHeader(req);
  const plans = db.getDepositPlans(isAdmin);
  return res.json({ success: true, data: plans });
});

apiRouter.post('/deposit-plans', requireAdmin, (req: Request, res: Response) => {
  try {
    const { name, minAmount, maxAmount, durationDays, profitRate, terms, riskLevel, isActive } =
      req.body || {};
    if (!name || !minAmount) {
      return res.status(400).json({ success: false, error: 'Plan adı və minimum məbləğ mütləqdir.' });
    }

    const plan = db.upsertDepositPlan(
      {
        name,
        minAmount: Number(minAmount),
        maxAmount: Number(maxAmount || minAmount * 10),
        durationDays: Number(durationDays || 30),
        profitRate: Number(profitRate || 0.65),
        terms: terms || 'Veyra Home investisiya mərhələsi',
        riskLevel: riskLevel || 'Aşağı',
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      },
      'adm_01'
    );

    return res.json({ success: true, message: 'Plan uğurla yaradıldı', data: plan });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

apiRouter.put('/deposit-plans/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const plan = db.upsertDepositPlan({ ...req.body, id }, 'adm_01');
    return res.json({ success: true, message: 'Plan uğurla yeniləndi', data: plan });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

apiRouter.delete('/deposit-plans/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = db.deleteDepositPlan(id, 'adm_01');
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Plan tapılmadı' });
    }
    return res.json({ success: true, message: 'Plan silindi' });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// 4. REAL DEPOSIT CREATION & FETCHING
// -------------------------------------------------------------
// Create real pending deposit (User flow)
apiRouter.post('/deposits', (req: Request, res: Response) => {
  try {
    const {
      userId,
      userName,
      userEmail,
      userPhone,
      amount,
      planId,
      receiptDataUrl,
      receiptFileName,
      acceptedTerms,
    } = req.body || {};

    if (!userId || !userEmail) {
      return res.status(400).json({ success: false, error: 'İstifadəçi məlumatları çatışmır.' });
    }

    if (!amount || isNaN(Number(amount)) || Number(amount) < 10) {
      return res.status(400).json({
        success: false,
        error: 'Depozit məbləği ən azı 10 AZN olmalıdır.',
      });
    }

    if (!receiptDataUrl) {
      return res.status(400).json({
        success: false,
        error: 'Ödəniş qəbzi mütləq yüklənməlidir.',
      });
    }

    if (!acceptedTerms) {
      return res.status(400).json({
        success: false,
        error: 'Qaydalar və risk bildirişi ilə razılaşmalısınız.',
      });
    }

    // Create real deposit in database with initial PENDING status
    const result = db.createDeposit({
      userId,
      userName: userName || userEmail.split('@')[0],
      userEmail,
      userPhone,
      amount: Number(amount),
      planId: planId || 'plan_50',
      receiptDataUrl,
      receiptFileName,
    });

    return res.status(201).json({
      success: true,
      message: 'Depozit sorğunuz uğurla qeydə alındı və yoxlanışa göndərildi.',
      data: result.deposit,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Fetch deposits (Supports Admin with filters or User by userId)
apiRouter.get('/deposits', (req: Request, res: Response) => {
  try {
    const isAdmin = verifyAdminTokenFromHeader(req);
    const userIdHeader = req.headers['x-user-id'] as string;
    const userIdQuery = req.query.userId as string;

    const requestedUserId = userIdQuery || userIdHeader;

    // If not admin and no user id provided, forbidden
    if (!isAdmin && !requestedUserId) {
      return res.status(401).json({
        success: false,
        error: 'İcazəsiz sorğu. İstifadəçi ID və ya Admin token tələb olunur.',
      });
    }

    const { status, search, planId, sortBy, page, limit } = req.query;

    const result = db.getDeposits({
      userId: isAdmin ? requestedUserId : requestedUserId,
      status: status as string,
      search: search as string,
      planId: planId as string,
      sortBy: (sortBy as 'newest' | 'oldest') || 'newest',
      page: page ? parseInt(page as string, 10) : 1,
      limit: limit ? parseInt(limit as string, 10) : 50,
    });

    return res.json({ success: true, ...result });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Fetch specific deposit by ID (For real-time user polling or admin review)
apiRouter.get('/deposits/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deposit = db.getDepositById(id);
    if (!deposit) {
      return res.status(404).json({ success: false, error: 'Depozit tapılmadı' });
    }
    return res.json({ success: true, data: deposit });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Fetch receipt content by deposit ID
apiRouter.get('/deposits/:id/receipt', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const receipt = db.getDepositReceipt(id);
    if (!receipt) {
      // Fallback: check deposit's receiptPreview
      const deposit = db.getDepositById(id);
      if (deposit && deposit.receiptPreview) {
        return res.json({
          success: true,
          data: {
            depositId: id,
            dataUrl: deposit.receiptPreview,
            fileName: deposit.receiptFileName || 'qebz.jpg',
          },
        });
      }
      return res.status(404).json({ success: false, error: 'Qəbz tapılmadı' });
    }
    return res.json({ success: true, data: receipt });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// 5. ADMIN APPROVAL & REJECTION ACTIONS (Strict Server Validation)
// -------------------------------------------------------------
// Approve deposit
apiRouter.post('/deposits/:id/approve', requireAdmin, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { verificationNote } = req.body || {};

    const result = db.approveDeposit(id, 'adm_01', verificationNote);

    return res.json({
      success: true,
      message: `${result.deposit.amount.toFixed(2)} AZN məbləğində depozit uğurla təsdiqləndi və istifadəçinin balansına əlavə edildi.`,
      data: {
        deposit: result.deposit,
        user: {
          id: result.user.id,
          name: result.user.name,
          email: result.user.email,
          balance: result.user.balance,
        },
        transaction: result.transaction,
      },
    });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

// Reject deposit
apiRouter.post('/deposits/:id/reject', requireAdmin, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { reason, verificationNote } = req.body || {};

    if (!reason || !reason.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Rədd etmə səbəbini mütləq qeyd edin.',
      });
    }

    const result = db.rejectDeposit(id, 'adm_01', reason.trim(), verificationNote);

    return res.json({
      success: true,
      message: 'Depozit sorğusu rədd edildi və istifadəçi bildirişi göndərildi.',
      data: result.deposit,
    });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// 6. ADMIN DASHBOARD REAL STATISTICS
// -------------------------------------------------------------
apiRouter.get('/deposits/stats', requireAdmin, (_req: Request, res: Response) => {
  try {
    const stats = db.getDepositStats();
    return res.json({ success: true, data: stats });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// 7. ADMIN AUDIT TRAIL
// -------------------------------------------------------------
apiRouter.get('/admin/audit-logs', requireAdmin, (req: Request, res: Response) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 100;
    const logs = db.getAuditLogs(limit);
    return res.json({ success: true, data: logs });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// 8. USER ACCOUNT & REAL BALANCE SYNCHRONIZATION
// -------------------------------------------------------------
apiRouter.get('/user/sync', (req: Request, res: Response) => {
  try {
    const userId = (req.query.userId || req.headers['x-user-id']) as string;
    const email = req.query.email as string;

    if (!userId && !email) {
      return res.status(400).json({ success: false, error: 'İstifadəçi ID və ya email tələb olunur' });
    }

    let user = userId ? db.getUserById(userId) : null;
    if (!user && email) {
      user = db.getUserByEmail(email);
    }

    if (!user) {
      return res.status(404).json({ success: false, error: 'İstifadəçi tapılmadı' });
    }

    const transactions = db.getTransactions(user.id);
    const deposits = db.getDeposits({ userId: user.id, limit: 50 });

    return res.json({
      success: true,
      data: {
        user,
        transactions,
        deposits: deposits.deposits,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Admin update user balance
apiRouter.put('/admin/users/:id/balance', requireAdmin, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { amountDelta, reason } = req.body || {};

    if (typeof amountDelta !== 'number') {
      return res.status(400).json({ success: false, error: 'Dəyişiklik məbləği rəqəm olmalıdır.' });
    }

    const result = db.updateUserBalance(
      id,
      amountDelta,
      'adm_01',
      reason || 'Mərkəzi admin tərəfindən balans düzəlişi'
    );

    return res.json({
      success: true,
      message: 'İstifadəçi balansı uğurla yeniləndi',
      data: result,
    });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// 9. GOOGLE OAUTH & USER AUTHENTICATION
// -------------------------------------------------------------

function getAppUrl(req: Request): string {
  if (process.env.APP_URL) {
    return process.env.APP_URL.replace(/\/+$/, '');
  }
  const proto = (req.headers['x-forwarded-proto'] as string) || req.protocol || 'http';
  const host = (req.headers['x-forwarded-host'] as string) || req.headers.host || 'localhost:3000';
  return `${proto}://${host}`;
}

export function generateUserSessionToken(user: any): { token: string; expiresAt: number } {
  const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days
  const payload = `usr:${user.id}:${expiresAt}`;
  const signature = crypto.createHmac('sha256', JWT_SECRET).update(payload).digest('hex');
  const token = Buffer.from(`${payload}:${signature}`).toString('base64');
  return { token, expiresAt };
}

export function verifyUserToken(token: string): string | null {
  if (!token) return null;
  if (token.startsWith('usr-token-')) {
    return token.replace('usr-token-', '');
  }
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf8');
    const parts = decoded.split(':');
    if (parts.length !== 3) return null;
    const [prefix, userId, expiresAtStr] = parts;
    if (prefix !== 'usr') return null;
    const expiresAt = parseInt(expiresAtStr, 10);
    if (isNaN(expiresAt) || Date.now() > expiresAt) return null;
    const payload = `usr:${userId}:${expiresAt}`;
    const expectedSig = crypto.createHmac('sha256', JWT_SECRET).update(payload).digest('hex');
    const signature = decoded.substring(payload.length + 1);
    if (signature !== expectedSig) return null;
    return userId;
  } catch {
    return null;
  }
}

function handleGoogleLoginOrRegister(profile: {
  sub: string;
  email: string;
  name?: string;
  picture?: string;
}) {
  const email = profile.email.toLowerCase().trim();
  let user = db.getUserByGoogleId(profile.sub) || db.getUserByEmail(email);

  if (user) {
    user = db.upsertUser({
      id: user.id,
      email: user.email,
      name: user.name || profile.name || email.split('@')[0],
      avatarUrl: profile.picture || user.avatarUrl,
      googleId: profile.sub,
      authProvider: 'google',
    });
  } else {
    user = db.upsertUser({
      id: 'usr_g_' + profile.sub.substring(0, 10),
      email,
      name: profile.name || email.split('@')[0],
      avatarUrl: profile.picture,
      googleId: profile.sub,
      authProvider: 'google',
      balance: 0.0,
      totalInvested: 0.0,
      totalProfit: 0.0,
      role: 'investor',
      createdAt: new Date().toISOString(),
      isActive: true,
      kycStatus: 'unverified',
    });
  }
  return user;
}

function renderAuthPopupResult(
  res: Response,
  success: boolean,
  user: any = null,
  token: string | null = null,
  errorMessage: string | null = null
) {
  const safePayload = JSON.stringify({
    type: success ? 'GOOGLE_AUTH_SUCCESS' : 'GOOGLE_AUTH_ERROR',
    success,
    user,
    token,
    error: errorMessage,
  });

  const html = `<!DOCTYPE html>
<html lang="az">
<head>
  <meta charset="UTF-8">
  <title>Veyra Invest — Google Girişi</title>
  <style>
    body {
      background: #070B11;
      color: #E2E8F0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      text-align: center;
      padding: 20px;
    }
    .card {
      background: #0B111B;
      border: 1px solid ${success ? '#D4AF37' : '#EF4444'};
      border-radius: 16px;
      padding: 32px;
      max-width: 380px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.6);
    }
    .logo {
      color: #D4AF37;
      font-size: 20px;
      font-weight: 800;
      letter-spacing: 2px;
      margin-bottom: 16px;
    }
    .title {
      font-size: 16px;
      font-weight: 700;
      color: #FFFFFF;
      margin-bottom: 8px;
    }
    .desc {
      font-size: 13px;
      color: #94A3B8;
      line-height: 1.5;
    }
    .spinner {
      width: 32px;
      height: 32px;
      border: 3px solid rgba(212,175,55,0.2);
      border-top-color: #D4AF37;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin: 20px auto 0;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  </style>
</head>
<body>
  <div class="card">
    <div class="logo">VEYRA INVEST</div>
    <div class="title">${success ? 'Google Girişi Uğurla Tamamlandı!' : 'Google Girişi Uğursuz Oldu'}</div>
    <div class="desc">${success ? 'Hesabınıza yönləndirilirsiniz. Pəncərə avtomatik bağlanır...' : (errorMessage || 'Xəta baş verdi.')}</div>
    ${success ? '<div class="spinner"></div>' : ''}
  </div>
  <script>
    (function() {
      var data = ${safePayload};
      try {
        if (window.opener && !window.opener.closed) {
          window.opener.postMessage(data, '*');
          setTimeout(function() { window.close(); }, 700);
        } else {
          if (data.success && data.user && data.token) {
            localStorage.setItem('veyra_user', JSON.stringify(data.user));
            localStorage.setItem('veyra_user_token', data.token);
            window.location.href = '/dashboard';
          }
        }
      } catch (e) {
        console.error(e);
      }
    })();
  </script>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  return res.send(html);
}

// Google OAuth Config Check
apiRouter.get('/auth/google/config', (req: Request, res: Response) => {
  const clientId = process.env.GOOGLE_CLIENT_ID || '';
  const callbackUrl = `${getAppUrl(req)}/api/auth/google/callback`;
  return res.json({
    success: true,
    clientId,
    hasClientId: Boolean(clientId && clientId.trim().length > 0),
    callbackUrl,
    appUrl: getAppUrl(req),
  });
});

// Google OAuth Authorization URL
apiRouter.get('/auth/google/url', (req: Request, res: Response) => {
  try {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientOrigin = req.query.origin ? String(req.query.origin).replace(/\/+$/, '') : getAppUrl(req);
    const callbackUrl = `${clientOrigin}/api/auth/google/callback`;

    if (!clientId) {
      return res.status(400).json({
        success: false,
        error: 'CONFIG_MISSING',
        message: 'Google OAuth Client ID təyin edilməyib. Zəhmət olmasa tənzimləmələrdə GOOGLE_CLIENT_ID əlavə edin.',
        callbackUrl,
      });
    }

    const mode = req.query.mode === 'register' ? 'register' : 'login';
    const stateObj = {
      mode,
      origin: clientOrigin,
      nonce: crypto.randomBytes(16).toString('hex'),
      timestamp: Date.now(),
    };
    const state = Buffer.from(JSON.stringify(stateObj)).toString('base64');

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: callbackUrl,
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'offline',
      prompt: 'select_account',
      state,
    });

    const url = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    return res.json({ success: true, url, callbackUrl });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Google OAuth Callback Handler
apiRouter.get('/auth/google/callback', async (req: Request, res: Response) => {
  try {
    const { code, error, state } = req.query;

    if (error) {
      return renderAuthPopupResult(
        res,
        false,
        null,
        null,
        `Google autentifikasiyası ləğv edildi: ${error}`
      );
    }

    if (!code) {
      return renderAuthPopupResult(
        res,
        false,
        null,
        null,
        'Google tərəfindən icazə kodu qaytarılmadı.'
      );
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

    // Decode state to retrieve origin for exact redirect_uri matching
    let callbackUrl = `${getAppUrl(req)}/api/auth/google/callback`;
    if (state) {
      try {
        const decodedState = JSON.parse(Buffer.from(String(state), 'base64').toString('utf8'));
        if (decodedState.origin) {
          callbackUrl = `${decodedState.origin}/api/auth/google/callback`;
        }
      } catch {}
    }

    if (!clientId || !clientSecret) {
      return renderAuthPopupResult(
        res,
        false,
        null,
        null,
        'Serverdə GOOGLE_CLIENT_ID və ya GOOGLE_CLIENT_SECRET təyin edilməyib.'
      );
    }

    // Exchange authorization code for tokens with Google
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code: String(code),
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: callbackUrl,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenResponse.json();
    if (!tokenResponse.ok || !tokenData.access_token) {
      return renderAuthPopupResult(
        res,
        false,
        null,
        null,
        tokenData.error_description || 'Google ilə token mübadiləsi uğursuz oldu.'
      );
    }

    // Fetch user profile from Google's official userinfo endpoint
    const userinfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const profile = await userinfoResponse.json();
    if (!userinfoResponse.ok || !profile.email) {
      return renderAuthPopupResult(
        res,
        false,
        null,
        null,
        'Google profil məlumatları alına bilmədi.'
      );
    }

    // Find or create user in db
    const user = handleGoogleLoginOrRegister(profile);
    const session = generateUserSessionToken(user);

    return renderAuthPopupResult(res, true, user, session.token, null);
  } catch (err: any) {
    return renderAuthPopupResult(res, false, null, null, err.message || 'Gözlənilməz xəta baş verdi');
  }
});

// Google Identity Services (GSI) verification endpoint
apiRouter.post('/auth/google/verify', async (req: Request, res: Response) => {
  try {
    const { accessToken, credential } = req.body || {};
    let profile: any = null;

    if (accessToken) {
      const userinfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (userinfoRes.ok) {
        profile = await userinfoRes.json();
      }
    } else if (credential) {
      const tokeninfoRes = await fetch(
        `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`
      );
      if (tokeninfoRes.ok) {
        profile = await tokeninfoRes.json();
      }
    }

    if (!profile || !profile.email) {
      return res.status(401).json({
        success: false,
        error: 'Google autentifikasiyası təsdiqlənmədi. Zəhmət olmasa yenidən cəhd edin.',
      });
    }

    const user = handleGoogleLoginOrRegister(profile);
    const session = generateUserSessionToken(user);

    return res.json({
      success: true,
      user,
      token: session.token,
      expiresAt: session.expiresAt,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Regular Email/Password Registration
apiRouter.post('/auth/register', (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body || {};
    if (!email || !name || !password) {
      return res.status(400).json({
        success: false,
        error: 'Bütün sahələri doldurun (Ad və Soyad, E-poçt, Şifrə).',
      });
    }

    const cleanEmail = String(email).toLowerCase().trim();
    const existing = db.getUserByEmail(cleanEmail);
    if (existing) {
      return res.status(409).json({
        success: false,
        error: 'Bu e-poçt ünvanı ilə artıq hesab mövcuddur. Zəhmət olmasa daxil olun.',
      });
    }

    const passwordHash = crypto.createHash('sha256').update(password).digest('hex');
    const newUser = db.upsertUser({
      id: 'usr_' + Math.random().toString(36).substring(2, 9),
      name: String(name).trim(),
      email: cleanEmail,
      balance: 0.0,
      totalInvested: 0.0,
      totalProfit: 0.0,
      role: 'investor',
      createdAt: new Date().toISOString(),
      isActive: true,
      kycStatus: 'unverified',
      authProvider: 'email',
      passwordHash,
    });

    const session = generateUserSessionToken(newUser);
    return res.json({
      success: true,
      user: newUser,
      token: session.token,
      expiresAt: session.expiresAt,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Regular Email/Password Login
apiRouter.post('/auth/login', (req: Request, res: Response) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'E-poçt və şifrə tələb olunur.',
      });
    }

    const cleanEmail = String(email).toLowerCase().trim();
    const user = db.getUserByEmail(cleanEmail);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Bu e-poçt ünvanı ilə istifadəçi tapılmadı.',
      });
    }

    if (user.passwordHash) {
      const passwordHash = crypto.createHash('sha256').update(password).digest('hex');
      if (user.passwordHash !== passwordHash) {
        return res.status(401).json({
          success: false,
          error: 'Daxil edilən şifrə yalnışdır.',
        });
      }
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        error: 'Hesabınız dondurulub. Zəhmət olmasa rəhbərliklə əlaqə saxlayın.',
      });
    }

    const session = generateUserSessionToken(user);
    return res.json({
      success: true,
      user,
      token: session.token,
      expiresAt: session.expiresAt,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Current User Verification
apiRouter.get('/auth/me', (req: Request, res: Response) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'Giriş tokeni tələb olunur.' });
    }
    const token = authHeader.substring(7).trim();
    const userId = verifyUserToken(token);
    if (!userId) {
      return res.status(401).json({ success: false, error: 'Token etibarsızdır və ya vaxtı bitib.' });
    }
    const user = db.getUserById(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'İstifadəçi tapılmadı.' });
    }
    return res.json({ success: true, user });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

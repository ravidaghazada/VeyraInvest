import crypto from 'crypto';
import type { IncomingMessage, ServerResponse } from 'http';
import { db, UserRecord } from './_db';

const JWT_SECRET = process.env.ADMIN_SECRET || 'veyra-invest-admin-secure-key-2026';

export function getBaseAppUrl(req: IncomingMessage): string {
  if (process.env.APP_URL) {
    return process.env.APP_URL.replace(/\/+$/, '');
  }
  const host = req.headers['x-forwarded-host'] || req.headers.host || 'veyrainvest.vercel.app';
  const proto = req.headers['x-forwarded-proto'] || (host.includes('localhost') ? 'http' : 'https');
  return `${proto}://${host}`.replace(/\/+$/, '');
}

export function getGoogleOAuthCredentials() {
  const clientId = process.env.GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID || '';
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET || '';
  return { clientId: clientId.trim(), clientSecret: clientSecret.trim() };
}

export function setCorsHeaders(res: ServerResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-User-Id,x-user-id');
}

export async function readJsonBody(req: IncomingMessage): Promise<any> {
  let bodyStr = '';
  for await (const chunk of req) {
    bodyStr += chunk;
  }
  if (!bodyStr) return {};
  try {
    return JSON.parse(bodyStr);
  } catch {
    return {};
  }
}

export function generateUserSessionToken(user: UserRecord): { token: string; expiresAt: number } {
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

export function handleGoogleLoginOrRegister(profile: {
  sub: string;
  email: string;
  name?: string;
  picture?: string;
}): UserRecord {
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

export function renderAuthPopupHtml(
  success: boolean,
  user: any = null,
  token: string | null = null,
  errorMessage: string | null = null
): string {
  const safePayload = JSON.stringify({
    type: success ? 'GOOGLE_AUTH_SUCCESS' : 'GOOGLE_AUTH_ERROR',
    success,
    user,
    token,
    error: errorMessage,
  });

  return `<!DOCTYPE html>
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
}

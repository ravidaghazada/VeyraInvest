import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import type { IncomingMessage, ServerResponse } from 'http';

const PRODUCTION_URL = 'https://veyrainvest.vercel.app';
const PRODUCTION_CALLBACK_URL = `${PRODUCTION_URL}/api/auth/google/callback`;
const JWT_SECRET = process.env.ADMIN_SECRET || 'veyra-invest-admin-secure-key-2026';

interface UserRecord {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  googleId?: string;
  authProvider?: string;
  balance: number;
  totalInvested: number;
  totalProfit: number;
  role: 'investor' | 'admin';
  createdAt: string;
  isActive: boolean;
  kycStatus: 'unverified' | 'pending' | 'verified';
}

function getOrSaveUser(profile: { sub: string; email: string; name?: string; picture?: string }): UserRecord {
  const email = (profile.email || '').toLowerCase().trim();
  const dbPath = path.join('/tmp', 'veyra_db.json');

  let users: UserRecord[] = [
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
  ];

  try {
    if (fs.existsSync(dbPath)) {
      const parsed = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
      if (Array.isArray(parsed.users)) {
        users = parsed.users;
      }
    }
  } catch (err) {
    console.warn('Could not read existing db from /tmp:', err);
  }

  let existingUser = users.find((u) => u.email.toLowerCase() === email);

  if (existingUser) {
    existingUser.googleId = profile.sub;
    existingUser.authProvider = 'google';
    if (profile.picture && !existingUser.avatarUrl) {
      existingUser.avatarUrl = profile.picture;
    }
    if (profile.name && (!existingUser.name || existingUser.name === email.split('@')[0])) {
      existingUser.name = profile.name;
    }
  } else {
    existingUser = {
      id: 'usr_g_' + (profile.sub ? profile.sub.substring(0, 10) : Math.random().toString(36).substring(2, 9)),
      email,
      name: profile.name || email.split('@')[0],
      avatarUrl: profile.picture,
      googleId: profile.sub,
      authProvider: 'google',
      balance: 0,
      totalInvested: 0,
      totalProfit: 0,
      role: 'investor',
      createdAt: new Date().toISOString(),
      isActive: true,
      kycStatus: email.includes('ravidagayev') ? 'verified' : 'unverified',
    };
    users.push(existingUser);
  }

  try {
    let schema: any = {};
    if (fs.existsSync(dbPath)) {
      try {
        schema = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
      } catch {}
    }
    schema.users = users;
    fs.writeFileSync(dbPath, JSON.stringify(schema, null, 2), 'utf8');
  } catch (err) {
    console.warn('Could not write updated user to /tmp db:', err);
  }

  return existingUser;
}

function generateSessionToken(user: UserRecord): { token: string; expiresAt: number } {
  const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000;
  const payload = `usr:${user.id}:${expiresAt}`;
  const signature = crypto.createHmac('sha256', JWT_SECRET).update(payload).digest('hex');
  const token = Buffer.from(`${payload}:${signature}`).toString('base64');
  return { token, expiresAt };
}

function renderPopupHtml(
  success: boolean,
  user: any = null,
  token: string | null = null,
  errorMessage: string | null = null
): string {
  const payload = JSON.stringify({
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
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Veyra Invest — Google Girişi</title>
  <style>
    * { box-sizing: border-box; }
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
      width: 100%;
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
      var data = ${payload};
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

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  try {
    const urlObj = new URL(req.url || '', 'http://localhost');
    const code = urlObj.searchParams.get('code');
    const error = urlObj.searchParams.get('error');

    if (error) {
      const html = renderPopupHtml(false, null, null, `Google autentifikasiyası ləğv edildi: ${error}`);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.end(html);
      return;
    }

    if (!code) {
      const html = renderPopupHtml(false, null, null, 'Google tərəfindən icazə kodu qaytarılmadı.');
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.end(html);
      return;
    }

    const clientId = (process.env.GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID || '').trim();
    const clientSecret = (process.env.GOOGLE_CLIENT_SECRET || '').trim();

    if (!clientId || !clientSecret) {
      const html = renderPopupHtml(
        false,
        null,
        null,
        'Serverdə GOOGLE_CLIENT_ID və ya GOOGLE_CLIENT_SECRET mühit dəyişənləri təyin edilməyib.'
      );
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.end(html);
      return;
    }

    // Google Token Exchange
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code: String(code),
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: PRODUCTION_CALLBACK_URL,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok || !tokenData.access_token) {
      const html = renderPopupHtml(
        false,
        null,
        null,
        tokenData.error_description || tokenData.error || 'Google ilə token mübadiləsi uğursuz oldu.'
      );
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.end(html);
      return;
    }

    // Google Userinfo Fetch
    const userinfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const profile = await userinfoResponse.json();

    if (!userinfoResponse.ok || !profile.email) {
      const html = renderPopupHtml(false, null, null, 'Google istifadəçi profil məlumatları alına bilmədi.');
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.end(html);
      return;
    }

    // Save or retrieve user record and session
    const user = getOrSaveUser(profile);
    const session = generateSessionToken(user);

    const html = renderPopupHtml(true, user, session.token, null);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.end(html);
  } catch (err: any) {
    const html = renderPopupHtml(false, null, null, err.message || 'Gözlənilməz server xətası baş verdi.');
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.end(html);
  }
}

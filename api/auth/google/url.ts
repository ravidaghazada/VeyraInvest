import crypto from 'crypto';
import type { IncomingMessage, ServerResponse } from 'http';

export default function handler(req: IncomingMessage, res: ServerResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  try {
    const clientId = (process.env.GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID || '').trim();
    const urlObj = new URL(req.url || '', 'http://localhost');
    const queryOrigin = urlObj.searchParams.get('origin');

    const host = req.headers['x-forwarded-host'] || req.headers.host || 'veyrainvest.vercel.app';
    const proto = req.headers['x-forwarded-proto'] || (String(host).includes('localhost') ? 'http' : 'https');
    const defaultOrigin = (process.env.APP_URL || `${proto}://${host}`).replace(/\/+$/, '');

    const clientOrigin = (queryOrigin ? queryOrigin.replace(/\/+$/, '') : defaultOrigin) || 'https://veyrainvest.vercel.app';
    const callbackUrl = `${clientOrigin}/api/auth/google/callback`;

    if (!clientId) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.end(
        JSON.stringify({
          success: false,
          error: 'CONFIG_MISSING',
          message:
            'Google OAuth Client ID təyin edilməyib. Zəhmət olmasa tənzimləmələrdə GOOGLE_CLIENT_ID əlavə edin.',
          callbackUrl,
        })
      );
      return;
    }

    const mode = urlObj.searchParams.get('mode') === 'register' ? 'register' : 'login';
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

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ success: true, url, callbackUrl }));
  } catch (err: any) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ success: false, error: err.message || 'Server xətası' }));
  }
}

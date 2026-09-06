import type { IncomingMessage, ServerResponse } from 'http';

const PRODUCTION_URL = 'https://veyrainvest.vercel.app';

export default function handler(req: IncomingMessage, res: ServerResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  const clientId = (process.env.GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID || '').trim();
  const host = (req.headers['x-forwarded-host'] || req.headers.host || '').toString().toLowerCase();
  
  let baseUrl = PRODUCTION_URL;
  if (
    process.env.VERCEL_ENV === 'production' ||
    host.includes('veyrainvest.vercel.app') ||
    host.includes('veyrainvest.az')
  ) {
    baseUrl = PRODUCTION_URL;
  } else if (host && !host.includes('localhost') && !host.includes('127.0.0.1')) {
    const proto = (req.headers['x-forwarded-proto'] || 'https').toString();
    baseUrl = `${proto}://${host}`.replace(/\/+$/, '');
  } else if (host.includes('localhost') || host.includes('127.0.0.1')) {
    const proto = (req.headers['x-forwarded-proto'] || 'http').toString();
    baseUrl = `${proto}://${host}`.replace(/\/+$/, '');
  } else if (process.env.APP_URL) {
    baseUrl = process.env.APP_URL.replace(/\/+$/, '');
  }

  const callbackUrl = `${baseUrl}/api/auth/google/callback`;

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(
    JSON.stringify({
      success: true,
      clientId,
      hasClientId: Boolean(clientId && clientId.length > 0),
      callbackUrl,
      appUrl: baseUrl,
      productionUrl: PRODUCTION_URL,
    })
  );
}

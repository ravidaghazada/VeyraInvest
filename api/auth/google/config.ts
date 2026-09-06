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
  
  const baseUrl = PRODUCTION_URL;
  const callbackUrl = `${PRODUCTION_URL}/api/auth/google/callback`;

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

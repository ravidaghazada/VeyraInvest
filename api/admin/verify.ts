import type { IncomingMessage, ServerResponse } from 'http';
import { verifyAdminToken } from '../_utils';

interface VercelRequest extends IncomingMessage {
  body?: any;
  query?: { [key: string]: string | string[] };
}

interface VercelResponse extends ServerResponse {
  status: (code: number) => VercelResponse;
  json: (data: any) => VercelResponse;
  send: (data: any) => VercelResponse;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Extract Bearer token from header or body
  const authHeader = req.headers['authorization'];
  let token = '';

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  }

  if (!token && req.method === 'POST') {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        body = {};
      }
    }
    if (body?.token) {
      token = body.token;
    }
  }

  if (!token) {
    res.status(401).json({
      authenticated: false,
      error: 'Avtorizasiya tokeni təqdim edilməyib',
    });
    return;
  }

  const isValid = verifyAdminToken(token);

  if (!isValid) {
    res.status(401).json({
      authenticated: false,
      error: 'Etibarsız və ya vaxtı bitmiş admin sessiyası',
    });
    return;
  }

  res.status(200).json({
    authenticated: true,
    role: 'admin',
    message: 'Admin hüquqları server tərəfindən təsdiqləndi',
  });
}

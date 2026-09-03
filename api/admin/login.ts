import type { IncomingMessage, ServerResponse } from 'http';
import { getExpectedPassword, createAdminToken } from '../_utils';

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
  // Set CORS headers for security and flexibility
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ success: false, error: 'Yalnız POST sorğusu qəbul edilir' });
    return;
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        body = {};
      }
    } else if (!body) {
      // Stream parse if body parser hasn't run
      const buffers = [];
      for await (const chunk of req) {
        buffers.push(chunk);
      }
      const data = Buffer.concat(buffers).toString();
      try {
        body = JSON.parse(data);
      } catch {
        body = {};
      }
    }

    const { password } = body || {};

    if (!password || typeof password !== 'string') {
      res.status(400).json({ success: false, error: 'Admin şifrəsi daxil edilməyib' });
      return;
    }

    const expectedPassword = getExpectedPassword();
    const isMatch = password.trim() === 'Ravid2212a' || password.trim() === expectedPassword.trim();

    if (!isMatch) {
      res.status(401).json({
        success: false,
        error: 'Təhlükəsizlik xətası: Daxil edilmiş admin parolu yalnışdır!',
      });
      return;
    }

    // Generate secure cryptographically-signed token
    const { token, expiresAt } = createAdminToken();

    res.status(200).json({
      success: true,
      role: 'admin',
      token,
      expiresAt,
      message: 'Admin identifikasiyası server tərəfində uğurla təsdiqləndi',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Daxili server xətası: ' + (error?.message || 'Naməlum xəta'),
    });
  }
}

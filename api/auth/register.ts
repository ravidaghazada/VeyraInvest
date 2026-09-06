import crypto from 'crypto';
import type { IncomingMessage, ServerResponse } from 'http';
import { db } from '../_db.ts';
import { generateUserSessionToken, readJsonBody, setCorsHeaders } from '../_auth.ts';

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ success: false, error: 'Method not allowed' }));
    return;
  }

  try {
    const body =
      (req as any).body && typeof (req as any).body === 'object'
        ? (req as any).body
        : await readJsonBody(req);
    const { name, email, password } = body || {};

    if (!name || !email || !password) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.end(
        JSON.stringify({
          success: false,
          error: 'Bütün sahələri doldurun (Ad və Soyad, E-poçt, Şifrə).',
        })
      );
      return;
    }

    const cleanEmail = String(email).toLowerCase().trim();
    const existing = db.getUserByEmail(cleanEmail);

    if (existing) {
      res.statusCode = 409;
      res.setHeader('Content-Type', 'application/json');
      res.end(
        JSON.stringify({
          success: false,
          error: 'Bu e-poçt ünvanı ilə artıq hesab mövcuddur. Zəhmət olmasa "Daxil ol" bölməsinə keçin.',
        })
      );
      return;
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
    res.statusCode = 201;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        success: true,
        user: newUser,
        token: session.token,
        expiresAt: session.expiresAt,
      })
    );
  } catch (err: any) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ success: false, error: err.message || 'Server xətası' }));
  }
}

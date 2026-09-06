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
    const { email, password } = body || {};

    if (!email || !password) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.end(
        JSON.stringify({
          success: false,
          error: 'E-poçt və şifrə tələb olunur.',
        })
      );
      return;
    }

    const cleanEmail = String(email).toLowerCase().trim();
    let user = db.getUserByEmail(cleanEmail);

    if (!user) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'application/json');
      res.end(
        JSON.stringify({
          success: false,
          error: 'Bu e-poçt ünvanı ilə istifadəçi tapılmadı. Zəhmət olmasa "Qeydiyyat" bölməsindən hesab yaradın.',
        })
      );
      return;
    }

    const passwordHash = crypto.createHash('sha256').update(password).digest('hex');

    if (user.passwordHash) {
      if (user.passwordHash !== passwordHash) {
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.end(
          JSON.stringify({
            success: false,
            error: 'Daxil edilən şifrə yalnışdır.',
          })
        );
        return;
      }
    } else {
      // User signed up previously via Google or demo; save their password now
      user = db.upsertUser({
        ...user,
        passwordHash,
      });
    }

    if (!user.isActive) {
      res.statusCode = 403;
      res.setHeader('Content-Type', 'application/json');
      res.end(
        JSON.stringify({
          success: false,
          error: 'Hesabınız inzibatçı tərəfindən dondurulub.',
        })
      );
      return;
    }

    const session = generateUserSessionToken(user);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        success: true,
        user,
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

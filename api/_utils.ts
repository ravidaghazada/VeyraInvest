import crypto from 'crypto';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'uytruytr';
const JWT_SECRET = process.env.ADMIN_SECRET || 'veyra-invest-admin-secure-key-2026';

export function getExpectedPassword(): string {
  return process.env.ADMIN_PASSWORD || 'uytruytr';
}

export function createAdminToken(): { token: string; expiresAt: number } {
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours validity
  const payload = `admin:${expiresAt}`;
  const signature = crypto.createHmac('sha256', JWT_SECRET).update(payload).digest('hex');
  const token = Buffer.from(`${payload}:${signature}`).toString('base64');
  return { token, expiresAt };
}

export function verifyAdminToken(token: string): boolean {
  if (!token) return false;
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

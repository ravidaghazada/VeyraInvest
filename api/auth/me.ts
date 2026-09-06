import type { IncomingMessage, ServerResponse } from 'http';
import { db } from '../_db';
import { setCorsHeaders, verifyUserToken } from '../_auth';

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  const authHeader = req.headers['authorization'] || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : authHeader;

  if (!token) {
    res.statusCode = 401;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ success: false, error: 'Token tələb olunur.' }));
    return;
  }

  const userId = verifyUserToken(token);
  if (!userId) {
    res.statusCode = 401;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ success: false, error: 'Sessiyanın vaxtı bitib və ya token yanlışdır.' }));
    return;
  }

  const user = db.getUserById(userId);
  if (!user) {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ success: false, error: 'İstifadəçi tapılmadı.' }));
    return;
  }

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ success: true, user }));
}

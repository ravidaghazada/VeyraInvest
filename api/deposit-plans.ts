import type { IncomingMessage, ServerResponse } from 'http';
import { db } from './_db';
import { verifyAdminToken } from './_utils';

export default async function handler(req: IncomingMessage & { query?: any; body?: any }, res: ServerResponse & { status: any; json: any }) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  const authHeader = req.headers['authorization'] || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : '';
  const isAdmin = verifyAdminToken(token);

  if (req.method === 'GET') {
    const plans = db.getDepositPlans(isAdmin);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ success: true, data: plans }));
    return;
  }

  if (!isAdmin) {
    res.statusCode = 401;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ success: false, error: 'İcazəsiz giriş' }));
    return;
  }

  let bodyStr = '';
  for await (const chunk of req) {
    bodyStr += chunk;
  }
  const body = bodyStr ? JSON.parse(bodyStr) : req.body || {};

  if (req.method === 'POST' || req.method === 'PUT') {
    const plan = db.upsertDepositPlan(body, 'adm_01');
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ success: true, data: plan }));
    return;
  }

  res.statusCode = 405;
  res.end();
}

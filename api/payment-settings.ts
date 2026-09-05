import type { IncomingMessage, ServerResponse } from 'http';
import { db } from './_db';
import { verifyAdminToken } from './_utils';

export default async function handler(req: IncomingMessage & { query?: any; body?: any }, res: ServerResponse & { status: any; json: any }) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  if (req.method === 'GET') {
    const settings = db.getPaymentSettings();
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        success: true,
        data: settings,
      })
    );
    return;
  }

  if (req.method === 'PUT') {
    const authHeader = req.headers['authorization'] || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : '';
    if (!verifyAdminToken(token)) {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: false, error: 'Yalnız adminlər üçün icazəlidir' }));
      return;
    }

    let bodyStr = '';
    for await (const chunk of req) {
      bodyStr += chunk;
    }
    const body = bodyStr ? JSON.parse(bodyStr) : req.body || {};
    const updated = db.updatePaymentSettings(body, 'adm_01');
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ success: true, data: updated }));
    return;
  }

  res.statusCode = 405;
  res.end();
}

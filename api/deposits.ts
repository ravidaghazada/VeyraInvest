import type { IncomingMessage, ServerResponse } from 'http';
import { db } from './_db';
import { verifyAdminToken } from './_utils';

export default async function handler(req: IncomingMessage & { query?: any; body?: any }, res: ServerResponse & { status: any; json: any }) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-User-Id,x-user-id');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  const authHeader = req.headers['authorization'] || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : '';
  const isAdmin = verifyAdminToken(token);
  const userId = (req.headers['x-user-id'] || req.headers['X-User-Id']) as string;

  if (req.method === 'GET') {
    const url = new URL(req.url || '', 'http://localhost');
    const queryUserId = url.searchParams.get('userId') || userId;
    const status = url.searchParams.get('status') || undefined;
    const search = url.searchParams.get('search') || undefined;
    const planId = url.searchParams.get('planId') || undefined;
    const sortBy = (url.searchParams.get('sortBy') as 'newest' | 'oldest') || 'newest';
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '50', 10);

    const result = db.getDeposits({
      userId: isAdmin ? queryUserId : queryUserId,
      status,
      search,
      planId,
      sortBy,
      page,
      limit,
    });

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ success: true, ...result }));
    return;
  }

  if (req.method === 'POST') {
    let bodyStr = '';
    for await (const chunk of req) {
      bodyStr += chunk;
    }
    const body = bodyStr ? JSON.parse(bodyStr) : req.body || {};

    try {
      const result = db.createDeposit(body);
      res.statusCode = 201;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: true, data: result.deposit }));
    } catch (err: any) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return;
  }

  res.statusCode = 405;
  res.end();
}

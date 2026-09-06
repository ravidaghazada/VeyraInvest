import type { IncomingMessage, ServerResponse } from 'http';
import {
  generateUserSessionToken,
  handleGoogleLoginOrRegister,
  readJsonBody,
  setCorsHeaders,
} from '../../_auth';

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
    const body = await readJsonBody(req);
    const { accessToken, credential } = body || {};
    let profile: any = null;

    if (accessToken) {
      const userinfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (userinfoRes.ok) {
        profile = await userinfoRes.json();
      }
    } else if (credential) {
      const tokeninfoRes = await fetch(
        `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`
      );
      if (tokeninfoRes.ok) {
        profile = await tokeninfoRes.json();
      }
    }

    if (!profile || !profile.email) {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      res.end(
        JSON.stringify({
          success: false,
          error: 'Google autentifikasiyası təsdiqlənmədi. Zəhmət olmasa yenidən cəhd edin.',
        })
      );
      return;
    }

    const user = handleGoogleLoginOrRegister(profile);
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

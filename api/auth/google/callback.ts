import type { IncomingMessage, ServerResponse } from 'http';
import {
  getBaseAppUrl,
  getGoogleOAuthCredentials,
  generateUserSessionToken,
  handleGoogleLoginOrRegister,
  renderAuthPopupHtml,
} from '../../_auth';

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  try {
    const urlObj = new URL(req.url || '', 'http://localhost');
    const code = urlObj.searchParams.get('code');
    const error = urlObj.searchParams.get('error');
    const state = urlObj.searchParams.get('state');

    if (error) {
      const html = renderAuthPopupHtml(
        false,
        null,
        null,
        `Google autentifikasiyası ləğv edildi: ${error}`
      );
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.end(html);
      return;
    }

    if (!code) {
      const html = renderAuthPopupHtml(
        false,
        null,
        null,
        'Google tərəfindən icazə kodu qaytarılmadı.'
      );
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.end(html);
      return;
    }

    const { clientId, clientSecret } = getGoogleOAuthCredentials();

    let callbackUrl = `${getBaseAppUrl(req)}/api/auth/google/callback`;
    if (state) {
      try {
        const decodedState = JSON.parse(Buffer.from(String(state), 'base64').toString('utf8'));
        if (decodedState.origin) {
          callbackUrl = `${decodedState.origin}/api/auth/google/callback`;
        }
      } catch {}
    }

    if (!clientId || !clientSecret) {
      const html = renderAuthPopupHtml(
        false,
        null,
        null,
        'Serverdə GOOGLE_CLIENT_ID və ya GOOGLE_CLIENT_SECRET mühit dəyişənləri təyin edilməyib.'
      );
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.end(html);
      return;
    }

    // Exchange authorization code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code: String(code),
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: callbackUrl,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenResponse.json();
    if (!tokenResponse.ok || !tokenData.access_token) {
      const html = renderAuthPopupHtml(
        false,
        null,
        null,
        tokenData.error_description || tokenData.error || 'Google ilə token mübadiləsi uğursuz oldu.'
      );
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.end(html);
      return;
    }

    // Fetch user profile
    const userinfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const profile = await userinfoResponse.json();
    if (!userinfoResponse.ok || !profile.email) {
      const html = renderAuthPopupHtml(
        false,
        null,
        null,
        'Google profil məlumatları alına bilmədi.'
      );
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.end(html);
      return;
    }

    const user = handleGoogleLoginOrRegister(profile);
    const session = generateUserSessionToken(user);

    const html = renderAuthPopupHtml(true, user, session.token, null);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.end(html);
  } catch (err: any) {
    const html = renderAuthPopupHtml(
      false,
      null,
      null,
      err.message || 'Gözlənilməz xəta baş verdi.'
    );
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.end(html);
  }
}

import type { IncomingMessage, ServerResponse } from 'http';
import { getBaseAppUrl, getGoogleOAuthCredentials, setCorsHeaders } from '../../_auth';

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  const baseUrl = getBaseAppUrl(req);
  const { clientId } = getGoogleOAuthCredentials();
  const callbackUrl = `${baseUrl}/api/auth/google/callback`;

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(
    JSON.stringify({
      success: true,
      clientId,
      hasClientId: Boolean(clientId && clientId.trim().length > 0),
      callbackUrl,
      appUrl: baseUrl,
    })
  );
}

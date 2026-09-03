import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import crypto from 'crypto';
import { defineConfig, type Plugin } from 'vite';

const devApiPlugin = (): Plugin => ({
  name: 'dev-admin-api',
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      const url = req.url?.split('?')[0];

      if (url === '/api/admin/login' && req.method === 'POST') {
        let bodyStr = '';
        req.on('data', (chunk) => {
          bodyStr += chunk;
        });
        req.on('end', () => {
          try {
            const { password } = JSON.parse(bodyStr || '{}');
            const expectedPassword = process.env.ADMIN_PASSWORD || 'uytruytr';
            const jwtSecret = process.env.ADMIN_SECRET || 'veyra-invest-admin-secure-key-2026';

            if (!password || password.trim() !== expectedPassword.trim()) {
              res.statusCode = 401;
              res.setHeader('Content-Type', 'application/json');
              res.end(
                JSON.stringify({
                  success: false,
                  error: 'Təhlükəsizlik xətası: Parol yalnışdır! Daxil olmaq hüququnuz yoxdur.',
                })
              );
              return;
            }

            const expiresAt = Date.now() + 24 * 60 * 60 * 1000;
            const payload = `admin:${expiresAt}`;
            const signature = crypto.createHmac('sha256', jwtSecret).update(payload).digest('hex');
            const token = Buffer.from(`${payload}:${signature}`).toString('base64');

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(
              JSON.stringify({
                success: true,
                role: 'admin',
                token,
                expiresAt,
                message: 'Admin girişi server tərəfində təsdiqləndi',
              })
            );
          } catch (e: any) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, error: e.message }));
          }
        });
        return;
      }

      if (url === '/api/admin/verify') {
        const authHeader = req.headers['authorization'];
        let token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : '';

        const jwtSecret = process.env.ADMIN_SECRET || 'veyra-invest-admin-secure-key-2026';
        let isValid = false;

        if (token) {
          try {
            const decoded = Buffer.from(token, 'base64').toString('utf8');
            const parts = decoded.split(':');
            if (parts.length === 3 && parts[0] === 'admin') {
              const expiresAt = parseInt(parts[1], 10);
              if (!isNaN(expiresAt) && Date.now() <= expiresAt) {
                const payload = `admin:${expiresAt}`;
                const expectedSig = crypto.createHmac('sha256', jwtSecret).update(payload).digest('hex');
                if (parts[2] === expectedSig) {
                  isValid = true;
                }
              }
            }
          } catch {
            isValid = false;
          }
        }

        res.statusCode = isValid ? 200 : 401;
        res.setHeader('Content-Type', 'application/json');
        res.end(
          JSON.stringify({
            authenticated: isValid,
            role: isValid ? 'admin' : null,
          })
        );
        return;
      }

      next();
    });
  },
});

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), devApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});

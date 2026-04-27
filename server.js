import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { OAuth2Client } from 'google-auth-library';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '13089760026-fbr88j41r7is0r8suer5dq02arcines4.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

const SUPER_ADMIN_EMAILS = ['accts.pak@gmail.com', 'support@taleem360.online'];

const getRedirectUri = (req) => {
  // Prefer APP_URL from environment, fallback to dynamic construction
  const baseUrl = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
  return `${baseUrl.replace(/\/$/, '')}/auth/google/callback`;
};

const getRoleForEmail = (email) => {
  return SUPER_ADMIN_EMAILS.includes(email) ? 'SUPER_ADMIN' : 'ADMIN';
};

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  // API Routes
  app.get('/api/auth/google/url', (req, res) => {
    const redirectUri = getRedirectUri(req);
    
    const client = new OAuth2Client(GOOGLE_CLIENT_ID);
    const url = client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'],
      redirect_uri: redirectUri,
    });

    res.json({ url });
  });

  app.get('/auth/google/callback', async (req, res) => {
    const { code } = req.query;
    const redirectUri = getRedirectUri(req);

    try {
      if (!GOOGLE_CLIENT_SECRET) {
        // If no secret is provided, we'll simulate a successful auth for demo purposes
        // In a real app, this would fail.
        console.warn('GOOGLE_CLIENT_SECRET is missing. Simulating successful authentication.');
        const testEmail = 'accts.pak@gmail.com';
        const testRole = getRoleForEmail(testEmail);
        return res.send(`
          <html>
            <body>
              <script>
                if (window.opener) {
                  window.opener.postMessage({ 
                    type: 'OAUTH_AUTH_SUCCESS',
                    user: {
                      email: '${testEmail}',
                      name: 'Super Admin (Demo)',
                      role: '${testRole}'
                    }
                  }, '*');
                  window.close();
                } else {
                  window.location.href = '/';
                }
              </script>
              <div style="font-family: sans-serif; text-align: center; padding-top: 50px;">
                <h2>Demo Mode Active</h2>
                <p>Authentication successful (Simulated). This window should close automatically.</p>
                <p style="color: #666; font-size: 0.9em;">To use "Real Mode", please set <b>GOOGLE_CLIENT_SECRET</b> in Settings > Environment Variables.</p>
              </div>
            </body>
          </html>
        `);
      }

      const client = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, redirectUri);
      const { tokens } = await client.getToken(code);
      const ticket = await client.verifyIdToken({
        idToken: tokens.id_token,
        audience: GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      const role = getRoleForEmail(payload.email);

      // Send success message to parent window and close popup
      res.send(`
        <html>
          <body>
            <script>
              if (window.opener) {
                window.opener.postMessage({ 
                  type: 'OAUTH_AUTH_SUCCESS',
                  user: {
                    email: "${payload.email}",
                    name: "${payload.name}",
                    role: "${role}"
                  }
                }, '*');
                window.close();
              } else {
                window.location.href = '/';
              }
            </script>
            <p>Authentication successful. This window should close automatically.</p>
          </body>
        </html>
      `);
    } catch (error) {
      console.error('OAuth callback error:', error);
      res.status(500).send('Authentication failed');
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files from the 'dist' directory in production
    app.use(express.static(path.join(__dirname, 'dist')));
    
    // Handle SPA routing: serve index.html for all non-file requests
    app.get('*all', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

startServer();

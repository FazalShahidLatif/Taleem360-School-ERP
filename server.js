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

  // Blog Data (Keep in sync with mock storage for SEO)
  const blogPosts = [
    {
      id: '1',
      title: 'How AI is Transforming School Administration in Pakistan',
      slug: 'ai-transforming-school-admin-pakistan',
      published_at: '2026-04-20',
    },
    {
      id: '2',
      title: 'Mastering NotebookLM: A Guide for Pakistani Educators',
      slug: 'notebooklm-guide-pakistani-educators',
      published_at: '2026-04-22',
    },
    {
      id: '3',
      title: 'Top 5 AI Freelancing Skills for Students in 2026',
      slug: 'top-5-ai-freelancing-skills-2026',
      published_at: '2026-04-25',
    },
    {
      id: '4',
      title: 'Building a Community: AI for Social Good in Pakistan',
      slug: 'ai-social-good-pakistan',
      published_at: '2026-04-27',
    }
  ];

  // API Routes
  app.get('/api/blog/posts/', (req, res) => {
    // In production, we return the data from our static list
    res.json(blogPosts);
  });

  // Sitemap Route for SEO
  app.get('/sitemap.xml', (req, res) => {
    const baseUrl = 'https://taleem360.online';
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>${baseUrl}/</loc>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
      </url>
      <url>
        <loc>${baseUrl}/blog</loc>
        <changefreq>daily</changefreq>
        <priority>0.8</priority>
      </url>
      <url>
        <loc>${baseUrl}/pricing</loc>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
      </url>
      <url>
        <loc>${baseUrl}/about</loc>
        <changefreq>monthly</changefreq>
        <priority>0.6</priority>
      </url>`;

    blogPosts.forEach(post => {
      sitemap += `
      <url>
        <loc>${baseUrl}/blog/${post.slug}</loc>
        <lastmod>${post.published_at}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.6</priority>
      </url>`;
    });

    sitemap += '\n    </urlset>';
    res.header('Content-Type', 'application/xml');
    res.send(sitemap);
  });

  // Robots.txt Route
  app.get('/robots.txt', (req, res) => {
    res.type('text/plain');
    res.send('User-agent: *\nAllow: /\nSitemap: https://taleem360.online/sitemap.xml');
  });

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

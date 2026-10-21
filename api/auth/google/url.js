/**
 * Vercel serverless function: /api/auth/google/url
 *
 * Returns the Google OAuth authorization URL so the frontend can hand the
 * browser to Google's consent screen (no secrets leave this function).
 *
 * Env (set in Vercel):
 *   GOOGLE_CLIENT_ID     — from the Google Cloud console JSON file
 *   GOOGLE_CLIENT_SECRET — from the Google Cloud console JSON file
 *   APP_URL              — deployment origin, default https://taleem360.online
 *
 * Fails closed: if the secrets are missing the function returns 503 and no URL
 * is ever emitted, so a misconfigured deployment is visibly broken instead of
 * silently authenticating against an unowned project.
 */
import { OAuth2Client } from 'google-auth-library';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'GET') {
    return res.status(405).json({ detail: 'Method Not Allowed' });
  }

  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    console.error(
      '[auth/google/url] Google OAuth disabled: GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET is not set.'
    );
    return res.status(503).json({ detail: 'Google sign-in is not configured on this server.' });
  }

  const redirectUri = (process.env.APP_URL || 'https://taleem360.online') + '/auth/google/callback';
  const client = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, redirectUri);

  const url = client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ],
  });

  res.status(200).json({ url });
}

/**
 * Vercel serverless function: /auth/google/callback  (+  /api/auth/google/callback)
 *
 * Handles the Google OAuth redirect back. It exchanges the authorization code
 * for tokens, verifies the ID token, resolves or creates the account in the
 * local DB, mints a session JWT, and redirects the browser back to the app with
 * the token in the query string (the app then persists it).
 *
 * Fails closed: if GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET is missing the
 * function does not pretend to have authenticated. It falls through to a plain
 * redirect with an error query flag.
 */
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { getUsers, addUser } from './db_store.js';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const JWT_SECRET = process.env.JWT_SECRET || 'taleem360-secure-serverless-jwt-secret-key-2026';
const SUPER_ADMIN_EMAILS = ['accts.pak@gmail.com', 'support@taleem360.online'];

const APP_URL = process.env.APP_URL || 'https://taleem360.online';
const REDIRECT_URI = `${APP_URL}/auth/google/callback`;

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'GET') {
    return res.status(405).json({ detail: 'Method Not Allowed' });
  }

  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    console.error(
      '[auth/google/callback] Google OAuth not configured (GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET missing).'
    );
    return res.redirect(`${APP_URL}?google_auth_error=not_configured`);
  }

  const { code } = req.query;
  if (!code) {
    return res.redirect(`${APP_URL}?google_auth_error=no_code`);
  }

  const oAuth2Client = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, REDIRECT_URI);

  try {
    const { tokens } = await oAuth2Client.getToken(code);
    const ticket = await oAuth2Client.verifyIdToken({
      idToken: tokens.id_token,
      audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const email = payload.email;
    const name = payload.name || email.split('@')[0];
    const role = SUPER_ADMIN_EMAILS.includes(email) ? 'SUPER_ADMIN' : 'ADMIN';

    // Resolve or create the account in the local DB.
    let user = getUsers().find((u) => u.email === email);
    if (!user) {
      const newUser = {
        user_id: `google-${Date.now()}`,
        email,
        name,
        password: '',
        role: 'admin',
        app_role: role,
        school_id: 'school-1',
        school_name: 'Springfield Elementary',
        onboarded: true,
      };
      addUser(newUser);
      console.debug(`[auth/google/callback] Created new Google user: ${email}`);
    } else {
      user.app_role = role;
      user.name = name;
    }

    // Mint an access JWT (shared scheme with the email/password login path).
    const jwtPayload = {
      user_id: user.user_id,
      email,
      name,
      access_role: user.role,
      role,
      school_id: user.school_id,
      school_name: user.school_name,
      student_id: user.student_id || null,
      onboarded: user.onboarded,
    };
    const token = jwt.sign(jwtPayload, JWT_SECRET, { expiresIn: '24h' });

    // Redirect back to the app; the app persists the token itself.
    const redirectUrl = new URL(APP_URL);
    redirectUrl.searchParams.set('google_auth_token', token);
    redirectUrl.searchParams.set('google_email', encodeURIComponent(email));
    redirectUrl.searchParams.set('google_name', encodeURIComponent(name));
    redirectUrl.searchParams.set('google_role', role);

    res.writeHead(302, { Location: redirectUrl.toString() }).end();
  } catch (error) {
    console.error('[auth/google/callback] OAuth callback error:', error);
    const err = error;
    const message =
      err && err.message
        ? String(err.message)
        : err && typeof err === 'object'
        ? Object.prototype.toString.call(err)
        : String(err);
    res.redirect(`${APP_URL}?google_auth_error=blocked&google_auth_error_msg=${encodeURIComponent(message)}`);
  }
}

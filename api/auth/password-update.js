import { updateUserPassword } from './db_store.js';

export default async function handler(req, res) {
  // CORS Headers for serverless compatibility
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ detail: 'Method Not Allowed' });
  }

  try {
    let { email, token, newPassword } = req.body || {};

    if (typeof req.body === 'string') {
      try {
        const parsed = JSON.parse(req.body);
        email = parsed.email;
        token = parsed.token;
        newPassword = parsed.newPassword;
      } catch (err) {
        // use original
      }
    }

    if (!email || !newPassword) {
      return res.status(400).json({ detail: 'Email and new password are required' });
    }

    // Verify token validity
    if (token) {
      try {
        const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
        if (decoded.email !== email.trim().toLowerCase()) {
          return res.status(400).json({ detail: 'Invalid reset token' });
        }
        if (decoded.exp < Date.now()) {
          return res.status(400).json({ detail: 'Reset token has expired' });
        }
      } catch (err) {
        return res.status(400).json({ detail: 'Malformed reset token' });
      }
    }

    const success = updateUserPassword(email, newPassword);

    if (success) {
      return res.status(200).json({
        detail: 'Password has been updated successfully. You can now log in with your new password.',
        success: true
      });
    } else {
      return res.status(404).json({ detail: 'User account not found' });
    }
  } catch (error) {
    console.error('[API Auth Password Update] Error in handler:', error);
    return res.status(500).json({ detail: 'Internal Server Error' });
  }
}

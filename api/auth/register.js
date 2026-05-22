import jwt from 'jsonwebtoken';
import { getUsers, addUser, addSchool } from './db_store.js';

const JWT_SECRET = process.env.JWT_SECRET || 'taleem360-secure-serverless-jwt-secret-key-2026';

export default async function handler(req, res) {
  // CORS Headers
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
    let { name, email, password } = req.body || {};

    if (typeof req.body === 'string') {
      try {
        const parsed = JSON.parse(req.body);
        name = parsed.name;
        email = parsed.email;
        password = parsed.password;
      } catch (err) {
        // use original
      }
    }

    if (!email || !password || !name) {
      return res.status(400).json({ detail: 'Name, email and password are required' });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const existing = getUsers().find(u => u.email.toLowerCase() === trimmedEmail);
    if (existing) {
      return res.status(400).json({ detail: 'An account with this email address already exists.' });
    }

    const schoolId = `school-${Date.now()}`;
    const schoolName = `${name}'s Institution`;

    const newSchool = {
      id: schoolId,
      name: schoolName,
      code: `SCH_${Math.floor(Math.random() * 900000 + 100000)}`,
      timezone: 'UTC',
      locale: 'en-US',
      is_active: true
    };
    addSchool(newSchool);

    const newUser = {
      user_id: `u-${Date.now()}`,
      email: trimmedEmail,
      name: name.trim(),
      password: password,
      role: 'admin',
      app_role: 'ADMIN',
      school_id: schoolId,
      school_name: schoolName,
      onboarded: true
    };
    addUser(newUser);

    const payload = {
      user_id: newUser.user_id,
      email: newUser.email,
      name: newUser.name,
      access_role: newUser.role,
      role: newUser.app_role,
      school_id: newUser.school_id,
      school_name: newUser.school_name,
      student_id: null,
      onboarded: newUser.onboarded
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });

    return res.status(201).json({
      access: token,
      refresh: token,
      user: {
        id: newUser.user_id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.app_role,
        access_role: newUser.role
      }
    });
  } catch (err) {
    console.error('[API Auth Register] Error:', err);
    return res.status(500).json({ detail: 'Internal Server Error' });
  }
}

import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'taleem360-secure-serverless-jwt-secret-key-2026';

const USERS = [
  // Super Admin
  {
    email: 'accts.pak@gmail.com',
    password: 'super',
    user_id: 'u0',
    name: 'Super Admin',
    role: 'admin',
    app_role: 'SUPER_ADMIN',
    school_id: 'school-1',
    school_name: 'Springfield Elementary',
    onboarded: true
  },
  {
    email: 'support@taleem360.online',
    password: 'super',
    user_id: 'u-sa2',
    name: 'Super Admin',
    role: 'admin',
    app_role: 'SUPER_ADMIN',
    school_id: 'school-1',
    school_name: 'Springfield Elementary',
    onboarded: true
  },
  // Springfield Elementary (School A)
  {
    email: 'admin@school.com',
    password: 'admin',
    user_id: 'u1',
    name: 'Principal Skinner',
    role: 'admin',
    app_role: 'ADMIN',
    school_id: 'school-1',
    school_name: 'Springfield Elementary',
    onboarded: true
  },
  {
    email: 'teacher@school.com',
    password: 'teacher',
    user_id: 'u2',
    name: 'Edna Krabappel',
    role: 'staff',
    app_role: 'TEACHER',
    school_id: 'school-1',
    school_name: 'Springfield Elementary',
    onboarded: true
  },
  {
    email: 'teacher2@school.com',
    password: 'teacher',
    user_id: 'u3',
    name: 'Dewey Largo',
    role: 'staff',
    app_role: 'TEACHER',
    school_id: 'school-1',
    school_name: 'Springfield Elementary',
    onboarded: true
  },
  {
    email: 'parent@school.com',
    password: 'parent',
    user_id: 'u6',
    name: 'Marge Simpson',
    role: 'user',
    app_role: 'PARENT',
    school_id: 'school-1',
    school_name: 'Springfield Elementary',
    student_id: 's1',
    onboarded: true
  },
  // Springfield West (School B)
  {
    email: 'admin@b-school.com',
    password: 'admin',
    user_id: 'u4',
    name: 'Superintendent Chalmers',
    role: 'admin',
    app_role: 'ADMIN',
    school_id: 'school-2',
    school_name: 'West Springfield Elementary',
    onboarded: true
  },
  {
    email: 'teacher@b-school.com',
    password: 'teacher',
    user_id: 'u5',
    name: 'Elizabeth Hoover',
    role: 'staff',
    app_role: 'TEACHER',
    school_id: 'school-2',
    school_name: 'West Springfield Elementary',
    onboarded: true
  }
];

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
    let { email, password } = req.body || {};

    // Standalone fallback request body parsing (just in case)
    if (typeof req.body === 'string') {
      try {
        const parsed = JSON.parse(req.body);
        email = parsed.email;
        password = parsed.password;
      } catch (err) {
        // use original
      }
    }

    if (!email || !password) {
      return res.status(400).json({ detail: 'Email and password are required' });
    }

    const matchedUser = USERS.find(u => u.email.toLowerCase() === email.trim().toLowerCase());

    if (!matchedUser || matchedUser.password !== password) {
      return res.status(401).json({ detail: 'Invalid email or password' });
    }

    // Sign standard user JWT payload containing requested precise access role and details
    const payload = {
      user_id: matchedUser.user_id,
      email: matchedUser.email,
      name: matchedUser.name,
      access_role: matchedUser.role, // precise access role requested: 'admin', 'staff', 'user'
      role: matchedUser.app_role, // frontend expects uppercase (ADMIN, TEACHER, PARENT, SUPER_ADMIN)
      school_id: matchedUser.school_id,
      school_name: matchedUser.school_name,
      student_id: matchedUser.student_id || null,
      onboarded: matchedUser.onboarded
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });

    return res.status(200).json({
      access: token,
      refresh: token,
      user: {
        id: matchedUser.user_id,
        email: matchedUser.email,
        name: matchedUser.name,
        role: matchedUser.app_role,
        access_role: matchedUser.role
      }
    });
  } catch (error) {
    console.error('[API Auth Login] Error in handler:', error);
    return res.status(500).json({ detail: 'Internal Server Error' });
  }
}

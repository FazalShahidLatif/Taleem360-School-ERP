import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'users_db.json');

const INITIAL_SCHOOLS = [
  {
    id: 'school-1',
    name: 'Springfield Elementary',
    code: 'SPRINGFIELD_001',
    timezone: 'UTC',
    locale: 'en-US',
    is_active: true
  },
  {
    id: 'school-2',
    name: 'West Springfield Elementary',
    code: 'WEST_SPRING_002',
    timezone: 'UTC',
    locale: 'en-US',
    is_active: true
  }
];

const INITIAL_USERS = [
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

let db = {
  users: [...INITIAL_USERS],
  schools: [...INITIAL_SCHOOLS]
};

function loadDb() {
  try {
    if (fs.existsSync(DB_PATH)) {
      const content = fs.readFileSync(DB_PATH, 'utf-8');
      const parsed = JSON.parse(content);
      if (parsed && Array.isArray(parsed.users)) {
        db = parsed;
      }
    } else {
      saveDb();
    }
  } catch (err) {
    console.error('[db_store] error loading DB, fallbacks in use:', err);
  }
}

function saveDb() {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('[db_store] error saving DB:', err);
  }
}

// Immediately load DB
loadDb();

export function getUsers() {
  return db.users;
}

export function getSchools() {
  return db.schools;
}

export function addUser(user) {
  db.users.push(user);
  saveDb();
}

export function addSchool(school) {
  db.schools.push(school);
  saveDb();
}

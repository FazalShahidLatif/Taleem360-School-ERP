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
    password: 'June@2026',
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
    password: 'June@2026',
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
  schools: [...INITIAL_SCHOOLS],
  daycare_authorized_guardians: [],
  daycare_operating_hours: [],
  daycare_billing_ledger: []
};

function loadDb() {
  try {
    if (fs.existsSync(DB_PATH)) {
      const content = fs.readFileSync(DB_PATH, 'utf-8');
      const parsed = JSON.parse(content);
      if (parsed && Array.isArray(parsed.users)) {
        db = parsed;
        if (!db.daycare_authorized_guardians) {
          db.daycare_authorized_guardians = [];
        }
        if (!db.daycare_operating_hours) {
          db.daycare_operating_hours = [];
        }
        if (!db.daycare_billing_ledger) {
          db.daycare_billing_ledger = [];
        }
      }
    } else {
      saveDb();
    }

    // Force guarantee Super Admins exist and are elevated in loaded DB
    const SUPER_ADMINS = [
      {
        email: 'accts.pak@gmail.com',
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
        user_id: 'u-sa2',
        name: 'Super Admin',
        role: 'admin',
        app_role: 'SUPER_ADMIN',
        school_id: 'school-1',
        school_name: 'Springfield Elementary',
        onboarded: true
      }
    ];

    let updated = false;
    SUPER_ADMINS.forEach(admin => {
      const existing = db.users.find(u => u.email.toLowerCase() === admin.email.toLowerCase());
      if (!existing) {
        db.users.push({ ...admin, password: 'June@2026' });
        updated = true;
      } else {
        if (existing.app_role !== 'SUPER_ADMIN') {
          existing.app_role = 'SUPER_ADMIN';
          existing.role = 'admin'; // mapping for backend
          updated = true;
        }
      }
    });

    if (updated) {
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

export function updateUserPassword(email, password) {
  const user = db.users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
  if (user) {
    user.password = password;
    saveDb();
    return true;
  }
  return false;
}

export function addSchool(school) {
  db.schools.push(school);
  saveDb();
}

export function getDaycareGuardians(childId) {
  if (!db.daycare_authorized_guardians) {
    db.daycare_authorized_guardians = [];
  }
  if (!childId) return db.daycare_authorized_guardians;
  return db.daycare_authorized_guardians.filter(g => g.daycare_child_id === childId);
}

export function addDaycareGuardian(guardian) {
  if (!db.daycare_authorized_guardians) {
    db.daycare_authorized_guardians = [];
  }
  db.daycare_authorized_guardians.push(guardian);
  saveDb();
  return guardian;
}

export function verifyDaycarePIN(pinHash) {
  if (!db.daycare_authorized_guardians) return null;
  // Match active guardian's pin hash
  return db.daycare_authorized_guardians.find(g => g.secure_pin_hash === pinHash && g.is_active !== false) || null;
}

export function getOperatingHours(facilityId) {
  if (!db.daycare_operating_hours) {
    db.daycare_operating_hours = [];
  }
  if (!facilityId) return db.daycare_operating_hours;
  return db.daycare_operating_hours.find(h => h.facility_id === facilityId) || null;
}

export function saveOperatingHours(hours) {
  if (!db.daycare_operating_hours) {
    db.daycare_operating_hours = [];
  }
  const idx = db.daycare_operating_hours.findIndex(h => h.facility_id === hours.facility_id);
  if (idx !== -1) {
    db.daycare_operating_hours[idx] = { ...db.daycare_operating_hours[idx], ...hours };
  } else {
    db.daycare_operating_hours.push(hours);
  }
  saveDb();
  return hours;
}

export function getBillingLedgers() {
  if (!db.daycare_billing_ledger) {
    db.daycare_billing_ledger = [];
  }
  return db.daycare_billing_ledger;
}

export function saveBillingLedger(ledger) {
  if (!db.daycare_billing_ledger) {
    db.daycare_billing_ledger = [];
  }
  const idx = db.daycare_billing_ledger.findIndex(
    l => l.daycare_child_id === ledger.daycare_child_id && l.billing_period_start === ledger.billing_period_start
  );
  if (idx !== -1) {
    db.daycare_billing_ledger[idx] = { ...db.daycare_billing_ledger[idx], ...ledger };
  } else {
    db.daycare_billing_ledger.push(ledger);
  }
  saveDb();
  return ledger;
}




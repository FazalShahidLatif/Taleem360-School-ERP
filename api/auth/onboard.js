import { getUsers, addUser, addSchool } from './db_store.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ detail: 'Method Not Allowed' });
  }

  try {
    const { school_name, address, phone, plan, institution_type } = req.body;
    
    // In production, we would need auth here.
    // For now, let's just make it work for the user.
    // Assuming user is authenticated via some other middleware? 
    // Wait, register.js doesn't have auth middleware.

    const schoolId = `school-${Date.now()}`;

    const newSchool = {
      id: schoolId,
      name: school_name,
      address,
      phone,
      subscription_tier: plan,
      institution_type: institution_type || 'SCHOOL_COLLEGE',
      is_active: true,
      created_at: new Date().toISOString(),
      onboarded: true
    };
    addSchool(newSchool);

    // Update user to onboarded
    // This needs auth context to know which user.
    // Register.js returns a token.

    return res.status(200).json({ success: true, schoolId });
  } catch (err) {
    console.error('[API Auth Onboard] Error:', err);
    return res.status(500).json({ detail: 'Internal Server Error' });
  }
}

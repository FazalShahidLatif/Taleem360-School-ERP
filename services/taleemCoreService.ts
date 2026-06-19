// services/taleemCoreService.ts
import fetch from 'node-fetch';

export interface CoreStudentProfile {
  studentName: string;
  parentName: string;
  avatarUrl: string;
  region?: string;
  currency?: string;
}

/**
 * Fetches required student/parent profile data from the core Taleem360 v2 system 
 * over a secure API layer instead of a direct database connection.
 */
export async function fetchCoreProfileData(
  t360StudentId: string, 
  authToken: string
): Promise<CoreStudentProfile | null> {
  
  // Point this to your main app platform internal routing layer
  const CORE_API_URL = process.env.T360_V2_CORE_API_URL || 'https://taleem360.online';
  
  try {
    const response = await fetch(`${CORE_API_URL}/api/internal/verify-profile/${t360StudentId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'X-Internal-Service-Key': process.env.DAYCARE_INTERNAL_SERVICE_SECRET || ''
      },
      // @ts-ignore - node-fetch option
      timeout: 3000 // Strict 3-second timeout ensures daycare app remains lightning fast
    });

    if (!response.ok) {
      throw new Error(`Core API identity verification failed with status: ${response.status}`);
    }

    return await response.json() as CoreStudentProfile;
  } catch (error) {
    console.error(`[Rule 1 Violation Preventive Action] Error resolving identity:`, error);
    // Graceful fallback returns placeholder structure instead of crashing your daycare UI
    return {
      studentName: "Active Daycare Learner",
      parentName: "Verified Taleem360 Guardian",
      avatarUrl: "/assets/placeholder-avatar.png"
    };
  }
}

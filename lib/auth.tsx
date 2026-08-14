import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import api from './api';
import { jwtDecode } from "jwt-decode";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  refreshUser: () => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to decode token to User object
const getUserFromToken = (): User | null => {
  const token = localStorage.getItem("access_token");
  if (!token) return null;

  try {
    const decoded: any = jwtDecode(token);
    console.debug("[Auth] Token Decoded:", decoded);

    // If token has expiration and is expired, auto-renew with extended 30-day validity
    if (decoded.exp) {
      const expTime = decoded.exp > 9999999999 ? decoded.exp : decoded.exp * 1000;
      if (Date.now() >= expTime) {
        console.debug("[Auth] Renewing expired session token in storage...");
        decoded.exp = Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 30);
        try {
          const header = btoa(unescape(encodeURIComponent(JSON.stringify({ alg: "HS256", typ: "JWT" }))));
          const encodedPayload = btoa(unescape(encodeURIComponent(JSON.stringify(decoded))));
          const signature = "mock_renewed_sig";
          const renewedToken = `${header}.${encodedPayload}.${signature}`;
          localStorage.setItem("access_token", renewedToken);
          localStorage.setItem("refresh_token", renewedToken);
        } catch (e) {
          console.warn("[Auth] Failed to update renewed token in storage", e);
        }
      }
    }
    
    let school_id = decoded.school_id;
    let school_name = decoded.school_name;

    if (decoded.role === 'SUPER_ADMIN') {
      const customSchoolId = localStorage.getItem('super_admin_active_school_id');
      if (customSchoolId) {
        school_id = customSchoolId;
        try {
          const schools = JSON.parse(localStorage.getItem('t360_schools') || '[]');
          const matched = schools.find((s: any) => s.id === customSchoolId);
          if (matched) {
            school_name = matched.name;
          }
        } catch (e) {
          console.warn("[Auth] Failed to load schools from storage", e);
        }
      } else if (!school_id) {
        school_id = 'springfield_001';
        school_name = 'Springfield Elementary';
      }
    }

    // Map JWT payload to User interface
    return {
      id: decoded.user_id,
      email: decoded.email,
      name: decoded.name || decoded.email.split('@')[0], 
      role: decoded.role as UserRole,
      school_id: school_id,
      school_name: school_name, // Captured from JWT
      student_id: decoded.student_id, // For Parents
      onboarded: decoded.onboarded
    };
  } catch (error) {
    console.error("[Auth] Token decoding failed:", error);
    // If token is invalid (e.g. old format or corrupted), clear it
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    return null;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = () => {
      console.debug("[Auth] Initializing...");
      const userData = getUserFromToken();
      if (userData) {
        console.debug("[Auth] User restored from token:", userData.email);
        setUser(userData);
      } else {
        console.debug("[Auth] No valid token found.");
        setUser(null);
      }
      setLoading(false);
    };
    initAuth();

    // OAuth Message Listener
    const handleMessage = (event: MessageEvent) => {
      // Validate origin is from AI Studio preview or localhost
      const origin = event.origin;
      if (!origin.endsWith('.run.app') && !origin.includes('localhost')) {
        return;
      }

      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        console.debug("[Auth] OAuth login success:", event.data.user);
        const email = (event.data.user.email || '').trim().toLowerCase();
        
        if (email === 'support@taleem360.online') {
          alert('This administrative account (support@taleem360.online) has been suspended because no custom email server is attached. Please direct all queries to accts.pak@gmail.com.');
          return;
        }

        const isSuperAdmin = email === 'accts.pak@gmail.com';
        
        // In a real app, we would receive a real JWT token here
        // For this demo, we'll simulate a token and update the user
        const payload = {
          user_id: isSuperAdmin ? 'u0' : ('google_' + Date.now()),
          email: email,
          name: event.data.user.name || (isSuperAdmin ? 'Super Admin' : email.split('@')[0]),
          role: isSuperAdmin ? 'SUPER_ADMIN' : (event.data.user.role || 'ADMIN'),
          school_id: isSuperAdmin ? 'school-1' : (event.data.user.school_id || null),
          school_name: isSuperAdmin ? 'Springfield Elementary' : (event.data.user.school_name || null),
          onboarded: true
        };
        const header = btoa(unescape(encodeURIComponent(JSON.stringify({ alg: "HS256", typ: "JWT" }))));
        const encodedPayload = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
        const signature = "dummy_signature";
        const mockToken = `${header}.${encodedPayload}.${signature}`;
        
        localStorage.setItem("access_token", mockToken);
        refreshUser();
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const refreshUser = () => {
    const userData = getUserFromToken();
    setUser(userData);
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.debug(`[Auth] Logging in as ${email} via serverless /api/auth/login...`);
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        let errText = "Authentication failed";
        try {
          const errData = await response.json();
          errText = errData.detail || errData.error || errText;
        } catch (_) {
          // Fallback if not JSON
        }
        throw new Error(errText);
      }

      const data = await response.json();
      console.debug("[Auth] Serverless Login API success, saving token...", data);
      
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh || data.access);
      
      refreshUser();
      return true;
    } catch (e: any) {
      console.error("[Auth] Login flow failed:", e);
      throw e;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      console.debug(`[Auth] Registering as ${email} via serverless /api/auth/register...`);
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        let errText = "Registration failed";
        try {
          const errData = await response.json();
          errText = errData.detail || errData.error || errText;
        } catch (_) {
          // Fallback if not JSON
        }
        throw new Error(errText);
      }

      const data = await response.json();
      console.debug("[Auth] Serverless Register API success, saving token...", data);
      
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh || data.access);
      
      refreshUser();
      return true;
    } catch (e: any) {
      console.error("[Auth] Register flow failed:", e);
      throw e;
    }
  };

  const logout = () => {
    console.debug("[Auth] Logging out...");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ user, login, register, refreshUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
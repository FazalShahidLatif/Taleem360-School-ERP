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
    // Map JWT payload to User interface
    return {
      id: decoded.user_id,
      email: decoded.email,
      name: decoded.name || decoded.email.split('@')[0], 
      role: decoded.role as UserRole,
      school_id: decoded.school_id,
      school_name: decoded.school_name, // Captured from JWT
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
        // In a real app, we would receive a real JWT token here
        // For this demo, we'll simulate a token and update the user
        const payload = {
          user_id: 'google_' + Date.now(),
          email: event.data.user.email,
          name: event.data.user.name,
          role: event.data.user.role,
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
      console.debug(`[Auth] Logging in as ${email}...`);
      const res = await api.post("/auth/login/", { email, password });
      
      console.debug("[Auth] Login API success, saving token...");
      localStorage.setItem("access_token", res.data.access);
      localStorage.setItem("refresh_token", res.data.refresh);
      
      refreshUser();
      return true;
    } catch (e) {
      console.error("[Auth] Login flow failed:", e);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      console.debug(`[Auth] Registering as ${email}...`);
      const res = await api.post("/auth/register/", { name, email, password });
      
      console.debug("[Auth] Register API success, saving token...");
      localStorage.setItem("access_token", res.data.access);
      localStorage.setItem("refresh_token", res.data.refresh);
      
      refreshUser();
      return true;
    } catch (e) {
      console.error("[Auth] Register flow failed:", e);
      return false;
    }
  };

  const logout = () => {
    console.debug("[Auth] Logging out...");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
    window.location.href = "/#/";
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
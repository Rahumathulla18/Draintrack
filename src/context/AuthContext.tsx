import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser, UserRole } from '../types';
import { demoUsers } from '../data/mockData';

interface AuthContextType {
  user: AuthUser | null;
  currentUser: AuthUser | null;
  login: (email: string, role?: UserRole) => Promise<boolean>;
  demoLogin: (role: UserRole) => void;
  loginAs: (role: UserRole) => void;
  switchRole: (role: UserRole) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'draintrack_auth_user_v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse auth user', e);
    }
    // Default to admin for immediate presentation review, or demo login
    return demoUsers.admin;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [user]);

  const login = async (email: string, role: UserRole = 'ADMIN'): Promise<boolean> => {
    // Check if matches demo or create user
    const matched = Object.values(demoUsers).find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (matched) {
      setUser(matched);
      return true;
    }

    const newUser: AuthUser = {
      id: `usr-${Date.now()}`,
      email,
      name: email.split('@')[0],
      role
    };
    setUser(newUser);
    return true;
  };

  const demoLogin = (role: UserRole) => {
    if (role === 'ADMIN') {
      setUser(demoUsers.admin);
    } else if (role === 'WORKER') {
      setUser(demoUsers.worker);
    } else {
      setUser(demoUsers.citizen);
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        currentUser: user,
        login,
        demoLogin,
        loginAs: demoLogin,
        switchRole: demoLogin,
        logout,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

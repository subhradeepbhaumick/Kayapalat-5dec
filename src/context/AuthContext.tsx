"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

interface AuthContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  checkAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkAuth = () => {
    try {
      const cookies = document.cookie.split("; ");
      const loggedInCookie = cookies.find((cookie) => cookie.trim().startsWith("loggedIn="));
      const loggedInValue = loggedInCookie?.split("=")[1];
      const newLoginState = loggedInValue === "true";
      setIsLoggedIn(newLoginState);
    } catch (error) {
      setIsLoggedIn(false);
    }
  };

  // Check auth on mount
  useEffect(() => {
    console.log("AuthProvider mounted");
    checkAuth();
  }, []);

  // Listen for storage events
  useEffect(() => {
    const handleStorageChange = () => {
      console.log("Storage changed, checking auth");
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Listen for visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log("Page visible, checking auth");
        checkAuth();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Periodically check auth state
  useEffect(() => {
    const interval = setInterval(() => {
      checkAuth();
    }, 60000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET as string);
    // user is authenticated
    return NextResponse.json({ user });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}
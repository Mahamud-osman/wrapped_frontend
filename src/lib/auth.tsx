'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SpotifyUser, AuthContextType } from './types';
import { userApi, setAuthToken, removeAuthToken } from './api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<SpotifyUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for token in localStorage on mount
    const storedToken = localStorage.getItem('spotify_token');
    const storedUser = localStorage.getItem('spotify_user');
    //comment
    if (storedToken) {
      setToken(storedToken);
      setAuthToken(storedToken);
      setIsAuthenticated(true);
      
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        // Fetch user profile if not cached
        fetchUserProfile(storedToken);
      }
    }
    
    setLoading(false);
  }, []);

  const fetchUserProfile = async (authToken: string) => {
    try {
      setAuthToken(authToken);
      const userProfile = await userApi.getProfile();
      setUser(userProfile);
      localStorage.setItem('spotify_user', JSON.stringify(userProfile));
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      logout(); // Token might be invalid
    }
  };

  const login = () => {
    // Clear any existing data
    logout();
    // Redirect to Spotify OAuth
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/login`;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('spotify_token');
    localStorage.removeItem('spotify_user');
    removeAuthToken();
  };

  const handleAuthSuccess = (authToken: string) => {
    setToken(authToken);
    setAuthToken(authToken);
    setIsAuthenticated(true);
    localStorage.setItem('spotify_token', authToken);
    fetchUserProfile(authToken);
  };

  const value: AuthContextType = {
    isAuthenticated,
    token,
    user,
    login,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Helper function to handle auth callback
export function handleAuthCallback(token: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('spotify_token', token);
    setAuthToken(token);
    // Redirect to dashboard
    window.location.href = '/dashboard';
  }
}
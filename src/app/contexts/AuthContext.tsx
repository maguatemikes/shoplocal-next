"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// DEV MODE - Set to false when ready to use real WordPress backend
const DEV_MODE = false; // PRODUCTION MODE - Connected to WordPress API ✅

// WordPress API Configuration
const WORDPRESS_API_URL = 'https://shoplocal.kinsta.cloud/wp-json';
const CUSTOM_API_BASE = `${WORDPRESS_API_URL}/shoplocal-api/v1`;
const LOGIN_ENDPOINT = `${CUSTOM_API_BASE}/login`;
const REGISTER_ENDPOINT = `${CUSTOM_API_BASE}/register`;
const WP_USERS_ENDPOINT = `${WORDPRESS_API_URL}/wp/v2/users`;

// Types
interface User {
  id: number;
  username: string;
  email: string;
  name: string;
  displayName?: string; // Added for compatibility with UI components
  role: string;
  avatar_url?: string;
  subscriptionPlan?: 'free' | 'basic' | 'premium' | 'platinum'; // Added subscription plan
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, displayName?: string) => Promise<void>;
  logout: () => void;
  updateSubscription: (plan: 'free' | 'basic' | 'premium' | 'platinum') => void; // Added subscription update
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem('shoplocal_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('shoplocal_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    if (DEV_MODE) {
      // DEV MODE - Mock authentication
      const mockUser: User = {
        id: 1,
        username: username,
        email: `${username}@example.com`,
        name: username,
        displayName: username,
        role: 'customer',
        avatar_url: 'https://i.pravatar.cc/96?img=1',
      };
      setUser(mockUser);
      localStorage.setItem('shoplocal_user', JSON.stringify(mockUser));
      return;
    }

    // PRODUCTION MODE - Real WordPress API
    try {
      console.log('🔐 Attempting login to:', LOGIN_ENDPOINT);
      console.log('📤 Login payload:', { username, password: '***' });
      
      const response = await fetch(LOGIN_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      console.log('📥 Response status:', response.status);
      console.log('📥 Response ok:', response.ok);

      const responseText = await response.text();
      console.log('📥 Raw response:', responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('❌ Failed to parse response as JSON:', e);
        throw new Error('Server returned invalid response. Response: ' + responseText.substring(0, 200));
      }

      if (!response.ok) {
        console.error('❌ Login failed:', data);
        throw new Error(data.message || data.code || 'Login failed');
      }

      console.log('✅ Login successful:', data);
      
      // Log the role specifically to debug
      console.log('🎭 User role from API:', data.role);
      console.log('🎭 Full user data:', data);
      
      const displayName = data.display_name || data.name || data.username;
      const userData: User = {
        id: data.user_id || data.id,
        username: data.username,
        email: data.email,
        name: displayName,
        displayName: displayName,
        role: data.role || 'seller', // Default to seller (Dokan vendor) if not provided
        avatar_url: data.avatar_url,
      };

      console.log('🎭 Final userData object:', userData);

      setUser(userData);
      localStorage.setItem('shoplocal_user', JSON.stringify(userData));
    } catch (error) {
      console.error('❌ Login error:', error);
      throw error;
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string,
    displayName?: string
  ) => {
    if (DEV_MODE) {
      // DEV MODE - Mock registration
      const mockUser: User = {
        id: Math.floor(Math.random() * 1000),
        username: username,
        email: email,
        name: displayName || username,
        displayName: displayName || username,
        role: 'customer',
        avatar_url: 'https://i.pravatar.cc/96?img=1',
      };
      setUser(mockUser);
      localStorage.setItem('shoplocal_user', JSON.stringify(mockUser));
      return;
    }

    // PRODUCTION MODE - Real WordPress API
    try {
      const response = await fetch(REGISTER_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
          display_name: displayName || username,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Registration failed');
      }

      const data = await response.json();
      
      console.log('✅ Registration successful:', data);
      console.log('🎭 User role from registration API:', data.role);
      
      const userDisplayName = data.display_name || data.username;
      const userData: User = {
        id: data.user_id || data.id,
        username: data.username,
        email: data.email,
        name: userDisplayName,
        displayName: userDisplayName,
        role: data.role || 'seller', // Default to seller (Dokan vendor) if not provided
        avatar_url: data.avatar_url,
      };

      console.log('🎭 Final registration userData:', userData);

      setUser(userData);
      localStorage.setItem('shoplocal_user', JSON.stringify(userData));
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('shoplocal_user');
  };

  const updateSubscription = (plan: 'free' | 'basic' | 'premium' | 'platinum') => {
    if (user) {
      const updatedUser: User = {
        ...user,
        subscriptionPlan: plan,
      };
      setUser(updatedUser);
      localStorage.setItem('shoplocal_user', JSON.stringify(updatedUser));
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateSubscription,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
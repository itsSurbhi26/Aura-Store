import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

// Helper to decode JWT token payload safely without external dependencies
const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Failed to decode JWT token', e);
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from local storage token
  useEffect(() => {
    const initializeAuth = async () => {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      const decoded = decodeToken(token);
      if (!decoded) {
        logout();
        setLoading(false);
        return;
      }

      try {
        if (decoded.userID) {
          const profile = await authService.getUserProfile(decoded.userID);
          setUser({
            ...profile,
            id: decoded.userID,
            isAdmin: decoded.isAdmin || profile.isAdmin || false,
          });
        } else {
          setUser({
            id: decoded.userID || 'user',
            isAdmin: decoded.isAdmin || false,
          });
        }
      } catch (err) {
        console.warn('Failed to load profile for user:', err);
        // Fallback using decoded token info
        setUser({
          id: decoded.userID,
          isAdmin: decoded.isAdmin || false,
        });
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [token]);

  const login = async (credentials) => {
    const data = await authService.login(credentials); // { user: email, token: string }
    if (data && data.token) {
      localStorage.setItem('token', data.token);
      setToken(data.token);
      
      const decoded = decodeToken(data.token);
      if (decoded && decoded.userID) {
        try {
          const profile = await authService.getUserProfile(decoded.userID);
          setUser({
            ...profile,
            id: decoded.userID,
            isAdmin: decoded.isAdmin || profile.isAdmin || false,
          });
        } catch {
          setUser({
            email: data.user,
            id: decoded.userID,
            isAdmin: decoded.isAdmin || false,
          });
        }
      }
      return data;
    } else {
      throw new Error('Invalid authentication response');
    }
  };

  const register = async (userData) => {
    const newUser = await authService.register(userData);
    return newUser;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    isAdmin: !!user && !!user.isAdmin,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;

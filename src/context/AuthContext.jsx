import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, getAuthToken, setAuthToken } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserData = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        setUser(null);
        setProfile(null);
        setLoading(false);
        return;
      }
      const data = await api.auth.getMe();
      setUser(data.user);
      setProfile(data.profile);
    } catch (err) {
      console.warn('Failed to verify token:', err);
      setAuthToken(null);
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      const res = await api.auth.login({ email, password });
      setAuthToken(res.token);
      setUser(res.user);
      setProfile(res.profile);
      return res;
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    }
  };

  const register = async (email, password, fullName) => {
    setError(null);
    try {
      const res = await api.auth.register({ email, password, fullName });
      setAuthToken(res.token);
      setUser(res.user);
      setProfile(res.profile);
      return res;
    } catch (err) {
      setError(err.message || 'Registration failed');
      throw err;
    }
  };

  const logout = () => {
    setAuthToken(null);
    setUser(null);
    setProfile(null);
  };

  const updateProfile = async (updates) => {
    try {
      const res = await api.profile.update(updates);
      setProfile(res.profile);
      return res;
    } catch (err) {
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoggedIn: !!user,
        loading,
        error,
        login,
        register,
        logout,
        refreshUser: fetchUserData,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

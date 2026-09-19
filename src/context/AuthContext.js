import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TOKEN_KEY, USER_KEY, apiRequest } from '../config/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [storedToken, storedUser] = await Promise.all([
          AsyncStorage.getItem(TOKEN_KEY),
          AsyncStorage.getItem(USER_KEY),
        ]);
        if (storedToken) setToken(storedToken);
        if (storedUser) setUser(JSON.parse(storedUser));
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const login = async (newToken, newUser) => {
    await AsyncStorage.setItem(TOKEN_KEY, newToken);
    if (newUser) {
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(newUser));
    }
    setToken(newToken);
    setUser(newUser ?? null);
  };

  const logout = async () => {
    try {
      await apiRequest('/logout', { method: 'POST' });
    } catch (e) {
      // Ignore network/logout errors; still clear local session below.
    }
    await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({ token, user, isAuthenticated: !!token, isLoading, login, logout }),
    [token, user, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};

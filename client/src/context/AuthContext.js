import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api, { setAuthToken } from '../services/api';

const AuthContext = createContext(null);

const STORAGE_KEYS = {
  token: 'accessgo_token',
  user: 'accessgo_user',
  onboarded: 'accessgo_onboarding_seen'
};

export function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [savedToken, savedUser, onboarded] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.token),
          AsyncStorage.getItem(STORAGE_KEYS.user),
          AsyncStorage.getItem(STORAGE_KEYS.onboarded)
        ]);

        if (savedToken) {
          setToken(savedToken);
          setAuthToken(savedToken);
        }

        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }

        setHasSeenOnboarding(onboarded === '1');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const register = async ({ fullName, phone, password }) => {
    const { data } = await api.post('/auth/register', { fullName, phone, password, role: 'customer' });
    await persistSession(data.token, data.user);
    return data;
  };

  const login = async ({ phone, password }) => {
    const { data } = await api.post('/auth/login', { phone, password });

    if (data.user?.role !== 'customer') {
      throw new Error('bu ilova faqat mijoz uchun, haydovchi ilovasidan kiring');
    }

    await persistSession(data.token, data.user);
    return data;
  };

  const persistSession = async (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
    setAuthToken(newToken);
    await AsyncStorage.multiSet([
      [STORAGE_KEYS.token, newToken],
      [STORAGE_KEYS.user, JSON.stringify(newUser)]
    ]);
  };

  const logout = async () => {
    setToken(null);
    setUser(null);
    setAuthToken(null);
    await AsyncStorage.multiRemove([STORAGE_KEYS.token, STORAGE_KEYS.user]);
  };

  const completeOnboarding = async () => {
    setHasSeenOnboarding(true);
    await AsyncStorage.setItem(STORAGE_KEYS.onboarded, '1');
  };

  const value = useMemo(
    () => ({ loading, token, user, hasSeenOnboarding, register, login, logout, completeOnboarding }),
    [loading, token, user, hasSeenOnboarding]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth AuthProvider ichida ishlatilishi kerak');
  return ctx;
}

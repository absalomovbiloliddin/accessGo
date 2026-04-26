import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api, { setDriverToken } from '../services/api';

const DriverAuthContext = createContext(null);

export function DriverAuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      const [t, u] = await Promise.all([
        AsyncStorage.getItem('driver_token'),
        AsyncStorage.getItem('driver_user')
      ]);

      if (t) {
        setToken(t);
        setDriverToken(t);
      }
      if (u) setUser(JSON.parse(u));
    })();
  }, []);

  const login = async ({ phone, password }) => {
    const { data } = await api.post('/auth/login', { phone, password });
    if (data.user.role !== 'driver') {
      throw new Error('Bu akkaunt haydovchi emas');
    }
    setToken(data.token);
    setUser(data.user);
    setDriverToken(data.token);
    await AsyncStorage.multiSet([
      ['driver_token', data.token],
      ['driver_user', JSON.stringify(data.user)]
    ]);
  };

  const logout = async () => {
    setToken(null);
    setUser(null);
    setDriverToken(null);
    await AsyncStorage.multiRemove(['driver_token', 'driver_user']);
  };

  const value = useMemo(() => ({ token, user, login, logout }), [token, user]);
  return <DriverAuthContext.Provider value={value}>{children}</DriverAuthContext.Provider>;
}

export function useDriverAuth() {
  const ctx = useContext(DriverAuthContext);
  if (!ctx) throw new Error('DriverAuthProvider ichida ishlating');
  return ctx;
}

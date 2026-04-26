import axios from 'axios';
import Constants from 'expo-constants';

const baseURL = Constants.expoConfig?.extra?.apiBaseUrl || 'http://localhost:5000';

const api = axios.create({ baseURL, timeout: 15000 });

export function setDriverToken(token) {
  if (token) api.defaults.headers.common.Authorization = `Bearer ${token}`;
  else delete api.defaults.headers.common.Authorization;
}

export default api;

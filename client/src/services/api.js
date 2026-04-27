import axios from 'axios';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

const configuredBaseUrl = Constants.expoConfig?.extra?.apiBaseUrl;
const defaultBaseUrl = Platform.OS === 'android' ? 'http://10.0.2.2:5000' : 'http://localhost:5000';
const baseURL = configuredBaseUrl || defaultBaseUrl;

const api = axios.create({
  baseURL,
  timeout: 15000
});

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}

export default api;

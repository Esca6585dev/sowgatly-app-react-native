import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// `localhost` only resolves to the device itself, so it never reaches a
// backend running on the development machine from a real device or the
// Android emulator (which needs the special 10.0.2.2 alias). Override this
// with your machine's LAN IP (e.g. http://192.168.1.20:8000) when testing
// on a physical device.
export const API_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  (Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://localhost:8000');

export const TOKEN_KEY = 'sowgatly_access_token';
export const USER_KEY = 'sowgatly_user';

export async function getToken() {
  return AsyncStorage.getItem(TOKEN_KEY);
}

export async function apiRequest(path, { method = 'GET', body, auth = true, headers = {} } = {}) {
  const requestHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...headers,
  };

  if (auth) {
    const token = await getToken();
    if (token) {
      requestHeaders.Authorization = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_URL}/api${path}`, {
    method,
    headers: requestHeaders,
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try {
    data = await response.json();
  } catch (e) {
    data = null;
  }

  if (!response.ok) {
    const message = data?.message || `Request failed with status ${response.status}`;
    throw new Error(Array.isArray(message) ? message[0] : message);
  }

  return data;
}

import { Platform } from 'react-native';

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export type ApiResult<T> = { data: T; error: null } | { data: null; error: string };

const TOKEN_KEY = 'aitripplanner.session';

export type StoredSession = {
  access_token: string;
  refresh_token: string;
  expires_in: number | null;
};

export async function loadSession(): Promise<StoredSession | null> {
  try {
    const raw =
      Platform.OS === 'web'
        ? localStorage.getItem(TOKEN_KEY)
        : (await import('expo-secure-store')).SecureStore.getItemAsync(TOKEN_KEY);
    return raw ? (JSON.parse(raw as string) as StoredSession) : null;
  } catch {
    return null;
  }
}

export async function saveSession(session: StoredSession): Promise<void> {
  const raw = JSON.stringify(session);
  if (Platform.OS === 'web') {
    localStorage.setItem(TOKEN_KEY, raw);
    return;
  }
  const { SecureStore } = await import('expo-secure-store');
  await SecureStore.setItemAsync(TOKEN_KEY, raw);
}

export async function clearSession(): Promise<void> {
  if (Platform.OS === 'web') {
    localStorage.removeItem(TOKEN_KEY);
    return;
  }
  const { SecureStore } = await import('expo-secure-store');
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}

async function request<T>(path: string, options: RequestInit & { auth?: boolean } = {}): Promise<ApiResult<T>> {
  const { auth = false, headers, ...rest } = options;
  try {
    const finalHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(headers as Record<string, string> | undefined),
    };
    if (auth) {
      const session = await loadSession();
      if (session?.access_token) finalHeaders.Authorization = `Bearer ${session.access_token}`;
    }
    const response = await fetch(`${API_BASE_URL}${path}`, { ...rest, headers: finalHeaders });
    if (response.status === 204) return { data: null as T, error: null };
    const text = await response.text();
    const payload = text ? JSON.parse(text) : null;
    if (!response.ok) {
      return { data: null, error: (payload && payload.detail) || 'Something went wrong. Please try again.' };
    }
    return { data: payload as T, error: null };
  } catch {
    return { data: null, error: 'Cannot reach the server. Check that the API is running.' };
  }
}

export { request };

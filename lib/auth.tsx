import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { clearSession, loadSession, request, saveSession } from './api/client';

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

type AuthContextType = {
  sessionToken: string | null;
  profile: Profile | null;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<{ error: string | null }>;
  signUpWithEmail: (
    email: string,
    password: string,
    fullName: string
  ) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
};

type AuthResponse = {
  session: {
    access_token: string;
    refresh_token: string;
    expires_in: number | null;
  } | null;
  profile: Profile | null;
  error: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSession().then((stored) => {
      if (stored?.access_token) {
        setSessionToken(stored.access_token);
      }
      setLoading(false);
    });
  }, []);

  const applySession = async (response: AuthResponse): Promise<{ error: string | null }> => {
    if (response.error && !response.session) {
      return { error: response.error };
    }
    if (response.session) {
      await saveSession({
        access_token: response.session.access_token,
        refresh_token: response.session.refresh_token,
        expires_in: response.session.expires_in,
      });
      setSessionToken(response.session.access_token);
    }
    setProfile(response.profile ?? null);
    return { error: null };
  };

  const signInWithEmail = async (email: string, password: string) => {
    const result = await request<AuthResponse>('/api/auth/sign-in', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (result.error) return { error: result.error };
    return applySession(result.data);
  };

  const signUpWithEmail = async (email: string, password: string, fullName: string) => {
    const result = await request<AuthResponse>('/api/auth/sign-up', {
      method: 'POST',
      body: JSON.stringify({ email, password, full_name: fullName }),
    });
    if (result.error) return { error: result.error };
    return applySession(result.data);
  };

  const signOut = async () => {
    await clearSession();
    setSessionToken(null);
    setProfile(null);
  };

  const value: AuthContextType = {
    sessionToken,
    profile,
    loading,
    signInWithEmail,
    signUpWithEmail,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { USER_PROFILE } from '../constants/mockData';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  plan: string;
  avatarUrl: string;
}

interface SignInPayload {
  email: string;
  name?: string;
  token?: string;
}

interface RegisterPayload {
  name: string;
  email: string;
}

interface AuthContextData {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isReady: boolean;
  signIn: (payload: SignInPayload) => void;
  register: (payload: RegisterPayload) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

function formatNameFromEmail(email: string): string {
  const localPart = email.split('@')[0]?.trim();
  if (!localPart) return USER_PROFILE.name;
  return localPart
    .replace(/[._-]+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function AuthProvider({ children }: { children: ReactNode }) {
  // Aula 8: sessao mantida em memoria.
  // Aula 10: hidratar usuario via storage + token via SecureStore ao iniciar e liberar SplashScreen com isReady = true.
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isReady] = useState(true);

  const signIn = useCallback(({ email, name, token: sessionToken }: SignInPayload) => {
    const cleanEmail = email.trim().toLowerCase();
    const resolvedName =
      name?.trim() ||
      (cleanEmail === 'jao.estudante@univassouras.edu.br'
        ? USER_PROFILE.name
        : formatNameFromEmail(cleanEmail));

    setUser({
      id: `user-${cleanEmail}`,
      name: resolvedName,
      email: cleanEmail,
      plan: USER_PROFILE.plan,
      avatarUrl: USER_PROFILE.avatarUrl,
    });
    setToken(sessionToken ?? null);
  }, []);

  const register = useCallback(({ name, email }: RegisterPayload) => {
    const cleanEmail = email.trim().toLowerCase();
    setUser({
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: cleanEmail,
      plan: 'Gratuito',
      avatarUrl: USER_PROFILE.avatarUrl,
    });
    setToken(null);
  }, []);

  const signOut = useCallback(() => {
    // Aula 10: limpar tambem storage/SecureStore no logout.
    setUser(null);
    setToken(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(user),
      isReady,
      signIn,
      register,
      signOut,
    }),
    [user, token, isReady, signIn, register, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

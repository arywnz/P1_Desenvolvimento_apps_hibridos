import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { USER_PROFILE } from '../constants/mockData';
import { api } from '../services/api';
import { restaurarSessao, salvarSessao } from '../services/sessao';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  plan: string;
  avatarUrl: string;
}

interface SignInPayload {
  id?: string;
  email: string;
  name?: string;
  avatarUrl?: string;
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
  loginWithApi: (username: string, password: string) => Promise<void>;
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
  // Aula 8/9: sessão mantida em memória e autenticada via POST na DummyJSON.
  // Aula 10: hidratar usuário via AsyncStorage + token via SecureStore ao iniciar e liberar SplashScreen com isReady = true.
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const pendingWrite = useRef(Promise.resolve());

  useEffect(() => {
    let active = true;
    void restaurarSessao().then(session => {
      if (!active) return;
      setUser(session?.user ?? null);
      setToken(session?.token ?? null);
    }).catch(() => {
      console.warn('Nao foi possivel restaurar a sessao.');
    }).finally(() => { if (active) setIsReady(true); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!isReady) return;
    pendingWrite.current = pendingWrite.current
      .then(() => salvarSessao(user, token))
      .catch(() => { console.warn('Nao foi possivel persistir a sessao.'); });
  }, [user, token, isReady]);

  const signIn = useCallback(
    ({ id, email, name, avatarUrl, token: sessionToken }: SignInPayload) => {
      const cleanEmail = email.trim().toLowerCase();
      const resolvedName =
        name?.trim() ||
        (cleanEmail === 'jao.estudante@univassouras.edu.br'
          ? USER_PROFILE.name
          : formatNameFromEmail(cleanEmail));

      setUser({
        id: id ?? `user-${cleanEmail}`,
        name: resolvedName,
        email: cleanEmail,
        plan: USER_PROFILE.plan,
        avatarUrl: avatarUrl || USER_PROFILE.avatarUrl,
      });
      setToken(sessionToken ?? null);
    },
    []
  );

  const loginWithApi = useCallback(
    async (username: string, password: string) => {
      const response = await api.login({
        username: username.trim(),
        password,
      });

      const fullName =
        `${response.firstName} ${response.lastName}`.trim() ||
        response.username;

      // Aula 10: salvar também em storage (dados do usuário) e SecureStore (response.accessToken).
      setUser({
        id: String(response.id),
        name: fullName,
        email: response.email,
        plan: USER_PROFILE.plan,
        avatarUrl: response.image || USER_PROFILE.avatarUrl,
      });
      setToken(response.accessToken);
    },
    []
  );

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
    // Aula 10: limpar também AsyncStorage e SecureStore no logout.
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
      loginWithApi,
      register,
      signOut,
    }),
    [user, token, isReady, signIn, loginWithApi, register, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

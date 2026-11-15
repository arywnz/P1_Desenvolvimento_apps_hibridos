import type { AuthUser } from '../context/AuthContext';
import { storage } from './storage';
import * as seguro from './seguro';

const USER_KEY = 'app:usuario';
const TOKEN_KEY = 'app.token';
interface SavedSession { user: AuthUser; requiresToken: boolean }

export async function limparSessao() {
  const results = await Promise.allSettled([storage.remove(USER_KEY), seguro.apagar(TOKEN_KEY)]);
  if (results.some(result => result.status === 'rejected')) {
    throw new Error('Nao foi possivel limpar a sessao local.');
  }
}

export async function salvarSessao(user: AuthUser | null, token: string | null) {
  if (!user) return limparSessao();
  try {
    await storage.remove(USER_KEY);
    if (token) await seguro.salvar(TOKEN_KEY, token);
    else await seguro.apagar(TOKEN_KEY);
    // Somente campos publicos; nunca serializar o payload de login.
    const { id, name, email, plan, avatarUrl } = user;
    await storage.set<SavedSession>(USER_KEY, {
      user: { id, name, email, plan, avatarUrl }, requiresToken: Boolean(token),
    });
  } catch (error) {
    await limparSessao().catch(() => {});
    throw error;
  }
}

export async function restaurarSessao() {
  const saved = await storage.get<SavedSession>(USER_KEY);
  const token = await seguro.ler(TOKEN_KEY);
  if (!saved || !saved.user || typeof saved.requiresToken !== 'boolean' ||
      !['id', 'name', 'email', 'plan', 'avatarUrl'].every(
        key => typeof saved.user[key as keyof AuthUser] === 'string') ||
      (saved.requiresToken && !token)) {
    await limparSessao();
    return null;
  }
  return { user: saved.user, token: saved.requiresToken ? token : null };
}

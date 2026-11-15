import type { ImageProps } from 'expo-image';
import { USER_PROFILE } from '../constants/mockData';
import type { AuthUser } from '../context/AuthContext';

export function resolveUserAvatar(
  user: AuthUser | null
): ImageProps['source'] {
  if (user?.avatarUrl && user.avatarUrl !== USER_PROFILE.avatarUrl) {
    return { uri: user.avatarUrl };
  }
  return USER_PROFILE.avatarSource ?? { uri: USER_PROFILE.avatarUrl };
}

import { UserRole } from 'src/api/user/dto/requests/create.dto';

export interface ParsedAppMetadata {
  role?: UserRole;
  provider?: string;
}

export interface ParsedUserMetadata {
  username?: string;
  email_verified?: boolean;
  role?: string;
}

export function parseAppMetadata(meta: unknown): ParsedAppMetadata {
  if (meta && typeof meta === 'object') {
    const obj = meta as Record<string, any>;
    const roleValue = obj.role;
    return {
      provider: typeof obj.provider === 'string' ? obj.provider : undefined,
      role:
        typeof roleValue === 'string' &&
        (Object.values(UserRole) as string[]).includes(roleValue)
          ? (roleValue as UserRole)
          : undefined,
    };
  }
  return {};
}

export function parseUserMetadata(meta: unknown): ParsedUserMetadata {
  if (meta && typeof meta === 'object') {
    const obj = meta as Record<string, any>;
    return {
      username: typeof obj.username === 'string' ? obj.username : undefined,
      email_verified: Boolean(obj.email_verified),
      role: typeof obj.role === 'string' ? obj.role : undefined,
    };
  }
  return {};
}


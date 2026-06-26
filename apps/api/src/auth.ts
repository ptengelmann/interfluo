import { createClerkClient, verifyToken, type ClerkClient } from '@clerk/backend';
import type { Context, MiddlewareHandler } from 'hono';
import { ApiError } from './errors';

export interface AuthIdentity {
  userId: string;
  firmId: string;
  orgRole: string | null;
  isPersonalWorkspace: boolean;
}

declare module 'hono' {
  interface ContextVariableMap {
    auth: AuthIdentity;
  }
}

export function createClerk(secretKey: string): ClerkClient {
  return createClerkClient({ secretKey });
}

export function authMiddleware(secretKey: string): MiddlewareHandler {
  return async (c, next) => {
    const header = c.req.header('Authorization');
    if (!header?.startsWith('Bearer ')) {
      throw new ApiError('unauthenticated', 'Sign in required', 401);
    }
    const token = header.slice('Bearer '.length);

    let payload: Awaited<ReturnType<typeof verifyToken>>;
    try {
      payload = await verifyToken(token, { secretKey });
    } catch (err) {
      throw new ApiError(
        'invalid_token',
        err instanceof Error ? err.message : 'Invalid Clerk session token',
        401,
      );
    }

    const userId = payload.sub;
    const orgId = (payload as { org_id?: string }).org_id ?? null;
    const orgRole = (payload as { org_role?: string }).org_role ?? null;

    if (!orgId) {
      throw new ApiError(
        'organization_required',
        'Pick or create an organisation in Interfluo before continuing.',
        403,
      );
    }

    c.set('auth', {
      userId,
      firmId: orgId,
      orgRole,
      isPersonalWorkspace: false,
    });

    await next();
  };
}

export function getAuth(c: Context): AuthIdentity {
  const auth = c.get('auth');
  if (!auth) {
    throw new ApiError('unauthenticated', 'Sign in required', 401);
  }
  return auth;
}

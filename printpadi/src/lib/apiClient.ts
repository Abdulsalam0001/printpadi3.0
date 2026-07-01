// ============================================================
// PrintPadi – API Client
// Exact port of shared/api/client.ts + shared/api/auth.ts
// process.env.NEXT_PUBLIC_* → import.meta.env.VITE_*
// ============================================================

// ── Config ────────────────────────────────────────────────────

/** Strips trailing slashes, same as normalizeApiOrigin() */
function normalizeApiOrigin(raw: string): string {
  return raw.replace(/\/+$/, '');
}

export function getApiBaseUrl(): string {
  const raw = import.meta.env['VITE_API_BASE_URL'] as string | undefined;
  if (!raw?.trim()) {
    // During development fallback to empty (relative URLs)
    return '';
  }
  return normalizeApiOrigin(raw);
}

// ── Error class (exact copy of ApiError) ─────────────────────

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// ── Generic client (mirrors apiClient in shared/api/client.ts) ─

export const apiClient = {
  async get<T>(path: string): Promise<T> {
    const url = `${getApiBaseUrl()}${path.startsWith('/') ? path : `/${path}`}`;
    const response = await fetch(url, {
      headers:     { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    const json = await response.json();
    if (!response.ok) {
      throw new ApiError(json.message || 'Request failed', json.error);
    }
    return json as T;
  },
};

// ── Auth (mirrors shared/api/auth.ts exactly) ────────────────

export type AuthUser = {
  id:    string;
  email: string;
  name:  string;
  role:  string;
};

type MeSuccessBody = {
  status: 'success';
  data: { user: AuthUser };
};

type ErrorBody = {
  status?:  string;
  message?: string;
};

const meUrl    = () => `${getApiBaseUrl()}/api/auth/me`;
const logoutUrl = () => `${getApiBaseUrl()}/api/auth/logout`;

export const getGoogleOAuthStartUrl = () =>
  `${getApiBaseUrl()}/api/auth/google`;

export async function fetchAuthMe(): Promise<AuthUser> {
  const response = await fetch(meUrl(), {
    method:      'GET',
    credentials: 'include',
    headers:     { Accept: 'application/json' },
  });

  let body: unknown;
  try { body = await response.json(); } catch {
    throw new Error('Invalid response from server.');
  }

  if (!response.ok) {
    throw new Error((body as ErrorBody).message || 'Not authenticated.');
  }

  const data = body as MeSuccessBody;
  if (data.status !== 'success' || !data.data?.user) {
    throw new Error('Unexpected response from server.');
  }
  return data.data.user;
}

/** Returns user or null — never throws on 401. Exact copy. */
export async function fetchAuthMeOptional(): Promise<AuthUser | null> {
  try {
    const response = await fetch(meUrl(), {
      method:      'GET',
      credentials: 'include',
      headers:     { Accept: 'application/json' },
    });
    let body: unknown;
    try { body = await response.json(); } catch { return null; }
    if (!response.ok) return null;
    const data = body as MeSuccessBody;
    if (data.status !== 'success' || !data.data?.user) return null;
    return data.data.user;
  } catch {
    return null;
  }
}

export async function postAuthLogout(): Promise<void> {
  const response = await fetch(logoutUrl(), {
    method:      'POST',
    credentials: 'include',
    headers:     { Accept: 'application/json' },
  });
  let body: unknown;
  try { body = await response.json(); } catch {
    throw new Error('Invalid response from server.');
  }
  if (!response.ok) {
    throw new Error((body as ErrorBody).message || 'Sign out failed.');
  }
  const data = body as { status?: string };
  if (data.status !== 'success') {
    throw new Error('Unexpected response from server.');
  }
}

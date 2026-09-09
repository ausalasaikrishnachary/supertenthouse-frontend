type TokenPayload = { role?: string; exp?: number };

const readTokenPayload = (token: string): TokenPayload | null => {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
};

export const clearAuthSession = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('role');
};

// This is a client-side navigation guard only. The backend remains the source of
// authorization truth by validating the signature and role for every request.
export const hasAdminSession = (): boolean => {
  const token = localStorage.getItem('token');
  if (!token || localStorage.getItem('role') !== 'admin') return false;

  const payload = readTokenPayload(token);
  if (!payload || payload.role !== 'admin') return false;
  return !payload.exp || payload.exp * 1000 > Date.now();
};

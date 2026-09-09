import { afterEach, describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { clearAuthSession, hasAdminSession } from '../lib/adminSession';

const tokenFor = (payload: Record<string, unknown>) => {
  const header = btoa(JSON.stringify({ alg: 'none', typ: 'JWT' }));
  const body = btoa(JSON.stringify(payload));
  return `${header}.${body}.signature`;
};

afterEach(() => clearAuthSession());

describe('admin session guard', () => {
  it('accepts a current admin token and rejects a salesman or expired session', () => {
    localStorage.setItem('role', 'admin');
    localStorage.setItem('token', tokenFor({ role: 'admin', exp: Math.floor(Date.now() / 1000) + 60 }));
    expect(hasAdminSession()).toBe(true);

    localStorage.setItem('token', tokenFor({ role: 'salesman', exp: Math.floor(Date.now() / 1000) + 60 }));
    expect(hasAdminSession()).toBe(false);

    localStorage.setItem('token', tokenFor({ role: 'admin', exp: Math.floor(Date.now() / 1000) - 60 }));
    expect(hasAdminSession()).toBe(false);
  });

  it('clears every shared authentication key', () => {
    localStorage.setItem('token', 'token');
    localStorage.setItem('role', 'admin');
    localStorage.setItem('user', '{}');
    clearAuthSession();
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('role')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
  });

  it('protects the admin orders route and handles an authorization failure', () => {
    const app = readFileSync(resolve(__dirname, '../App.tsx'), 'utf8');
    const orders = readFileSync(resolve(__dirname, '../components/OrderList.tsx'), 'utf8');
    expect(app).toContain('<AdminProtectedRoute><OrdersList /></AdminProtectedRoute>');
    expect(orders).toContain('if (!hasAdminSession())');
    expect(orders).toContain('[401, 403].includes(error.response?.status)');
    expect(orders).toContain("navigate('/')");
  });
});

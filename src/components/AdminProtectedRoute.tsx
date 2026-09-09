import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';
import { clearAuthSession, hasAdminSession } from '@/lib/adminSession';

interface Props {
  children: ReactNode;
}

export default function AdminProtectedRoute({ children }: Props) {
  if (!hasAdminSession()) {
    clearAuthSession();
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

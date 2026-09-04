import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export default function SalesmanProtectedRoute({ children }: Props) {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token || role !== 'salesman') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

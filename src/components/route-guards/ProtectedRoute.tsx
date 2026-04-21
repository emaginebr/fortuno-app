import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from 'nauth-react';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

interface ProtectedRouteProps {
  redirectTo?: string;
}

/**
 * Guard de rota baseado em `nauth-react`.
 * Redireciona para /login quando não autenticado, preservando `state.from`.
 */
export const ProtectedRoute = ({ redirectTo = '/login' }: ProtectedRouteProps): JSX.Element => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingSpinner label="Carregando sessão..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location.pathname }} replace />;
  }

  return <Outlet />;
};

import { useAuth } from '@/providers/auth-provider';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <Outlet /> : <Navigate to="/user/sign-in" />;
};

export default ProtectedRoute;

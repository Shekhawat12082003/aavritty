import { Navigate } from 'react-router-dom';
import { useAdminAuthStore } from '@/store';

export default function AdminProtectedRoute({ children }) {
  const { isAdminAuthenticated } = useAdminAuthStore();
  console.log('AdminProtectedRoute - isAdminAuthenticated:', isAdminAuthenticated);

  if (!isAdminAuthenticated) {
    console.log('Redirecting to admin/login');
    return <Navigate to="/admin/login" replace />;
  }

  console.log('Rendering admin protected content');
  return children;
}

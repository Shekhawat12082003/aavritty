import { Navigate, Outlet } from 'react-router-dom';

export default function AdminProtectedRoute() {
  const adminToken = localStorage.getItem('adminToken');

  console.log('AdminProtectedRoute - adminToken:', adminToken ? 'exists' : 'missing');

  if (!adminToken) {
    console.log('Redirecting to /admin/login');
    return <Navigate to="/admin/login" replace />;
  }

  console.log('Rendering Outlet');
  return <Outlet />;
}

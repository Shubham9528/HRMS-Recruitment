import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
  // Read token from localStorage. 
  // In the future, this can be synced with Redux: useSelector((state) => state.auth.token)
  const token = localStorage.getItem('token');
  
  if (!token) {
    // If no token exists, immediately redirect to login
    return <Navigate to="/login" replace />;
  }
  
  // If token exists, render the child routes (e.g., AppLayout)
  return <Outlet />;
}

import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function GuestRoute() {
  const { token } = useSelector((state) => state.auth);

  // If the user is already authenticated, redirect them away from auth screens
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

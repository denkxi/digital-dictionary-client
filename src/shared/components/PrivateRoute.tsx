import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { JSX } from 'react';

export default function PrivateRoute({ children }: { children: JSX.Element }) {
  const token = useAppSelector((state) => state.auth.token);
  return token ? children : <Navigate to="/auth" />;
}

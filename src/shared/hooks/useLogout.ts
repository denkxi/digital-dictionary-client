import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../app/hooks';
import { logout } from '../../features/auth/slices/authSlice';
import { persistor } from '../../app/store';
import { resetStore } from '../../app/logoutActions';

export const useLogout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
      dispatch(logout());
      dispatch(resetStore());
      await persistor.purge();
      navigate('/');
    };

  return handleLogout;
};

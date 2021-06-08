import { authSlice } from './auth.slice';

export const auth = () => {
  localStorage.setItem('isAuth', 'true');
  return authSlice.actions.authorize();
};

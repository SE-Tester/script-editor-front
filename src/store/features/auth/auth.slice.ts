import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export const initialState: AuthState = {
  isAuth: false,
};

type AuthState = {
  isAuth: boolean;
};

export const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    authorize: (state: AuthState) => {
      state.isAuth = true;
    },
  },
});

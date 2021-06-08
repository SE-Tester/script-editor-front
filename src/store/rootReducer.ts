import { combineReducers } from 'redux';
import { authSlice } from './features/auth/auth.slice';
const rootReducer = combineReducers({ auth: authSlice.reducer });
export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;

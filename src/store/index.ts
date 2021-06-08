import { useDispatch } from 'react-redux';
import { AppDispatch } from './configureStore';

export const useTypedDispatch = () => useDispatch<AppDispatch>();

/* eslint-disable no-console */
import { loadState, saveState } from './util/stateLoader';
import { Action, applyMiddleware } from 'redux';
import { configureStore, ThunkAction } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import rootReducer, { RootState } from './rootReducer';

export const castRootState = (getState: any): RootState =>
  getState as RootState;
const loggerMiddleware = (store: any) => (next: any) => (action: Action) => {
  console.group(action.type);
  console.info('dispatching', action);
  const result = next(action);
  console.log('next state', store.getState());
  console.groupEnd();
  return result;
};

function setupStore() {
  const middlewares: any[] = [thunk];
  // Debug logs
  if (process.env.REACT_APP_DEBUG) {
    middlewares.push(loggerMiddleware);
  }

  const preloadedState = loadState();

  const enhancers = [
    applyMiddleware(thunk),

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  ];

  const store = configureStore({
    reducer: rootReducer,
    preloadedState: preloadedState,
    enhancers: enhancers,
  });
  store.subscribe(() => {
    // const { session, user } = store.getState();
    // saveState({
    //   session,
    //   user,
    // });
  });

  return store;
}

export const store = setupStore();

export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;
export type AppDispatch = typeof store.dispatch;

import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import {
  PRIVATE_MAIN_PAGE,
  UNAUTH_MAIN_PAGE,
  UNAUTH_PATHS,
  PRIVATE_PATHS,
} from 'config';
import { AppRouterProps } from './routerTypes';
import PrivateRoute from './components/PrivateRoute';
import UnAuthRoute from './components/UnAuthRoute';
import PublicRoutePage from './pages/PublicRoutePage';
import PrivateRoutePage from './pages/PrivateRoutePage';
import { useSelector } from 'react-redux';
import i18n from 'config/locale/i18n';
import { RootState } from 'store/rootReducer';

const AppRouter: React.FC<AppRouterProps> = () => {
  React.useEffect(() => {
    i18n.changeLanguage('ru');
  }, []);
  const isAuthenticated = Boolean(localStorage.getItem('isAuth'));
  return (
    <Switch>
      <Route
        exact
        path="/"
        render={() =>
          isAuthenticated ? (
            <Redirect to={UNAUTH_MAIN_PAGE} />
          ) : (
            <Redirect to={PRIVATE_MAIN_PAGE} />
          )
        }
      />
      {UNAUTH_PATHS.map((path) => (
        <UnAuthRoute
          key={path}
          path={path}
          component={PublicRoutePage}
          isAuth={isAuthenticated}
        />
      ))}
      {PRIVATE_PATHS.map((path) => (
        <PrivateRoute
          key={path}
          path={path}
          component={PrivateRoutePage}
          isAuth={isAuthenticated}
        />
      ))}
    </Switch>
  );
};
export default AppRouter;

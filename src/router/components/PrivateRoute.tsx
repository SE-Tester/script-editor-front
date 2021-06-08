import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { UNAUTH_MAIN_PAGE } from 'config';
import { PrivateRouteProps } from '../routerTypes';

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  component: Component,
  isAuth,
  ...rest
}: PrivateRouteProps) => (
  <Route
    {...rest}
    render={(props) =>
      isAuth ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: UNAUTH_MAIN_PAGE,
            state: { from: props.location },
          }}
        />
      )
    }
  />
);
export default PrivateRoute;

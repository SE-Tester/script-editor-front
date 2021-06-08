import React from 'react';

import { PRIVATE_MAIN_PAGE } from 'config';
import { Route, Redirect } from 'react-router-dom';
import { PrivateRouteProps } from '../routerTypes';

const UnAuthRoute: React.FC<PrivateRouteProps> = ({
  component: Component,
  isAuth,
  ...rest
}: PrivateRouteProps) => (
  <Route
    {...rest}
    render={(props) =>
      !isAuth ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: PRIVATE_MAIN_PAGE,
            state: { from: props.location },
          }}
        />
      )
    }
  />
);
export default UnAuthRoute;

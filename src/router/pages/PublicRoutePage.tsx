import React from 'react';
import { Route } from 'react-router-dom';
import { Switch } from 'react-router-dom';
import AuthPage from 'views/pages/auth/AuthPage';
function PublicRoutePage(): JSX.Element {
  return (
    <Switch>
      <Route path={'/auth/login'} component={AuthPage} />
    </Switch>
  );
}

export default PublicRoutePage;

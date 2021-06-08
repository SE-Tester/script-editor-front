import React, { Fragment } from 'react';

import { Switch, Route } from 'react-router-dom';
import NestedRoute from 'router/components/NestedRoute';
import {
  AutoScriptEditor,
  AutoscriptTable,
} from 'views/pages/autoscript/Autoscript';
import Schema from 'views/pages/schema';
import DashboardTemplate from 'views/templates/DashboardTemplate';
import HomePage from 'views/pages/home/HomePage';
const PrivateRoutePage: React.FC = (): JSX.Element => {
  return (
    <Switch>
      <NestedRoute path="/dashboard" component={DashboardTemplate}>
        {(path) => (
          <React.Fragment>
            <Route path={path + '/home'} component={HomePage} />
            <Route
              exact
              path={path + '/scripts/detail/:uuid'}
              component={AutoScriptEditor}
            />
            <Route exact path={path + '/scripts'} component={AutoscriptTable} />
            <Route path={path + '/schema'} component={Schema} />
          </React.Fragment>
        )}
      </NestedRoute>
    </Switch>
  );
};

export default PrivateRoutePage;

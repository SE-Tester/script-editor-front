import React from 'react';
import { Switch } from 'react-router-dom';

interface NestedRouteProps {
  path: string;
  component: React.ComponentType<any>;
  children: (path: string) => JSX.Element;
  baseProps?: any;
}

function NestedRoute({
  baseProps,
  path,
  children,
  component: Component,
}: NestedRouteProps) {
  return (
    <Component {...baseProps}>
      <Switch>{children && children(path)}</Switch>
    </Component>
  );
}

export default NestedRoute;

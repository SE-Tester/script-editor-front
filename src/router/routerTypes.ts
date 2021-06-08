import { RouteComponentProps, RouteProps } from 'react-router-dom';
import React from 'react';

export interface PrivateRouteProps extends RouteProps {
  component: React.ComponentType<RouteProps>;
  isAuth: boolean;
}
export interface AppRouterProps {
  state?: any;
}
export interface IRouteItem {
  Icon: JSX.Element;
  titleKey: string;
  link: string;
  id: string;
  MainComponent:
    | React.ComponentType<RouteComponentProps<any>>
    | React.ComponentType<any>;
  ChildComponent:
    | React.ComponentType<RouteComponentProps<any>>
    | React.ComponentType<any>;
}

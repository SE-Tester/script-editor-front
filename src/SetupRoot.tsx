import React from 'react';

import { Provider as ReduxStoreProvider } from 'react-redux';
import GlobalStyle from './theme/global';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import theme from './theme';
import { MuiThemeProvider } from '@material-ui/core';

import { I18nextProvider } from 'react-i18next';
import i18n from 'config/locale/i18n';
import { store } from './store/configureStore';
import { ThemeProvider } from 'styled-components';
import { ApolloProvider } from '@apollo/client';
import { graphqlStore } from 'schema';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const Root: React.ComponentType = ({
  children,
}: {
  children: React.ReactElement | JSX.Element;
}) => {
  return (
    <I18nextProvider i18n={i18n}>
      <ApolloProvider client={graphqlStore}>
        <ReduxStoreProvider store={store}>
          <MuiThemeProvider theme={theme}>
            <ThemeProvider theme={theme}>
              <MuiPickersUtilsProvider utils={MomentUtils}>
                <GlobalStyle />
                {children}
              </MuiPickersUtilsProvider>
            </ThemeProvider>
          </MuiThemeProvider>
        </ReduxStoreProvider>
      </ApolloProvider>
    </I18nextProvider>
  );
};
export default Root;

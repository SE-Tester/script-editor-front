import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';
import { Provider as ReduxStoreProvider } from 'react-redux';
import GlobalStyle from './theme/global';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import theme from './theme';
import { MuiThemeProvider } from '@material-ui/core';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './router/AppRouter';
import { I18nextProvider } from 'react-i18next';
import i18n from 'config/locale/i18n';
import { store } from './store/configureStore';
import { ThemeProvider } from 'styled-components';
import { ApolloProvider } from '@apollo/client';
import { graphqlStore } from 'schema';
import { SnackbarProvider } from 'notistack';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
const queryClient = new QueryClient();

ReactDOM.render(
  <QueryClientProvider client={queryClient}>
    <I18nextProvider i18n={i18n}>
      <ApolloProvider client={graphqlStore}>
        <ReduxStoreProvider store={store}>
          <SnackbarProvider maxSnack={3}>
            <MuiThemeProvider theme={theme}>
              <ThemeProvider theme={theme}>
                <MuiPickersUtilsProvider utils={MomentUtils}>
                  <BrowserRouter>
                    <GlobalStyle />
                    <AppRouter />
                  </BrowserRouter>
                </MuiPickersUtilsProvider>
              </ThemeProvider>
            </MuiThemeProvider>
          </SnackbarProvider>
        </ReduxStoreProvider>
      </ApolloProvider>
    </I18nextProvider>
  </QueryClientProvider>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

reportWebVitals();

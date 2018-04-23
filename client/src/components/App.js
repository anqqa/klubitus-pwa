// @flow
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import React from 'react';
import { Provider } from 'react-redux';
import { renderRoutes } from 'react-router-config';
import BrowserRouter from 'react-router-dom/BrowserRouter';

import AppFrame from './AppFrame';
import { routes } from './routes';
import store from '../store';
import theme from './theme';


export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <MuiThemeProvider theme={theme}>
          <AppFrame>{renderRoutes(routes)}</AppFrame>
        </MuiThemeProvider>
      </BrowserRouter>
    </Provider>
  );
}

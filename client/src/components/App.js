// @flow

import React from 'react';
import { Provider } from 'react-redux';
import { renderRoutes } from 'react-router-config';
import BrowserRouter from 'react-router-dom/BrowserRouter';

import AppShell from './AppShell';
import { routes } from './routes';
import store from '../store';


export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppShell>
          {renderRoutes(routes)}
        </AppShell>
      </BrowserRouter>
    </Provider>
  );
}

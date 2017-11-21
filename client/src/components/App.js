// @flow

import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';

import AppShell from './AppShell';
import { Routes } from './routes';
import store from '../store';


export default function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppShell>
          <Routes />
        </AppShell>
      </Router>
    </Provider>
  );
}

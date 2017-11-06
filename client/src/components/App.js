// @flow
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import AppShell from './AppShell';
import Welcome from '../pages/Welcome';
import Events from '../pages/Events';
import Forum from '../pages/Forum';
import configureStore from '../store';


const store = configureStore();

export default function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppShell>
          <div>
            <Route exact path="/" component={Welcome}/>
            <Route path="/events" component={Events}/>
            <Route path="/forum" component={Forum}/>
          </div>
        </AppShell>
      </Router>
    </Provider>
  );
}

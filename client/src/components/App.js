// @flow
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import AppShell from './AppShell';
import Welcome from '../pages/Welcome';
import Events from '../pages/Events';
import Event from '../pages/Event';
import Forum from '../pages/Forum';
import store from '../store';


export default function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppShell>
          <Route exact path="/" component={Welcome}/>
          <Route exact path="/events" component={Events}/>
          <Route path="/events/:id" component={Event}/>
          <Route path="/forum" component={Forum}/>
        </AppShell>
      </Router>
    </Provider>
  );
}

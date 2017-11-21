// @flow
import React from 'react';
import Loadable from 'react-loadable';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import AppShell from './AppShell';
import Loading from './Loading';
import store from '../store';

const Welcome = Loadable({ loader: () => import('../pages/Welcome'), loading: Loading });
const Events = Loadable({ loader: () => import('../pages/Events'), loading: Loading });
const Event = Loadable({ loader: () => import('../pages/Event'), loading: Loading });
const Forum = Loadable({ loader: () => import('../pages/Forum'), loading: Loading });

export default function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppShell>
          <Route exact path="/" component={Welcome}/>

          <Route exact path="/events" component={Events}/>
          <Switch>
            <Route path="/events/:year/week/:week" component={Events}/>
            <Route path="/events/:id" component={Event}/>
          </Switch>

          <Route path="/forum" component={Forum}/>
        </AppShell>
      </Router>
    </Provider>
  );
}

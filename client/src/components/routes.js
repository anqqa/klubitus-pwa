import React from 'react';
import Loadable from 'react-loadable';
import { Route, Switch } from 'react-router-dom';

import Loading from './Loading';


const Welcome = Loadable({ loader: () => import('../pages/Welcome'), loading: Loading });
const Events  = Loadable({ loader: () => import('../Events/Events'), loading: Loading });
const Event   = Loadable({ loader: () => import('../Events/Event'), loading: Loading });
const Forum   = Loadable({ loader: () => import('../pages/Forum'), loading: Loading });

export const Routes = () => (
  <Switch>
    <Route exact path="/" component={Welcome}/>

    <Route exact path="/events" component={Events}/>
    <Route path="/events/:year/week/:week" component={Events}/>
    <Route path="/events/:id" component={Event}/>

    <Route exact path="/forum" component={Forum}/>
  </Switch>
);


const DefaultMenu = Loadable({ loader: () => import('./MenuBar'), loading: Loading });
const EventsMenu  = Loadable({ loader: () => import('../Events/MenuBar'), loading: Loading });

export const AppBars = () => (
  <Switch>
    <Route path="/events" component={EventsMenu} />
    <Route component={DefaultMenu} />
  </Switch>
);

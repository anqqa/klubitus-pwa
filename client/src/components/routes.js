import Loadable from 'react-loadable';

import Loading from './Loading';


const Events   = Loadable({
  loader:  () => import(/* webpackChunkName: 'events' */'../Events/Events'),
  loading: Loading,
  modules: ['events'],
});
const Event    = Loadable({
  loader:  () => import(/* webpackChunkName: 'event' */'../Events/Event'),
  loading: Loading,
  modules: ['event'],
});
const Forum    = Loadable({
  loader:  () => import(/* webpackChunkName: 'forum' */'../pages/Forum'),
  loading: Loading,
  modules: ['forum'],
});
const Login    = Loadable({
  loader:  () => import(/* webpackChunkName: 'login' */'../Auth/Login'),
  loading: Loading,
  modules: ['login'],
});
const Password = Loadable({
  loader:  () => import(/* webpackChunkName: 'password' */'../Auth/Password'),
  loading: Loading,
  modules: ['password'],
});
const Profile  = Loadable({
  loader:  () => import(/* webpackChunkName: 'profile' */'../Users/Profile'),
  loading: Loading,
  modules: ['profile'],
});
const Register = Loadable({
  loader:  () => import(/* webpackChunkName: 'register' */'../Auth/Register'),
  loading: Loading,
  modules: ['register'],
});
const Welcome  = Loadable({
  loader:  () => import(/* webpackChunkName: 'welcome' */'../pages/Welcome'),
  loading: Loading,
  modules: ['welcome'],
});

export const routes = [
  { path: '/', component: Welcome, exact: true },
  { path: '/login', component: Login, exact: true },
  { path: '/register', component: Register, exact: true },
  { path: '/password', component: Password, exact: true },

  { path: '/user/:username', component: Profile },

  { path: '/events', component: Events, exact: true },
  { path: '/events/:year/week/:week', component: Events },
  { path: '/event/:id', component: Event },

  { path: '/forum', component: Forum, exact: true },
];


const DefaultMenu = Loadable({
  loader:  () => import(/* webpackChunkName: 'menu' */'./MenuBar'),
  loading: Loading,
  modules: ['menu'],
});
const EventsMenu  = Loadable({
  loader:  () => import(/* webpackChunkName: 'eventsmenu' */'../Events/MenuBar'),
  loading: Loading,
  modules: ['eventsmenu'],
});

export const appBars = [
  { path: '/events', component: EventsMenu },
  { path: '/event', component: EventsMenu },
  { component: DefaultMenu },
];

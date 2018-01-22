// @flow

import { bindWithDispatch } from 'feathers-redux';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import { feathersAuthentication, feathersServices } from '../feathers';
import middleware from './middleware';
import reducers from './reducers';


export type State = {

}

const initialState: State = {};

const store = createStore(
  combineReducers(reducers),
    initialState,
    composeWithDevTools(
      applyMiddleware(...middleware)
    )
);

// Autologin
if (localStorage['feathers-jwt']) {
  store.dispatch(feathersAuthentication.authenticate())
    .catch(err => {
      console.log('Authentication error');

      return err;
    });
}

export default store;


export const services = bindWithDispatch(store.dispatch, feathersServices);

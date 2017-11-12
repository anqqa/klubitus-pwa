// @flow

import { bindWithDispatch } from 'feathers-redux';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import { feathersServices } from '../feathers';
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

export default store;


export const services = bindWithDispatch(store.dispatch, feathersServices);

// @flow

import { applyMiddleware, combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import middleware from './middleware';
import reducers from './reducers';


export type State = {

}

export default function configureStore(initialState: State = {}) {
  return createStore(
    combineReducers(reducers),
    initialState,
    composeWithDevTools(
      applyMiddleware(...middleware)
    )
  );
}

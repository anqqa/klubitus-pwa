// @flow

import { reducer as formReducer } from 'redux-form';

import { feathersAuthentication, feathersServices } from '../feathers';


export default {
  auth:   feathersAuthentication.reducer,
  events: feathersServices.events.reducer,
  form:   formReducer,
  users:  feathersServices.users.reducer,
}

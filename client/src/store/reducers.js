// @flow

import { feathersAuthentication, feathersServices } from '../feathers';


export default {
  auth:   feathersAuthentication.reducer,
  events: feathersServices.events.reducer,
  users:  feathersServices.users.reducer,
}

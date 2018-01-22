// @flow

import feathers from 'feathers-client';
import reduxifyAuthentication from 'feathers-reduxify-authentication';
import reduxifyServices from 'feathers-redux';

import { API_BASE_URL } from '../utils/constants';
import { mapServicePathsToNames } from './services';


// Configure feathers client
const client = feathers();

client.configure(feathers.rest(API_BASE_URL).fetch(fetch));
client.configure(feathers.hooks());
client.configure(feathers.authentication({ storage: window.localStorage }));

export default client;


// Reduxify feathers authentication
export const feathersAuthentication = reduxifyAuthentication(client, {

});


// Reduxify feathers services
export const feathersServices = reduxifyServices(client, mapServicePathsToNames);

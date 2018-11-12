import cookie from 'cookie';

import { Actions } from './auth';


export const actions = {
  async nuxtServerInit({ dispatch }, { req }) {
    const cookies = cookie.parse(req.headers.cookie || '');

    if (cookies.hasOwnProperty('auth.token')) {
      this.$axios.setToken(cookies['auth.token'], 'Bearer');

      try {
        await dispatch(`auth/${Actions.ME}`)
      }
      catch (error) {
        console.log('Auto-login failed', error);
      }
    }
  },
};

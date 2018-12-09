import cookie from 'cookie';

import { Actions, Mutations } from './auth';


export const actions = {
  async nuxtServerInit({ commit, dispatch }, { req }) {
    const cookies = cookie.parse(req.headers.cookie || '');

    if (cookies.hasOwnProperty('auth.token')) {
      const token = cookies['auth.token'];

      commit(`auth/${Mutations.SET_TOKEN}`, token);

      this.$axios.setToken(token, 'Bearer');

      try {
        await dispatch(`auth/${Actions.ME}`)
      }
      catch (error) {
        console.log('Auto-login failed', error);
      }
    }
  },
};

import cookie from 'cookie';

export const actions = {
  async nuxtServerInit({ commit, dispatch }, { $axios, req }) {
    const cookies = cookie.parse(req.headers.cookie || '');

    if (cookies.hasOwnProperty('auth.token')) {
      const token = cookies['auth.token'];

      commit('auth/setToken', token);

      $axios.setToken(token, 'Bearer');

      try {
        await dispatch('auth/me');
      } catch (error) {}
    }
  },
};

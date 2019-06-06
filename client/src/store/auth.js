import cookies from 'js-cookie';

const EXPIRES = 30;

export const state = () => ({
  token: null,
  user: null,
});

export const actions = {
  async fbLogin({ commit, dispatch }, login) {
    const { token } = await this.$axios.$post('auth/facebook', login);
  },

  async login({ commit }, login) {
    const { token, user } = await this.$axios.$post('auth/login', login);

    commit('setToken', token);
    commit('setUser', user);

    this.$axios.setToken(token, 'Bearer');
    cookies.set('auth.token', token, { expires: EXPIRES });
  },

  async logout({ dispatch }) {
    try {
      await this.$axios.post('auth/logout');
    } catch (error) {}

    dispatch('reset');
  },

  async me({ commit }) {
    const user = await this.$axios.$get('auth/me');

    commit('setUser', user);
  },

  reset({ commit }) {
    commit('setToken', null);
    commit('setUser', null);

    this.$axios.setToken(false);
    cookies.remove('auth.token');
  },
};

export const getters = {
  isAuthenticated: state => !!state.user,
};

export const mutations = {
  setToken(store, token) {
    store.token = token;
  },

  setUser(store, data) {
    store.user = data;
  },
};

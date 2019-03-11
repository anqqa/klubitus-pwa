import cookies from 'js-cookie';

const EXPIRES = 30;

export const state = () => ({
  token: null,
  user: null,
});

export const actions = {
  async login({ commit, dispatch }, login) {
    const { token } = await this.$axios.$post('auth/login', login);

    commit('setToken', token);

    this.$axios.setToken(token, 'Bearer');
    cookies.set('auth.token', token, { expires: EXPIRES });

    dispatch('me');
  },

  async logout({ dispatch }) {
    dispatch('reset');

    await this.$axios.post('auth/logout');
  },

  async me({ commit }) {
    const { data: user } = await this.$axios.$get('auth/me');

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
  isAuthenticated: state => {
    return !!state.user;
  },
};

export const mutations = {
  setToken(store, token) {
    store.token = token;
  },

  setUser(store, data) {
    store.user = data;
  },
};

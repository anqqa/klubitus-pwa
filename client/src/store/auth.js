import cookies from 'js-cookie';

const EXPIRES = 30;

export const state = () => ({
  facebook: null,
  token: null,
  user: null,
});

export const actions = {
  async fbLogin({ commit }, login) {
    const { email, existing, name, user, token } = await this.$axios.$post('auth/facebook', login);

    commit('setFacebook', {
      token: login.access_token,
      userId: login.external_user_id,
      email,
      name,
    });

    // Successful login?
    if (user && token) {
      commit('setToken', token);
      commit('setUser', user);

      this.$axios.setToken(token, 'Bearer');
      cookies.set('auth.token', token, { expires: EXPIRES });
    }

    return { email, existing, name };
  },

  async login(
    {
      commit,
      // state: { facebook },
    },
    login
  ) {
    const { token, user } = await this.$axios.$post('auth/login', login);

    commit('setToken', token);
    commit('setUser', user);

    this.$axios.setToken(token, 'Bearer');
    cookies.set('auth.token', token, { expires: EXPIRES });

    // Connect Facebook after login?
    // if (facebook && facebook.token && facebook.userId) {
    //   const { token: access_token, userId: external_user_id } = facebook;
    //
    //   try {
    //     await this.$axios.$post('auth/facebook', { access_token, external_user_id })
    //   } catch (error) {}
    // }
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
    commit('reset');

    this.$axios.setToken(false);
    cookies.remove('auth.token');
  },
};

export const getters = {
  isAuthenticated: state => !!state.user,
};

export const mutations = {
  reset(store) {
    store.facebook = null;
    store.token = null;
    store.user = null;
  },

  setFacebook(store, facebook) {
    store.facebook = facebook;
  },

  setToken(store, token) {
    store.token = token;
  },

  setUser(store, data) {
    store.user = data;
  },
};

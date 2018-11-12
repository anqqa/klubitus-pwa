import cookies from 'js-cookie';


const EXPIRES = 30;

export const Actions = {
  ME:     'me',
  LOGOUT: 'logout',
  LOGIN:  'login',
  RESET:  'reset',
};

export const Getters = {
  isAuthenticated: 'isAuthenticated',
};

export const Mutations = {
  RESET_USER: 'resetUser',
  SET_USER:   'setUser',
};


export const state = () => ({
  user:  null,
});


export const actions = {
  async [Actions.LOGIN]({ dispatch }, login) {
    const { token } = await this.$axios.$post('auth/login', login);

    this.$axios.setToken(token, 'Bearer');
    cookies.set('auth.token', token, { expires: EXPIRES });

    dispatch(Actions.ME)
  },

  async [Actions.LOGOUT]({ dispatch }) {
    dispatch(Actions.RESET);

    await this.$axios.post('auth/logout');
  },

  async [Actions.ME]({ commit }) {
    const { data: user } = await this.$axios.$get('auth/me');

    commit(Mutations.SET_USER, user);
  },

  [Actions.RESET]({ commit }) {
    commit(Mutations.RESET_USER);

    this.$axios.setToken(false);
    cookies.remove('auth.token');
  },
};


export const getters = {
  [Getters.isAuthenticated]: state => {
    return !!state.user;
  },
};


export const mutations = {
  [Mutations.RESET_USER](store) {
    store.user = null;
  },

  [Mutations.SET_USER](store, data) {
    store.user = data;
  },
};

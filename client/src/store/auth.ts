import cookies from 'js-cookie';
import { namespace } from 'nuxt-property-decorator';
import { ActionContext, ActionTree, GetterTree, MutationTree } from 'vuex';

const EXPIRES = 30;

interface FacebookState {
  email?: string;
  name?: string;
  token?: string;
  userId?: number;
}

export interface UserState {
  avatar_url?: string;
  id: number;
  username: string;
}

export interface AuthState {
  facebook: FacebookState | null;
  token: string | null;
  user: UserState | null;
}

export const state = (): AuthState => ({
  facebook: null,
  token: null,
  user: null,
});

export interface FBLoginPayload {
  access_token: string;
  external_user_id: string;
}

export interface FBLoginResponse {
  email?: string;
  is_new_user?: boolean;
  name?: string;
}

export interface LoginPayload {
  connect_facebook?: boolean;
  password: string;
  username: string;
}

export interface RegisterPayload extends LoginPayload {
  email: string;
}

interface AuthActionContext extends ActionContext<AuthState, any> {}

export const Actions = {
  FB_LOGIN: 'fbLogin',
  LOGIN: 'login',
  LOGOUT: 'logout',
  ME: 'me',
  REGISTER: 'register',
  RESET: 'reset',
};

export const actions: ActionTree<AuthState, any> = {
  async [Actions.FB_LOGIN](
    { commit }: AuthActionContext,
    payload: FBLoginPayload
  ): Promise<FBLoginResponse> {
    const { email, is_new_user, name, user, token } = await this.$axios.$post(
      'auth/facebook',
      payload
    );

    commit(Mutations.SET_FACEBOOK, {
      token: payload.access_token,
      userId: payload.external_user_id,
      email,
      name,
    });

    // Successful login?
    if (user && token) {
      commit(Mutations.SET_TOKEN, token);
      commit(Mutations.SET_USER, user);

      this.$axios.setToken(token, 'Bearer');
      cookies.set('auth.token', token, { expires: EXPIRES });
    }

    return { email, is_new_user, name };
  },

  async [Actions.LOGIN](
    { commit, state: { facebook } }: AuthActionContext,
    payload: LoginPayload
  ): Promise<void> {
    const { connect_facebook, ...rest } = payload;
    const { token, user } = await this.$axios.$post('auth/login', rest);

    commit(Mutations.SET_TOKEN, token);
    commit(Mutations.SET_USER, user);

    this.$axios.setToken(token, 'Bearer');
    cookies.set('auth.token', token, { expires: EXPIRES });

    // Connect Facebook after login?
    if (connect_facebook && facebook) {
      try {
        // tslint:disable-next-line:variable-name
        const { token: access_token, userId: external_user_id } = facebook;

        await this.$axios.$post('auth/facebook', { access_token, external_user_id });
      } catch (error) {}
    }
  },

  async [Actions.LOGOUT]({ dispatch }: AuthActionContext): Promise<void> {
    try {
      await this.$axios.post('auth/logout');
    } catch (error) {}

    await dispatch(Actions.RESET);
  },

  async [Actions.ME]({ commit }: AuthActionContext): Promise<void> {
    const user = await this.$axios.$get('auth/me');

    commit(Mutations.SET_USER, user);
  },

  async [Actions.REGISTER](
    { commit, state: { facebook } }: AuthActionContext,
    payload: RegisterPayload
  ): Promise<void> {
    const { connect_facebook, ...rest } = payload;
    const { token, user } = await this.$axios.$post('users', rest);

    commit(Mutations.SET_TOKEN, token);
    commit(Mutations.SET_USER, user);

    this.$axios.setToken(token, 'Bearer');
    cookies.set('auth.token', token, { expires: EXPIRES });

    // Connect Facebook after registering?
    if (connect_facebook && facebook) {
      try {
        // tslint:disable-next-line:variable-name
        const { token: access_token, userId: external_user_id } = facebook;

        await this.$axios.$post('auth/facebook', { access_token, external_user_id });
      } catch (error) {}
    }
  },

  [Actions.RESET]({ commit }: AuthActionContext): void {
    commit(Mutations.RESET);

    this.$axios.setToken(false);
    cookies.remove('auth.token');
  },
};

export const getters: GetterTree<AuthState, any> = {
  isAuthenticated: (store): boolean => !!store.user,
  userId: (store): number | null => store.user && store.user.id,
};

export const Mutations = {
  RESET: 'reset',
  SET_FACEBOOK: 'setFacebook',
  SET_TOKEN: 'setToken',
  SET_USER: 'setUser',
};

export const mutations: MutationTree<AuthState> = {
  [Mutations.RESET](store: AuthState): void {
    store.facebook = null;
    store.token = null;
    store.user = null;
  },

  [Mutations.SET_FACEBOOK](store: AuthState, facebook: FacebookState | null): void {
    store.facebook = facebook;
  },

  [Mutations.SET_TOKEN](store: AuthState, token: string | null): void {
    store.token = token;
  },

  [Mutations.SET_USER](store: AuthState, data: UserState | null): void {
    store.user = data;
  },
};

export const authStore = namespace('auth/');

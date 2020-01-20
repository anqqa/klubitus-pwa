import { namespace } from 'nuxt-property-decorator';
import { GetterTree, MutationTree } from 'vuex';

export type Theme = 'dark' | 'light';

export interface UIState {
  error: string | null;
  errors: Record<string, string[]>;
  sidebar: boolean | null;
  theme: Theme;
}

export const state = (): UIState => ({
  error: null,
  errors: {},
  sidebar: null,
  theme: 'dark',
});

export const enum Getters {
  ERRORS_FOR_FIELD = 'errorsForField',
  IS_DARK_THEME = 'isDarkTheme',
}

export const getters: GetterTree<UIState, any> = {
  [Getters.ERRORS_FOR_FIELD]: store => (field: string) => store.errors[field],
  [Getters.IS_DARK_THEME]: store => store.theme === 'dark',
};

export const enum Mutations {
  CLEAR_ERRORS = 'clearErrors',
  SET_ERROR = 'setError',
  SET_ERRORS = 'setErrors',
  TOGGLE_SIDEBAR = 'toggleSidebar',
  TOGGLE_THEME = 'toggleTheme',
}

export const mutations: MutationTree<UIState> = {
  [Mutations.CLEAR_ERRORS]: store => {
    store.error = null;
    store.errors = {};
  },

  [Mutations.SET_ERROR]: (store, error: string | null) => (store.error = error),

  [Mutations.SET_ERRORS]: (store, errors: Record<string, string[]>) => (store.errors = errors),

  [Mutations.TOGGLE_SIDEBAR]: (store, sidebar: boolean | null = null) =>
    (store.sidebar = typeof sidebar === 'boolean' ? sidebar : !store.sidebar),

  [Mutations.TOGGLE_THEME]: store => (store.theme = store.theme === 'dark' ? 'light' : 'dark'),
};

export const NAMESPACE = 'ui/';
export const uiStore = namespace(NAMESPACE);

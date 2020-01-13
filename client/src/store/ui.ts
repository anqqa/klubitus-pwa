import { namespace } from 'nuxt-property-decorator';
import { GetterTree, MutationTree } from 'vuex';

export type Theme = 'dark' | 'light';

export interface UIState {
  error: string | null;
  sidebar: boolean | null;
  theme: Theme;
}

export const state = (): UIState => ({
  error: null,
  sidebar: null,
  theme: 'dark',
});

export const enum Getters {
  IS_DARK_THEME = 'isDarkTheme',
}

export const getters: GetterTree<UIState, any> = {
  [Getters.IS_DARK_THEME]: (store: UIState): boolean => store.theme === 'dark',
};

export const enum Mutations {
  SET_ERROR = 'setError',
  TOGGLE_SIDEBAR = 'toggleSidebar',
  TOGGLE_THEME = 'toggleTheme',
}

export const mutations: MutationTree<UIState> = {
  [Mutations.SET_ERROR](store: UIState, error: string | null) {
    store.error = error;
  },

  [Mutations.TOGGLE_SIDEBAR](store: UIState, sidebar: boolean | null = null): void {
    store.sidebar = typeof sidebar === 'boolean' ? sidebar : !store.sidebar;
  },

  [Mutations.TOGGLE_THEME](store: UIState): void {
    store.theme = store.theme === 'dark' ? 'light' : 'dark';
  },
};

export const NAMESPACE = 'ui/';
export const uiStore = namespace(NAMESPACE);

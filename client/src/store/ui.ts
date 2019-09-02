import { namespace } from 'nuxt-property-decorator';
import { GetterTree, MutationTree } from 'vuex';

export type Theme = 'dark' | 'light';

export interface UIState {
  sidebar: boolean | null;
  theme: Theme;
}

export const state = (): UIState => ({
  sidebar: null,
  theme: 'dark',
});

export const getters: GetterTree<UIState, any> = {
  isDarkTheme: (store: UIState): boolean => store.theme === 'dark',
};

export const mutations: MutationTree<UIState> = {
  toggleSidebar(store: UIState, sidebar: boolean | null = null): void {
    store.sidebar = typeof sidebar === 'boolean' ? sidebar : !store.sidebar;
  },

  toggleTheme(store: UIState): void {
    store.theme = store.theme === 'dark' ? 'light' : 'dark';
  },
};

export const uiStore = namespace('ui/');

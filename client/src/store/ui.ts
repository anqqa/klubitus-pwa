import { namespace } from 'nuxt-property-decorator';
import { MutationTree } from 'vuex';

export type Theme = 'dark' | 'light';

export interface UIState {
  sidebar: boolean | null;
  theme: Theme;
}

export const state = (): UIState => ({
  sidebar: null,
  theme: 'dark',
});

export const mutations: MutationTree<UIState> = {
  toggleSidebar(store: UIState, sidebar: boolean): void {
    store.sidebar = sidebar;
  },

  toggleTheme(store: UIState): void {
    store.theme = store.theme === 'dark' ? 'light' : 'dark';
  },
};

export const uiStore = namespace('ui/');

import { namespace } from 'nuxt-property-decorator';
import { GetterTree, MutationTree } from 'vuex';

export type Theme = 'dark' | 'light';

export interface UIState {
  theme: Theme;
}

export const state = (): UIState => ({
  theme: 'dark',
});

export const getters: GetterTree<UIState, any> = {
  isThemeDark: (store: UIState): boolean => store.theme === 'dark',
};

export const mutations: MutationTree<UIState> = {
  toggleTheme(store: UIState): void {
    store.theme = store.theme === 'dark' ? 'light' : 'dark';
  },
};

export const uiStore = namespace('ui/');

export const state = () => ({
  sidebar: true,
  theme:   'dark',
});

export const mutations = {
  toggleSidebar (state) {
    state.sidebar = !state.sidebar;
  },

  toggleTheme (state, theme) {
    if (theme) {
      state.theme = theme;
    }
    else {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
    }
  },
};

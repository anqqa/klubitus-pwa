export const state = () => ({
  sidebar: true
});

export const mutations = {
  toggleSidebar (state) {
    state.sidebar = !state.sidebar
  }
};

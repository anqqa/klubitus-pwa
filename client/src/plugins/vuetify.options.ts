import colors from 'vuetify/es5/util/colors';

export default ({ app }) => ({
  lang: { t: (key, ...params) => app.i18n.t(key, params) },
  theme: {
    dark: true,
    themes: {
      dark: {
        // anchor: '#1db3cc',
        accent: '#ffd500',
        primary: '#ff3d99',
      },
      light: {
        // anchor: '#229eb3',
        accent: '#ffd500',
        primary: '#ff3d99',
      },
    },
  },
});

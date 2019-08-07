import colors from 'vuetify/es5/util/colors';

export default ({ app }) => ({
  lang: { t: (key, ...params) => app.i18n.t(key, params) },
  theme: {
    dark: true,
    themes: {
      dark: {
        anchor: colors.lightBlue.base,
        primary: colors.pink.base,
      },
      light: {},
    },
  },
});

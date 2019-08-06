export default ({ app }) => ({
  lang: {
    t: (key, ...params) => app.i18n.t(key, params),
  },
});

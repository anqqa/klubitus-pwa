module.exports = {
  parserOptions: {
    project: ['tsconfig.json'],
    extraFileExtensions: ['.vue']
  },

  extends: [
    '@nuxtjs/eslint-config-typescript',
    '@vue/prettier',
    '@vue/prettier/@typescript-eslint'
  ],

  rules: {
    // Remove this after it doesn't cause a crash
    'no-useless-constructor': 'off'
  },
};

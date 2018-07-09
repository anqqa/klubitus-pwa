module.exports = {
  root:          true,
  parserOptions: { parser: 'babel-eslint' },
  env:           {
    browser: true,
    node:    true
  },
  extends:       ['eslint:recommended', 'plugin:vue/recommended'],
  // required to lint *.vue files
  plugins:       ['vue'],
  // add your custom rules here
  rules:         {
    'vue/max-attributes-per-line': 'off',
  },
  globals:       {}
};

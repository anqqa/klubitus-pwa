module.exports = {
  parserOptions: { parser: 'babel-eslint' },
  env: {
    es6: true,
    node: true,
  },
  extends: ['plugin:vue/recommended', 'prettier/vue'],
  // add your custom rules here
  plugins: ['vue'],
  rules: {
    'vue/html-closing-bracket-newline': 'off',
    'vue/max-attributes-per-line': 'off',
    'vue/multiline-html-element-content-newline': 'off',
    'vue/singleline-html-element-content-newline': 'off',
  },
};

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
    'vue/component-name-in-template-casing': ['error', 'kebab-case'],
    'vue/html-closing-bracket-newline': ['error', { multiline: 'never' }],
    'vue/max-attributes-per-line': [
      'error',
      { singleline: 5, multiline: { allowFirstLine: true } },
    ],
    'vue/multiline-html-element-content-newline': 'off',
    'vue/singleline-html-element-content-newline': 'off',
  },
};

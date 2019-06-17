module.exports = {
  parserOptions: { parser: '@typescript-eslint' },
  // env: {
  //   es6: true,
  //   node: true,
  // },
  extends: ['@nuxtjs', 'prettier/vue'],
  // add your custom rules here
  plugins: ['@typescript-eslint'],
  root: true,
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    // 'no-empty': ['error', { allowEmptyCatch: true }],
    // 'vue/component-name-in-template-casing': ['error', 'kebab-case'],
    // 'vue/html-closing-bracket-newline': ['error', { singleline: 'never', multiline: 'never' }],
    // 'vue/max-attributes-per-line': ['error', { singleline: 5, multiline: 1 }],
    // 'vue/multiline-html-element-content-newline': 'off',
    // 'vue/singleline-html-element-content-newline': 'off',
  },
};

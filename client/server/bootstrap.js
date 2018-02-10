process.env.NODE_ENV = 'development';

require('ignore-styles');
require('babel-register')({
  ignore:  [/(node_modules)/],
  plugins: ['syntax-dynamic-import', 'dynamic-import-node', 'react-loadable/babel'],
  presets: ['es2015', 'react-app'],

});
require('./index');

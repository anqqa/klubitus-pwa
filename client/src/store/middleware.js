// @flow

import reduxThunk from 'redux-thunk';
import reduxPromise from 'redux-promise-middleware';

export default [
  reduxThunk,
  reduxPromise(),
];

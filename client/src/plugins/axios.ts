import cookies from 'js-cookie';

import { BaseModel } from '@/models/BaseModel';
import { Mutations, NAMESPACE } from '@/store/ui';

let checkToken = true;

export default ({ $axios, route, store: { commit } }) => {
  BaseModel.$http = $axios;

  $axios.onError(error => {
    const code = parseInt(error.response && error.response.status, 10);

    // Set form errors
    const { errors, message } = error.response?.data || {};

    commit(NAMESPACE + Mutations.SET_ERROR, message || 'Error happens');
    commit(NAMESPACE + Mutations.SET_ERRORS, errors || {});

    // Remove auth information on Unauthorized
    if ([401, 403].includes(code) && !route.name.match(/login|password|register/)) {
      // app.$auth.logout();
      // app.$auth.setToken('local', undefined);
      // redirect(app.localePath('login'));
    }

    // Return error on form fails (Bad Request)
    if (code === 400) {
      return;
    }

    // Silently ignore
    return true;
  });

  $axios.onRequest(() => {
    if (checkToken) {
      checkToken = false;

      const token = cookies.get('auth.token');

      if (token) {
        $axios.setToken(token, 'Bearer');
      }
    }
  });
};

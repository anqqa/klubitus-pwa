import cookies from 'js-cookie';

import { BaseModel } from '@/models/BaseModel';

let checkToken = true;

export default ({ $axios, route }) => {
  BaseModel.$http = $axios;

  $axios.onError(error => {
    const code = parseInt(error.response && error.response.status, 10);

    // Remove auth information on Unauthorized
    if ([401, 403].includes(code) && !route.name.match(/login|password|register/)) {
      // app.$auth.logout();
      // app.$auth.setToken('local', undefined);
      // redirect(app.localePath('login'));
    }
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

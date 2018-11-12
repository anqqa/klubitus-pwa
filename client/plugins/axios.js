export default ({ app, $axios, route, redirect }) => {
  $axios.onError(error => {
    const code = parseInt(error.response && error.response.status);

    // Remove auth information on Unauthorized
    if ([401, 403].includes(code) && !route.name.match(/login|password|register/)) {
      // app.$auth.logout();
      // app.$auth.setToken('local', undefined);

      // redirect(app.localePath('login'));
    }
  });
};

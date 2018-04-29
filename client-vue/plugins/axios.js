export default ({ app, $axios, route, redirect }) => {
  $axios.onError(error => {
    const code = parseInt(error.response && error.response.status);

    // Remove auth information on Unauthorized
    if (code === 401 && !route.name.match(/login|password|register/)) {
      $axios.setToken(false);
      app.$auth.reset();

      redirect(app.localePath('login'));
    }
  });
};

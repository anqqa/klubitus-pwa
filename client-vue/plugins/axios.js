export default ({ app, $axios, redirect }) => {
  $axios.onError(error => {
    const code = parseInt(error.response && error.response.status);

    console.log(error);

    // Remove auth information on Unauthorized
    if (code === 401) {
      $axios.setToken(false);
      app.$auth.reset();

      redirect('/login');
    }
  });
};

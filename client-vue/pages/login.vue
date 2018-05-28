<template>
  <main class="column">

    <section class="card">
      <div class="card-header">
        <span class="card-header-title">Login</span>
      </div>

      <form class="card-content">
        <button class="button is-outlined">
          <span class="icon"><i class="fab fa-facebook-square" /></span>
          Login with Facebook
        </button>

        <span class="separator">or</span>

        <b-field :type="!!formError && 'is-danger'" label="Email or username">
          <b-input :value="username"
                   icon-pack="far"
                   icon="fa-user"
                   name="username"
                   required
                   type="text" />
        </b-field>

        <b-field :type="!!formError && 'is-danger'" label="Password">
          <b-input icon-pack="fas"
                   icon="fa-key"
                   name="password"
                   required
                   type="password" />
        </b-field>

        <button class="button is-primary" type="submit">Login</button>
      </form>

      <div class="card-footer">
        <nuxt-link :to="localePath('password')">Forgot password?</nuxt-link>
        <nuxt-link :to="localePath('register')">Register</nuxt-link>
      </div>
    </section>

  </main>
</template>

<script>
  import get from 'lodash/get';

  export default {

    data: () => ({
      formError: null,
      valid:     true,

      username: '',
      usernameRules: [
        v => !!v || 'Please fill in',
      ],
      password: '',
      passwordRules: [
        v => !!v || 'Please fill in',
      ]
    }),

    methods: {
      async login() {
        if (!this.$refs.form.validate()) {
          return;
        }

        try {
          await this.$auth.login({
            data: {
              username: this.username,
              password: this.password,
            }
          });

          this.formError = null;
          this.username  = '';
          this.password  = '';
        }
        catch (error) {
          this.formError = get(error, 'response.data.message', 'Nope');
        }
      },
    },

  };
</script>

<style scoped>
  section.card {
    max-width: 300px;
  }
</style>

<template>
  <main class="is-center">

    <section class="card">
      <header>
        <h1 class="h3">Login</h1>
      </header>

      <form class="card-content">
        <button class="button is-full is-outlined">
          <span class="icon"><i class="bx bx-facebook" /></span>
          Login with Facebook
        </button>

        <span class="separator">or</span>

        <div :class="!!formError && 'has-error'" class="field">
          <label for="input-username">Email or username</label>
          <div class="control has-icon-left">
            <input id="input-username"
                   :value="username"
                   name="username"
                   required
                   type="text">
            <span class="icon"><i class="bx bx-user" /></span>
          </div>
          <p v-if="!!formError" class="help" v-html="formError" />
        </div>

        <div :class="!!formError && 'has-error'" class="field">
          <label for="input-password">Password</label>
          <div class="control has-icon-left">
            <input id="input-password"
                   name="password"
                   required
                   type="password">
            <span class="icon"><i class="bx bx-lock" /></span>
          </div>
          <p v-if="!!formError" class="help" v-html="formError" />
        </div>

        <button class="button is-primary is-full" type="submit">Login</button>
      </form>

      <footer>
        <nuxt-link :to="localePath('password')">Forgot password</nuxt-link>
        <nuxt-link :to="localePath('register')">Register</nuxt-link>
      </footer>
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
  .card {
    max-width: 300px;
    width: 100%;
  }
</style>

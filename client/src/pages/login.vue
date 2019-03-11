<template>
  <main class="is-center">
    <section class="card">
      <header>
        <h1 class="h3">Login</h1>
      </header>

      <form class="card-content" @submit.prevent="login">
        <no-ssr>
          <fb-login :params="fbParams" @success="onFbSuccess" @error="onFbError"></fb-login>
          <button slot="placeholder" class="button fb is-full" disabled>
            <i class="bx bx-loader-alt bx-spin" /> Just a moment...
          </button>
        </no-ssr>

        <span class="separator">or</span>

        <div :class="{ 'has-error': error || $v.username.$error }" class="field">
          <label for="input-username">Email or username *</label>
          <div class="control has-icon-left">
            <input
              id="input-username"
              v-model.trim="$v.username.$model"
              name="username"
              required
              type="text"
            />
            <span class="icon"><i class="bx bx-user"/></span>
          </div>
          <p v-if="$v.username.$error && !$v.username.required" class="help">Please fill in</p>
        </div>

        <div :class="{ 'has-error': error || $v.password.$error }" class="field">
          <label for="input-password">Password *</label>
          <div class="control has-icon-left">
            <input
              id="input-password"
              v-model.trim="$v.password.$model"
              name="password"
              required
              type="password"
            />
            <span class="icon"><i class="bx bx-lock"/></span>
          </div>
          <p v-if="$v.password.$error && !$v.password.required" class="help">Please fill in</p>
        </div>

        <div v-if="error" class="field has-error" v-html="error" />

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
import { required } from 'vuelidate/lib/validators';

import FbLogin from '../components/FBLogin';

export default {
  components: { FbLogin },

  data: () => ({
    error: null,
    fbParams: {
      return_scopes: true,
      scope: 'email',
    },
    password: '',
    username: '',
  }),

  methods: {
    async login() {
      this.$v.$touch();

      if (this.$v.$invalid) {
        return;
      }

      try {
        await this.$store.dispatch('auth/login', {
          username: this.username,
          password: this.password,
        });

        this.error = null;

        this.$router.push('/');
      } catch (error) {
        this.error = get(error, 'response.data.message', 'Fail');
      }
    },

    onFbError(error) {
      console.warn(error);
    },

    onFbSuccess(response) {
      console.log(response);
    },
  },

  validations: {
    username: { required },
    password: { required },
  },
};
</script>

<style scoped>
.card {
  max-width: 300px;
  width: 100%;
}
</style>

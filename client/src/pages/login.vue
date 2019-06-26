<template>
  <main class="is-center">
    <section class="card">
      <header>
        <h1 class="h3">Login</h1>
      </header>

      <form class="card-content" @submit.prevent="login">
        <no-ssr>
          <button slot="placeholder" class="button fb is-full" disabled>
            <i class="bx bx-loader-alt bx-spin" /> Just a moment...
          </button>

          <div v-if="!fbProcessing">
            <fb-login :params="fbParams" @success="onFbSuccess" @error="onFbError"></fb-login>
          </div>
          <div v-else>
            <button class="button fb is-full" disabled>
              <i class="bx bx-loader-alt bx-spin" /> Logging in...
            </button>
          </div>

          <div v-if="fbError" class="field has-error" v-html="fbError" />

          <p v-if="fbLogin">
            You haven't connected your Facebook account to your klubitus account yet. Log in to
            klubitus to automagically connect your accounts, after that you may log in with your
            Facebook account!
          </p>
          <span v-else class="separator">or</span>
        </no-ssr>

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

<script lang="ts">
import get from 'lodash/get';
import { Action, Component, Vue } from 'nuxt-property-decorator';
import { validationMixin } from 'vuelidate';
import { required } from 'vuelidate/lib/validators';

import FbLogin from '@/components/FBLogin.vue';

@Component({
  components: { FbLogin },
  mixins: [validationMixin],
  validations: {
    username: { required },
    password: { required },
  },
})
export default class Login extends Vue {
  error: string | null = null;
  fbError: string | null = null;
  fbLogin = false;
  fbParams = { return_scopes: true, scope: 'email' };
  fbProcessing = false;
  password = '';
  username = '';

  @Action('auth/fbLogin') actionFBLogin;

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
      this.error = get(error, 'response.data.message', 'Login failed :(');
    }
  }

  onFbError(error) {
    this.fbError = 'Login with Facebook failed :(';
    this.fbProcessing = false;
  }

  async onFbSuccess(response) {
    console.log(response);

    this.fbProcessing = true;

    const { accessToken: access_token, userID: external_user_id } = response.authResponse;

    try {
      const apiResponse = await this.actionFBLogin({ access_token, external_user_id });

      if (apiResponse) {
        const { email, is_new_user } = apiResponse;

        if (!is_new_user) {
          return this.$router.push(this.localePath('register'));
        }

        this.username = email;
        this.fbLogin = is_new_user;
      }
    } catch (error) {
      this.fbError = get(error, 'response.data.message', 'Fail');
    } finally {
      this.fbProcessing = false;
    }
  }
}
</script>

<style scoped>
.card {
  max-width: 300px;
  width: 100%;
}

.separator {
  margin: 1rem 0;
}
</style>

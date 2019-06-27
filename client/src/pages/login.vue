<template>
  <main class="is-center">
    <section class="card">
      <header class="tabs">
        <nuxt-link class="tab" :to="localePath('login')">Log In</nuxt-link>
        <nuxt-link class="tab" :to="localePath('signup')">Sign Up</nuxt-link>
      </header>

      <form class="card-content" @submit.prevent="submit">
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
            klubitus to automagically connect them, after that you may log in with your Facebook
            account!
            <a @click="reset">Cancel</a>
          </p>
          <p v-else-if="fbSignup">
            Welcome to klubitus! Choose a username or use your Facebook name and sign up, your
            accounts will be connected.
            <a @click="reset">Cancel</a>
          </p>
          <span v-else class="separator">or</span>
        </no-ssr>

        <div v-if="!isLogin" :class="{ 'has-error': $v.email.$error }" class="field">
          <label for="input-email">Email *</label>
          <div class="control has-icon-left">
            <input
              id="input-email"
              v-model.trim="$v.email.$model"
              name="email"
              required
              type="email"
            />
            <span class="icon"><i class="bx bx-at"/></span>
          </div>
          <p v-if="$v.email.$error && !$v.email.required" class="help">Please fill in</p>
        </div>

        <div :class="{ 'has-error': error || $v.username.$error }" class="field">
          <label v-if="isLogin" for="input-username">Email or username *</label>
          <label v-else for="input-username">Username *</label>
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
            <span class="icon"><i :class="isLogin ? 'bx bx-lock' : 'bx bx-lock-open'"/></span>
          </div>
          <p v-if="$v.password.$error && !$v.password.required" class="help">Please fill in</p>
        </div>

        <div v-if="error" class="field has-error" v-html="error" />

        <button v-if="isLogin" class="button is-primary is-full" type="submit">Log In</button>
        <button v-else class="button is-primary is-full" type="submit">Sign Up</button>
      </form>

      <footer v-if="isLogin">
        <nuxt-link :to="localePath('password')">Forgot password</nuxt-link>
      </footer>
    </section>
  </main>
</template>

<script lang="ts">
import get from 'lodash/get';
import { Component, Vue } from 'nuxt-property-decorator';
import { validationMixin } from 'vuelidate';

import FbLogin from '@/components/FBLogin.vue';
import {
  Actions,
  authStore,
  FBLoginPayload,
  FBLoginResponse,
  LoginPayload,
  RegisterPayload,
} from '@/store/auth';

@Component({
  components: { FbLogin },
  mixins: [validationMixin],
  validations: {
    email: {},
    username: {},
    password: {},
  },
})
export default class Login extends Vue {
  error: string | null = null;
  fbError: string | null = null;
  fbLogin = false;
  fbSignup = false;
  fbParams = { return_scopes: true, scope: 'email' };
  fbProcessing = false;
  email: string = '';
  password: string = '';
  username: string = '';
  tab: string | null = null;

  @authStore.Action(Actions.FB_LOGIN)
  actionFBLogin!: (payload: FBLoginPayload) => Promise<FBLoginResponse>;

  @authStore.Action(Actions.LOGIN)
  actionLogin!: (payload: LoginPayload) => Promise<void>;

  @authStore.Action(Actions.REGISTER)
  actionRegister!: (payload: RegisterPayload) => Promise<void>;

  get isLogin() {
    return this.tab !== 'signup' && this.$route.name!.startsWith('login');
  }

  reset() {
    this.fbLogin = false;
    this.fbSignup = false;
    this.email = '';
    this.password = '';
    this.username = '';
    this.tab = null;
  }

  async submit() {
    this.$v.$touch();

    if (this.$v.$invalid) {
      return;
    }

    try {
      if (this.isLogin) {
        await this.actionLogin({
          username: this.username,
          password: this.password,
        });
      } else {
        await this.actionRegister({
          email: this.email,
          username: this.username,
          password: this.password,
        });
      }

      this.error = null;

      this.$router.push('/');
    } catch (error) {
      this.error = get(error, 'response.data.message', 'Fail');
    }
  }

  onFbError(error) {
    this.fbError = 'Login with Facebook failed :(';
    this.fbProcessing = false;
  }

  async onFbSuccess(response: facebook.StatusResponse) {
    this.error = null;
    this.fbProcessing = true;

    const { accessToken: access_token, userID: external_user_id } = response.authResponse;

    try {
      const apiResponse = await this.actionFBLogin({ access_token, external_user_id });

      if (apiResponse) {
        const { email, is_new_user, name } = apiResponse;

        if (!this.isLogin || is_new_user) {
          this.email = email || '';
          this.username = name || '';
          this.fbLogin = false;
          this.fbSignup = true;
          this.tab = 'signup';
        } else {
          this.username = email || '';
          this.fbLogin = true;
          this.fbSignup = false;
          this.tab = 'login';
        }
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

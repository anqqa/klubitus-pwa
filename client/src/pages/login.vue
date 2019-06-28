<template>
  <main class="is-center">
    <section class="card">
      <header class="tabs">
        <nuxt-link class="tab" :to="localePath('login')">Log In</nuxt-link>
        <nuxt-link class="tab" :to="localePath('signup')">Sign Up</nuxt-link>
      </header>

      <form class="card-content" :disabled="submitting" @submit.prevent="submit">
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

          <p v-if="fbConnected && isLogin">
            You haven't connected your Facebook account to your klubitus account yet. Log in to
            klubitus to automagically connect them, after that you may log in with your Facebook
            account!
          </p>
          <p v-else-if="fbConnected && !isLogin">
            Welcome to klubitus! Choose a username or use your Facebook name and sign up, your
            accounts will be connected.
          </p>
          <span v-else class="separator">or</span>
        </no-ssr>

        <div
          v-if="!isLogin"
          :class="{ 'has-error': (errors && errors.email) || $v.form.email.$error }"
          class="field"
        >
          <label for="input-email">Email *</label>
          <div class="control has-icon-left">
            <input
              id="input-email"
              v-model.trim="$v.form.email.$model"
              name="email"
              required
              type="email"
            />
            <span class="icon"><i class="bx bx-at"/></span>
          </div>
          <p v-if="errors && errors.email" class="help">{{ errors.email.join(', ') }}</p>
        </div>

        <div
          :class="{ 'has-error': (errors && errors.username) || $v.form.username.$error }"
          class="field"
        >
          <label for="input-username" v-text="isLogin ? 'Email or username *' : 'Username *'" />
          <div class="control has-icon-left">
            <input
              id="input-username"
              v-model.trim="$v.form.username.$model"
              name="username"
              required
              type="text"
            />
            <span class="icon"><i class="bx bx-user"/></span>
          </div>
          <p v-if="errors && errors.username" class="help">{{ errors.username.join(', ') }}</p>
        </div>

        <div
          :class="{ 'has-error': (errors && errors.password) || $v.form.password.$error }"
          class="field"
        >
          <label for="input-password">Password *</label>
          <div class="control has-icon-left">
            <input
              id="input-password"
              v-model.trim="$v.form.password.$model"
              name="password"
              required
              type="password"
            />
            <span class="icon"><i :class="isLogin ? 'bx bx-lock' : 'bx bx-lock-open'"/></span>
          </div>
          <p v-if="errors && errors.password" class="help">{{ errors.password.join(', ') }}</p>
        </div>

        <div v-if="error" class="field has-error" v-html="error" />

        <button
          :disabled="submitting"
          class="button is-primary is-full"
          type="submit"
          v-text="isLogin ? 'Log In' : 'Sign Up'"
        />
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
import { required } from 'vuelidate/lib/validators';

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
    form: {
      email: {},
      username: { required },
      password: { required },
    },
  },
})
export default class Login extends Vue {
  error: string | null = null;
  errors: Record<string, string[]> | null = null;
  fbConnected = false;
  fbError: string | null = null;
  fbParams = { return_scopes: true, scope: 'email' };
  fbProcessing = false;
  form: Record<string, string> = {
    email: '',
    password: '',
    username: '',
  };
  submitting = false;
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

  async submit() {
    this.$v.$touch();

    console.log(this.$v);

    if (this.$v.$invalid) {
      return;
    }

    this.submitting = true;

    try {
      if (this.isLogin) {
        await this.actionLogin({
          username: this.form.username,
          password: this.form.password,
        });
      } else {
        await this.actionRegister({
          email: this.form.email,
          username: this.form.username,
          password: this.form.password,
        });
      }

      this.error = null;
      this.errors = null;

      this.$router.push('/');
    } catch (error) {
      this.errors = get(error, 'response.data.errors', null);

      if (!this.errors) {
        this.error = get(error, 'response.data.message', 'Fail');
      }
    }

    this.submitting = false;
  }

  onFbError(error) {
    this.fbError = 'Login with Facebook failed :(';
    this.fbProcessing = false;
  }

  async onFbSuccess(response: facebook.StatusResponse) {
    this.error = null;
    this.errors = null;
    this.fbProcessing = true;

    const { accessToken: access_token, userID: external_user_id } = response.authResponse;

    try {
      const apiResponse = await this.actionFBLogin({ access_token, external_user_id });

      if (apiResponse) {
        const { email, is_new_user, name } = apiResponse;

        if (!this.isLogin || is_new_user) {
          this.form.email = email || '';
          this.form.username = name || '';
          this.tab = 'signup';
        } else {
          this.form.username = email || '';
          this.tab = 'login';
        }

        this.fbConnected = true;
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

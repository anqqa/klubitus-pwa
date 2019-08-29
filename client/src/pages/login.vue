<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12">
          <v-toolbar>
            <v-tabs grow>
              <v-tab :to="localePath('login')" nuxt>Login</v-tab>
              <v-tab :to="localePath('signup')" nuxt>Sign Up</v-tab>
            </v-tabs>
          </v-toolbar>

          <v-form :disabled="submitting" @submit.prevent="submit">
            <v-card-text>
              <no-ssr>
                <v-btn slot="placeholder" block color="facebook" disabled loading>
                  Just a moment...
                </v-btn>

                <div v-if="!fbConnected && !fbProcessing">
                  <fb-login :params="fbParams" @success="onFbSuccess" @error="onFbError"></fb-login>
                </div>
                <div v-else-if="!fbConnected">
                  <v-btn block color="facebook" disabled loading>
                    Logging in...
                  </v-btn>
                </div>

                <v-alert v-if="fbError" type="error" v-html="fbError" />

                <v-alert v-if="fbConnected" icon="mdi-facebook-box" border="left" color="facebook">
                  <span v-if="isLogin">
                    You haven't connected your Facebook account to your klubitus account yet. Log in
                    to klubitus to automagically connect them, after that you may log in with your
                    Facebook account!
                  </span>
                  <span v-else>
                    Welcome to klubitus!<br /><br />
                    Choose a username or use your Facebook name and sign up, your accounts will be
                    connected.
                  </span>
                </v-alert>
                <span v-else class="separator my-4">or</span>
              </no-ssr>

              <v-text-field
                v-if="!isLogin"
                v-model.trim="$v.email.$model"
                :error-messages="emailErrors"
                label="Email *"
                name="email"
                prepend-icon="mdi-email"
                required
                type="email"
              />

              <v-text-field
                v-model.trim="$v.username.$model"
                :error-messages="usernameErrors"
                :label="isLogin ? 'Email or username *' : 'Username *'"
                name="username"
                prepend-icon="mdi-account"
                required
                type="text"
              />

              <v-text-field
                v-model.trim="$v.password.$model"
                :error-messages="passwordErrors"
                label="Password *"
                name="password"
                :prepend-icon="isLogin ? 'mdi-lock' : 'mdi-lock-open'"
                required
                type="password"
              />

              <v-alert v-model="error" type="error" v-html="error" />
            </v-card-text>

            <v-card-actions>
              <v-btn
                :disabled="submitting"
                :loading="submitting"
                color="primary"
                type="submit"
                v-text="isLogin ? 'Log In' : 'Sign Up'"
              />

              <v-spacer />

              <nuxt-link v-if="isLogin" :to="localePath('password')">Forgot password?</nuxt-link>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import get from 'lodash/get';
import { Component, Vue } from 'nuxt-property-decorator';
import { validationMixin } from 'vuelidate';
import { Validate, Validations } from 'vuelidate-property-decorators';
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
})
export default class Login extends Vue {
  get isLogin() {
    return this.tab !== 'signup' && this.$route.name!.startsWith('login');
  }

  get emailErrors() {
    return this.getErrors('email');
  }

  get passwordErrors() {
    return this.getErrors('password');
  }

  get usernameErrors() {
    return this.getErrors('username');
  }
  fbConnected = false;
  fbError: string | null = null;
  fbParams = { return_scopes: true, scope: 'email' };
  fbProcessing = false;

  error: string | null = null;
  errors: Record<string, string[]> = {};
  submitting = false;
  tab: string | null = null;

  @Validate({})
  email = '';

  @Validate({ required })
  password = '';

  @Validate({ required })
  username = '';

  @authStore.Action(Actions.FB_LOGIN)
  actionFBLogin!: (payload: FBLoginPayload) => Promise<FBLoginResponse>;

  @authStore.Action(Actions.LOGIN)
  actionLogin!: (payload: LoginPayload) => Promise<void>;

  @authStore.Action(Actions.REGISTER)
  actionRegister!: (payload: RegisterPayload) => Promise<void>;

  async submit() {
    this.$v.$touch();

    if (this.$v.$invalid) {
      return;
    }

    this.submitting = true;

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
      this.errors = {};

      this.$router.push('/');
    } catch (error) {
      this.errors = get(error, 'response.data.errors', null);

      if (!this.errors) {
        this.error = get(error, 'response.data.message', 'Fail');
      }
    } finally {
      this.submitting = false;
    }
  }

  onFbError(error) {
    this.fbError = 'Login with Facebook failed :(';
    this.fbProcessing = false;
  }

  async onFbSuccess(response: facebook.StatusResponse) {
    this.error = null;
    this.errors = {};
    this.fbProcessing = true;

    const { accessToken: access_token, userID: external_user_id } = response.authResponse;

    try {
      const apiResponse = await this.actionFBLogin({ access_token, external_user_id });

      if (apiResponse) {
        const { email, is_new_user, name } = apiResponse;

        if (!this.isLogin || is_new_user) {
          this.email = email || '';
          this.username = name || '';
          this.tab = 'signup';
        } else {
          this.username = email || '';
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

  @Validations()
  validations() {
    return !this.isLogin ? { email: { required } } : {};
  }

  private getErrors(field: string): string[] {
    const errors = this.errors[field] || [];

    if (!this.$v[field].$dirty) {
      return errors;
    }

    !this.$v[field].required && errors.push('Please fill me');

    return errors;
  }
}
</script>

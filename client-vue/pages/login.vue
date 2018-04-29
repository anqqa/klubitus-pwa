<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex sx12 sm8 md4>
        <v-card>

          <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="login">

            <v-toolbar flat>
              <v-toolbar-title>Login</v-toolbar-title>
            </v-toolbar>

            <v-card-text>
              <v-btn block outline>
                <v-icon>fab fa-facebook-square</v-icon>
                <span class="ml-2">Login with Facebook</span>
              </v-btn>

              <span class="separator mt-3">or</span>

              <v-alert :value="!!formError" color="warning" icon="far fa-frown" transition="scale-transition">
                {{ formError }}
              </v-alert>

              <v-text-field v-model="username"
                            :error="!!formError"
                            :rules="usernameRules"
                            prepend-icon="far fa-user"
                            name="username"
                            label="Email or username"
                            required
                            type="email" />
              <v-text-field v-model="password"
                            :error="!!formError"
                            :rules="passwordRules"
                            prepend-icon="fas fa-key"
                            required
                            name="password"
                            label="Password"
                            type="password" />

              <nuxt-link to="/password">Forgot password?</nuxt-link>
            </v-card-text>

            <v-card-actions>
              <nuxt-link to="/register">Register</nuxt-link>
              <v-spacer />
              <v-btn :disabled="!valid" color="primary" type="submit">Login</v-btn>
            </v-card-actions>

          </v-form>

        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import get from 'lodash/get';
  import VAlert from 'vuetify/es5/components/VAlert';
  import VForm from 'vuetify/es5/components/VForm';

  export default {
    components: { VAlert, VForm },

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

</style>

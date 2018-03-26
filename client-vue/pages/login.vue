<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex sx12 sm8 md4>
        <v-card>

          <v-form @submit.prevent="login">

            <v-toolbar flat>
              <v-toolbar-title>Login</v-toolbar-title>
            </v-toolbar>

            <v-card-text>
              <v-btn block outline>Login with Facebook</v-btn>

              <span class="separator mt-3">or</span>

              <v-text-field v-model="formUsername"
                            prepend-icon="person"
                            name="username"
                            label="Email or username"
                            type="email" />
              <v-text-field v-model="formPassword"
                            prepend-icon="lock"
                            name="password"
                            label="Password"
                            type="password" />

              <nuxt-link to="/password">Forgot password?</nuxt-link>
            </v-card-text>

            <v-card-actions>
              <nuxt-link to="/register">Register</nuxt-link>
              <v-spacer />
              <v-btn color="primary" type="submit">Login</v-btn>
            </v-card-actions>

          </v-form>

        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import VForm from 'vuetify/es5/components/VForm';

  export default {
    components: { VForm },

    data() {
      return {
        formError:    null,
        formUsername: '',
        formPassword: '',
      }
    },

    methods: {
      async login() {
        try {
          await this.$auth.login({
            data: {
              username: this.formUsername,
              password: this.formPassword,
            }
          });

          this.formError    = null;
          this.formUsername = '';
          this.formPassword = '';
        }
        catch (error) {
          this.formError = error.message;
        }
      },
    },

  };
</script>

<style scoped>

</style>

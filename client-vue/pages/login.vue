<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex sx12 sm8 md4>
        <v-card>

          <v-toolbar flat>
            <v-toolbar-title>Login</v-toolbar-title>
          </v-toolbar>

          <v-card-text>
            <v-btn block outline>Login with Facebook</v-btn>

            <span class="separator mt-3">or</span>

            <v-form>
              <v-text-field prepend-icon="person" name="username" label="Email or username" type="email" />
              <v-text-field prepend-icon="lock" name="password" label="Password" type="password" />
            </v-form>

            <nuxt-link to="/password">Forgot password?</nuxt-link>
         </v-card-text>

          <v-card-actions>
            <nuxt-link to="/register">Register</nuxt-link>
            <v-spacer />
            <v-btn color="primary">Login</v-btn>
          </v-card-actions>

        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
  };
</script>

<style scoped>

</style>

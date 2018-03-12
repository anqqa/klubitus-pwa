<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex sx12 sm8 md4>
        <v-card>

          <v-toolbar flat>
            <v-toolbar-title>Forgot password</v-toolbar-title>
          </v-toolbar>

          <v-card-text>
            <p>
              Enter your email and we will send you a password reset mail.
            </p>
            <v-form>
              <v-text-field prepend-icon="email" name="email" label="Email" type="email" />
            </v-form>
          </v-card-text>

          <v-card-actions>
            <v-spacer />
            <v-btn color="primary">Reset password</v-btn>
          </v-card-actions>

          <v-card-actions class="mt-3">
            <nuxt-link to="/login">Login</nuxt-link>
            <v-spacer />
            <nuxt-link to="/register">Register</nuxt-link>
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

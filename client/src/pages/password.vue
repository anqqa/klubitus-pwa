<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12">
          <v-card-title>Forgot password</v-card-title>

          <v-form>
            <v-card-text>
              Enter your email and we will send you a password reset mail.

              <v-text-field
                label="Email"
                name="email"
                prepend-icon="mdi-email"
                required
                type="email"
              />
            </v-card-text>

            <v-card-actions>
              <v-btn color="primary" type="submit">Reset Password</v-btn>

              <v-spacer />

              <nuxt-link :to="localePath('login')">Log In</nuxt-link>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {};
</script>

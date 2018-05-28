<template>
  <main class="column">

    <section class="card">
      <div class="card-header">
        <span class="card-header-title">Forgot password</span>
      </div>

      <form class="card-content">
        <p>
          Enter your email and we will send you a password reset mail.
        </p>

        <b-field label="Email">
          <b-input icon-pack="fas"
                   icon="fa-at"
                   name="email"
                   required
                   type="email" />
        </b-field>

        <button class="button is-primary" type="submit">Reset password</button>
      </form>

      <div class="card-footer">
        <nuxt-link :to="localePath('login')">Login</nuxt-link>
        <nuxt-link :to="localePath('register')">Register</nuxt-link>
      </div>
    </section>

  </main>
</template>


<script>
  export default {
  };
</script>


<style scoped>
  section.card {
    max-width: 300px;
  }
</style>

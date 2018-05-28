<template>
  <main class="column">

    <section class="card">
      <div class="card-header">
        <span class="card-header-title">Register</span>
      </div>

      <form class="card-content">
        <button class="button is-outlined">
          <span class="icon"><i class="fab fa-facebook-square" /></span>
          Login with Facebook
        </button>

        <span class="separator">or</span>

        <b-field label="Email">
          <b-input :value="email"
                   icon-pack="far"
                   icon="fa-at"
                   name="email"
                   required
                   type="email" />
        </b-field>

        <b-field label="Username">
          <b-input :value="username"
                   icon-pack="far"
                   icon="fa-user"
                   name="username"
                   required
                   type="text" />
        </b-field>

        <b-field label="Password">
          <b-input icon-pack="fas"
                   icon="fa-key"
                   name="password"
                   required
                   type="password" />
        </b-field>

        <button class="button is-primary" type="submit">Register</button>
      </form>

      <div class="card-footer">
        <nuxt-link :to="localePath('login')">Login</nuxt-link>
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

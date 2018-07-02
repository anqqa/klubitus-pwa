<template>
  <main class="is-center">

    <section class="card">
      <header>
        <h1 class="h3">Register</h1>
      </header>

      <form class="card-content">
        <button class="button is-full is-outlined">
          <span class="icon"><i class="bx bx-facebook" /></span>
          Login with Facebook
        </button>

        <span class="separator">or</span>

        <div class="field">
          <label for="input-email">Email</label>
          <div class="control has-icon-left">
            <input id="input-email"
                   :value="email"
                   name="email"
                   required
                   type="email">
            <span class="icon"><i class="bx bx-at" /></span>
          </div>
        </div>

        <div class="field">
          <label for="input-username">Username</label>
          <div class="control has-icon-left">
            <input id="input-username"
                   :value="username"
                   name="username"
                   required
                   type="text">
            <span class="icon"><i class="bx bx-user" /></span>
          </div>
        </div>

        <div class="field">
          <label for="input-password">Passphrase</label>
          <div class="control has-icon-left">
            <input id="input-password"
                   name="password"
                   required
                   type="password">
            <span class="icon"><i class="bx bx-lock-open" /></span>
          </div>
        </div>

        <button class="button is-primary is-full" type="submit">Register</button>
      </form>

      <footer>
        <nuxt-link :to="localePath('login')">Login</nuxt-link>
      </footer>
    </section>

  </main>
</template>


<script>
  export default {
  };
</script>


<style scoped>
  .card {
    max-width: 300px;
    width: 100%;
  }
</style>

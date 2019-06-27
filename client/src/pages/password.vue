<template>
  <main class="is-center">
    <section class="card">
      <header>
        <h1 class="h3">Forgot Password</h1>
      </header>

      <form class="card-content">
        <p>
          Enter your email and we will send you a password reset mail.
        </p>

        <div class="field">
          <label for="input-email">Email</label>
          <div class="control has-icon-left">
            <input id="input-email" :value="email" name="email" required type="email" />
            <span class="icon"><i class="bx bx-at"/></span>
          </div>
        </div>

        <button class="button is-primary is-full" type="submit">Reset Password</button>
      </form>

      <footer>
        <nuxt-link :to="localePath('login')">Log In</nuxt-link>
      </footer>
    </section>
  </main>
</template>

<script>
export default {};
</script>

<style scoped>
.card {
  max-width: 300px;
  width: 100%;
}
</style>

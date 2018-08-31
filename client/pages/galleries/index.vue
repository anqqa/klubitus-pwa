<template>

  <main>
    <h1>Galleries</h1>

    <nuxt-link :to="localePath('galleries-events-year-month-day')">Events</nuxt-link>
    <nuxt-link :to="localePath('galleries-flyers')">Flyers</nuxt-link>
  </main>

</template>


<script>
  export default {

    head: {
      title: 'Galleries'
    },

  }
</script>

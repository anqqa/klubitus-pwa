<template>
  <main>

    <article class="container">
      <figure v-if="event.flyer_front_url" class="image">
        <img :src="event.flyer_front_url" alt="Flyer">
      </figure>

      <header class="has-text-center is-uppercase">
        <h2 class="subtitle">{{ event.date }}</h2>
        <h1 class="title">{{ event.name }}</h1>
        {{ event.venue_name }}, {{ event.city_name }}<br>
        {{ event.hours }}<br>
        <a v-if="event.facebook_id"
           :href="`https://facebook.com/events/${event.facebook_id}/`"
           class="button"
           rel="noopener"
           target="_blank">
          <span class="icon"><i class="bx bx-facebook" /></span>
          <span>Facebook event</span>
        </a>
      </header>

      <hr>

      <div class="markdown" v-html="event.info" />
    </article>

  </main>
</template>

<script>
  import format from 'date-fns/format';

  import { hours } from '../../utils/time';


  export default {

    async asyncData({ app, params }) {
      const { data } = await app.$axios.$get(`event/${parseInt(params.id)}`);
      const { begins_at, ends_at, info } = data;

      return {
        event: {
          ...data,
          date:  format(begins_at, 'dddd, MMMM D, YYYY'),
          hours: hours(begins_at, ends_at),
          info:  app.$md.render(info),
        }
      };
    },

    validate({ params }) {
      return /^\d+/.test(params.id);
    }

  };
</script>


<style scoped>
  article {
    max-width: 720px;
  }
</style>
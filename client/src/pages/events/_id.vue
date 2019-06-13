<template>
  <main>
    <article class="container">
      <figure v-if="item.flyer_front_url" class="image">
        <img :src="item.flyer_front_url" alt="Flyer" />
      </figure>

      <header class="has-text-center is-uppercase">
        <h2 class="subtitle">{{ item.date }}</h2>
        <h1 class="title">{{ item.name }}</h1>
        {{ item.venue_name }}, {{ item.city_name }}<br />
        {{ item.hours }}<br />
        <a
          v-if="item.facebook_id"
          :href="`https://facebook.com/events/${item.facebook_id}/`"
          class="button"
          rel="noopener"
          target="_blank"
        >
          <span class="icon"><i class="bx bx-facebook"/></span>
          <span>Facebook event</span>
        </a>
      </header>

      <hr />

      <div class="markdown" v-html="item.info" />
    </article>
  </main>
</template>

<script>
import format from 'date-fns/format';

import Event from '../../models/Event';
import { hours } from '../../utils/time';

export default {
  async asyncData({ app, params }) {
    const event = await Event.find(parseInt(params.id));
    const { begins_at, ends_at, info } = event;

    return {
      item: {
        ...event,
        date: format(begins_at, 'dddd, MMMM D, YYYY'),
        hours: hours(begins_at, ends_at),
        info: app.$md.render(info),
      },
    };
  },

  validate({ params }) {
    return /^\d+/.test(params.id);
  },
};
</script>

<style scoped>
article {
  max-width: 720px;
}
</style>

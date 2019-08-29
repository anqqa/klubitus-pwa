<template>
  <v-container>
    <v-flex md8 class="mx-auto">
      <v-img v-if="item.flyer_front_url" :src="item.flyer_front_url" alt="Flyer" class="mb-4" />

      <header class="text-center text-uppercase">
        <h2 class="headline">{{ item.date }}</h2>
        <h1 class="display-1">{{ item.name }}</h1>
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

      <v-divider class="my-4" />

      <div class="markdown" v-html="item.info" />
    </v-flex>
  </v-container>
</template>

<script lang="ts">
import format from 'date-fns/format';
import { Component, Vue } from 'nuxt-property-decorator';

import Event from '@/models/Event';
import { hours } from '@/utils/time';

@Component({})
export default class SingleEvent extends Vue {
  async asyncData({ app, params }) {
    const event = await new Event().find(parseInt(params.id));
    const { begins_at, ends_at, info } = event;

    return {
      item: {
        ...event,
        date: format(begins_at!, 'dddd, MMMM D, YYYY'),
        hours: hours(begins_at!, ends_at!),
        info: app.$md.render(info),
      },
    };
  }

  validate({ params }) {
    return /^\d+/.test(params.id);
  }
}
</script>

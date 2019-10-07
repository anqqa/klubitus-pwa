<template>
  <v-container>
    <v-flex md8 class="mx-auto">
      <v-img v-if="item.flyer_front_url" :src="item.flyer_front_url" alt="Flyer" class="mb-4" />

      <header class="text-center text-uppercase">
        <h2 class="headline">{{ item.date }}</h2>
        <h1 class="display-1">{{ item.name }}</h1>
        {{ item.venue_name }}, {{ item.city_name }}<br />
        {{ item.hours }}<br />
        <v-btn
          v-if="item.facebook_id"
          :href="`https://facebook.com/events/${item.facebook_id}/`"
          color="facebook"
          rel="noopener"
          target="_blank"
        >
          <v-icon left>mdi-facebook</v-icon> Facebook event
        </v-btn>
        <template v-if="isAuthenticated">
          <v-btn v-if="isFavorite" outlined @click="toggleFavorite">
            <v-icon left>mdi-star</v-icon> Remove favorite
          </v-btn>
          <v-btn v-else color="primary" @click="toggleFavorite">
            <v-icon left>mdi-star</v-icon> Add to Favorites
          </v-btn>
        </template>
      </header>

      <v-divider class="my-4" />

      <div class="markdown" v-html="item.info" />
    </v-flex>
  </v-container>
</template>

<script lang="ts">
import { format, parseISO } from 'date-fns';
import { Component, Vue } from 'nuxt-property-decorator';

import Event from '@/models/Event';
import { authStore } from '@/store/auth';
import { eventsStore } from '@/store/events';
import { hours } from '@/utils/time';

@Component({})
export default class SingleEvent extends Vue {
  eventId: number = 0;

  @authStore.Getter isAuthenticated!: boolean;
  @authStore.Getter userId!: number | undefined;
  @eventsStore.Action addFavorite!: (eventId: number) => Promise<any>;
  @eventsStore.Action removeFavorite!: (eventId: number) => Promise<any>;
  @eventsStore.Getter isFavorite!: (eventId: number) => boolean;

  async asyncData({ app, params }) {
    const eventId = parseInt(params.id);
    const event = await new Event().find(eventId);
    const { begins_at, ends_at, info } = event;

    return {
      eventId,
      item: {
        ...event,
        date: format(parseISO(begins_at!), 'eeee, MMMM d, yyyy'),
        hours: hours(parseISO(begins_at!), parseISO(ends_at!)),
        info: app.$md.render(info),
      },
    };
  }

  async fetch({ store }) {
    if (!store.getters['events/favoritesLoaded']) {
      const userId = store.getters['auth/userId'];

      await store.dispatch('events/loadFavorites', userId);
    }
  }

  async toggleFavorite() {
    this.isFavorite(this.eventId)
      ? this.removeFavorite(this.eventId)
      : this.addFavorite(this.eventId);
  }

  validate({ params }) {
    return /^\d+/.test(params.id);
  }
}
</script>

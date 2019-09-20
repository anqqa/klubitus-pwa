<template>
  <v-row>
    <v-col cols="12" md="4" order-md="last"> </v-col>

    <v-col md="8">
      <v-tabs v-model="tab" show-arrows>
        <v-tab v-for="year in Object.keys(years).reverse()" :key="year" :href="`#${year}`">
          {{ year }}
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab">
        <v-tab-item v-for="year in Object.keys(years).reverse()" :key="year" :value="year">
          <template v-for="event in years[year]">
            <v-subheader class="title" v-text="dateTitle(event)" />

            <event-card :key="event.id" :event="event" class="mx-1" />
          </template>
        </v-tab-item>
      </v-tabs-items>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { format, parseISO } from 'date-fns';
import { Component, Vue } from 'nuxt-property-decorator';

import EventCard from '@/components/events/EventCard.vue';
import Event from '@/models/Event';
import Favorite from '@/models/Favorite';

@Component({ components: { EventCard } })
export default class Favorites extends Vue {
  tab = null;
  years: Record<string, Event[]> = {};

  async asyncData({ params }) {
    const years: Record<string, Event[]> = {};
    const userId = parseInt(params.id);
    const favorites = await new Favorite()
      .select(['created_at'])
      .relation('event', [
        'begins_at',
        'city_name',
        'ends_at',
        'flyer_front_url',
        'id',
        'name',
        'venue_name',
      ])
      .filter('user_id', 'eq', userId)
      .sort('event.begins_at', 'DESC')
      .get();

    favorites.forEach(favorite => {
      const event = new Event(favorite.event);
      const year = format(parseISO(event.begins_at!), 'yyyy');

      years[year] ? years[year].push(event) : (years[year] = [event]);
    });

    return { years };
  }

  dateTitle(event: Event): string {
    return format(parseISO(event.begins_at!), 'EEEE, MMMM do yyyy');
  }
}
</script>

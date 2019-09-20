<template>
  <v-row>
    <v-col style="max-width: 200px">
      <nuxt-link class="flyer" :to="localePath(event.path)">
        <v-card>
          <v-img v-if="event.flyer_front_url" :aspect-ratio="16 / 9" :src="event.flyer_front_url" />
          <v-responsive v-else :aspect-ratio="16 / 9" class="d-flex align-center text-center">
            <v-icon large disabled>mdi-image-off</v-icon>
          </v-responsive>
        </v-card>
      </nuxt-link>
    </v-col>

    <v-col>
      <nuxt-link :to="localePath(event.path)">{{ event.name }}</nuxt-link>
      <br />
      <span>{{ event.venue_name }} &sdot; {{ event.city_name }}</span>
      <br />
      <span class="has-text-tertiary" v-text="hours" />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { parseISO } from 'date-fns';
import { Component, Prop, Vue } from 'nuxt-property-decorator';

import Event from '@/models/Event';
import { hours } from '@/utils/time';

@Component({})
export default class EventCard extends Vue {
  @Prop() event!: Event;

  get hours() {
    const { begins_at, ends_at } = this.event;

    return begins_at && ends_at && hours(parseISO(begins_at), parseISO(ends_at));
  }
}
</script>

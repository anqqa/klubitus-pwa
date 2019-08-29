<template>
  <v-card>
    <v-card-title>{{ title }}</v-card-title>

    <v-card-text>
      <v-list>
        <v-list-item v-for="event in events" :key="event.id" :to="event.url" nuxt>
          <v-list-item-content>
            <v-list-item-title v-text="event.name" />
          </v-list-item-content>
          <v-list-item-action>
            <v-list-item-action-text v-text="event.stamp" />
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { format, parseISO } from 'date-fns';
import { Component, Prop, Vue } from 'nuxt-property-decorator';
import { RawLocation } from 'vue-router';

import Event from '@/models/Event';
import { slug } from '@/utils/text';

export const EventListType = {
  LATEST: 'latest',
};

let cachedData: Array<Event | { stamp: string; url: RawLocation }> | null = null;

@Component({})
export default class EventList extends Vue {
  @Prop({ default: 10 }) limit!: number;
  @Prop({ default: 'Events ' }) title!: string;
  @Prop({ default: EventListType.LATEST }) type!: string;

  events: typeof cachedData = null;

  async mounted() {
    if (!cachedData) {
      cachedData = [];

      const data = await new Event()
        .sort('id', this.type === EventListType.LATEST ? 'DESC' : 'ASC')
        .limit(Math.min(this.limit, 50))
        .get();

      data.forEach(event => {
        (cachedData as any[]).push({
          ...event,
          stamp: format(parseISO(event.begins_at!), 'dd MMM'),
          url: this.localePath({
            name: 'events-id',
            params: { id: `${event.id}-${slug(event.name)}` },
          }),
        });
      });
    }

    this.events = cachedData;
  }
}
</script>

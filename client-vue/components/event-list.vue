<template>
  <v-card class="transparent">
    <v-list dense subheader>
      <v-subheader v-html="title" />

      <template v-for="event in events">
        <v-list-tile :key="event.id" :to="event.url">

          <v-list-tile-content>
            <v-list-tile-title v-html="event.name" />
          </v-list-tile-content>

          <v-list-tile-action>
            <v-list-tile-action-text v-html="event.stamp" />
          </v-list-tile-action>

        </v-list-tile>
      </template>

    </v-list>
  </v-card>
</template>

<script>
  import format from 'date-fns/format';
  import VSubheader from 'vuetify/es5/components/VSubheader'

  import { slug } from '../utils/text';


  export const EventListType = {
    LATEST: 'latest',
  };

  let cachedData = null;

  export default {
    components: { VSubheader },

    props: {
      limit:  { default: 10, type: Number },
      title:  { default: 'Events', type: String },
      type:   { default: EventListType.LATEST, type: String },
    },

    asyncComputed: {
      async events() {
        if (cachedData) {
          return cachedData;
        }

        const { data } = await this.$axios.$get(`events/${this.type}`, {
          params: { limit: Math.min(this.limit, 50) }
        });

        data.forEach(event => {
          event.stamp = format(event.begins_at, 'DD MMM');
          event.url   = `/events/${event.id}-${slug(event.name)}`
        });

        return cachedData = data;
      }
    },

  };
</script>

<style scoped>

</style>

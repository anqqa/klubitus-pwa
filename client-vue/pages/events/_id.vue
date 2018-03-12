<template>
  <v-container>
    <v-layout tag="article" row wrap>
      <v-flex v-if="event.flyer_front_url" text-xs-center xs12>
        <img :src="event.flyer_front_url" alt="Flyer">
      </v-flex>

      <v-flex tag="header" text-xs-center xs12>
        <h2 class="subheader">{{ event.date }}</h2>
        <h1 class="headline">{{ event.name }}</h1>
        {{ event.venue_name }}, {{ event.city_name }}<br>
        {{ event.hours }}<br>
        <v-btn v-if="event.facebook_id"
               :href="`https://facebook.com/events/${event.facebook_id}/`"
               outline
               rel="noopener"
               tag="a"
               target="_blank">
          Facebook event
        </v-btn>
      </v-flex>

      <v-flex xs12>
        <v-divider class="my-3" />
      </v-flex>

      <v-flex class="markdown" xs12 v-html="event.info" />
    </v-layout>
  </v-container>
</template>

<script>
  import format from 'date-fns/format';
  import VDivider from 'vuetify/es5/components/VDivider';

  import { hours } from '../../utils/text';


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

    components: { VDivider },

    validate({ params }) {
      return /^\d+/.test(params.id);
    }

  };
</script>


<style scoped>
  article {
    max-width: 720px;
    margin: 0 auto;
  }

  header {
    text-transform: uppercase;
  }
</style>

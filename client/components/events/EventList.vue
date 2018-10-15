<template>
  <section class="card dense">

    <header>
      <h2 v-html="title" />
    </header>

    <ul class="card-content">
      <li v-for="event in events" :key="event.id">
        <time class="is-pulled-right">{{ event.stamp }}</time>&nbsp;
        <nuxt-link :to="event.url">{{ event.name }}</nuxt-link>
      </li>
    </ul>

  </section>
</template>


<script>
  import format from 'date-fns/format';

  import { slug } from '../../utils/text';


  export const EventListType = {
    LATEST: 'latest',
  };

  let cachedData = null;

  export default {
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
          event.url   = this.localePath({ name: 'events-id', params: { id: `${event.id}-${slug(event.name)}` }});
        });

        return cachedData = data;
      }
    },

  };
</script>


<style scoped>
  ul { list-style: none; }
</style>

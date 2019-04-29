<template>
  <section>
    <header>
      <h2>{{ title }}</h2>
    </header>

    <ul>
      <li v-for="event in events" :key="event.id">
        <nuxt-link :to="event.url">
          <time class="has-text-tertiary">{{ event.stamp }}</time>
          <span>{{ event.name }}</span>
        </nuxt-link>
      </li>
    </ul>
  </section>
</template>

<script>
import format from 'date-fns/format';

import Event from '../../models/Event';
import { slug } from '../../utils/text';

export const EventListType = {
  LATEST: 'latest',
};

let cachedData = null;

export default {
  props: {
    limit: { default: 10, type: Number },
    title: { default: 'Events', type: String },
    type: { default: EventListType.LATEST, type: String },
  },

  asyncComputed: {
    async events() {
      if (cachedData) {
        return cachedData;
      }

      let orderBy = 'id';

      switch (this.type) {
        case EventListType.LATEST:
          orderBy = '-id';
          break;
      }

      const data = await Event.orderBy(orderBy)
        .limit(Math.min(this.limit, 50))
        .$get();

      data.forEach(event => {
        event.stamp = format(event.begins_at, 'DD MMM');
        event.url = this.localePath({
          name: 'events-id',
          params: { id: `${event.id}-${slug(event.name)}` },
        });
      });

      return (cachedData = data);
    },
  },
};
</script>

<style scoped>
ul a {
  display: flex;
}
ul time {
  white-space: nowrap;
  width: 3.5em;
}
ul span {
  flex: 1;
}
</style>

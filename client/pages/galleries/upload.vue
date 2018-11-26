<template>

  <main class="row is-horizontal-center">
    <div class="col-6 main-content">
      <header>
        <h1>Upload Photos</h1>
      </header>

      <br>

      <section class="card">
        <header>
          <h2 class="has-text-secondary">Step 1: Select the event</h2>
        </header>

        <div v-if="!event" class="card-content">
          <vue-autosuggest
            :input-props="inputProps"
            :suggestions="suggestions"
            @selected="onSelected">
            <template slot-scope="{suggestion}">
              <span class="has-text-tertiary">{{ suggestion.label.date }} </span>
              <span v-html="suggestion.label.highlight" />
              @ {{ suggestion.label.venue_name }}, {{ suggestion.label.city_name }}
            </template>
          </vue-autosuggest>

          <span class="separator">or</span>

          <p>
            Choose from your latest favorites:
          </p>
        </div>

        <div v-else class="card-content row">
          <div v-if="event.flyer_front_url" class="col is-narrow flyer">
            <figure class="image is-16by9">
              <img :src="event.flyer_front_url">
            </figure>
          </div>

          <div class="col">
            <h3>{{ eventName }}</h3>
            <p>{{ eventInfo }}</p>
            <nuxt-link :to="localePath('galleries-upload')">
              &laquo; Select another event
            </nuxt-link>
          </div>
        </div>
      </section>

      <br>

      <section :class="{disabled: !event}" class="card">
        <header>
          <h2 class="has-text-secondary">Step 2: Add photos</h2>
        </header>

        <div class="card-content">

        </div>
      </section>
    </div>
  </main>

</template>


<script>
  import format from 'date-fns/format';
  import debounce from 'lodash/debounce';


  export default {

    head: {
      title: 'Upload photos'
    },

    async asyncData({ app, query }) {
      const eventId   = parseInt(query.event);
      const galleryId = parseInt(query.gallery);

      if (eventId) {
        const { data } = await app.$axios.$get(`events/${eventId}`);

        if (data) {
          return { event: data, gallery: null };
        }
      }
      else if (galleryId) {
        const { data: gallery } = await app.$axios.$get(`galleries/${galleryId}`);

        return { event: gallery.event, gallery };
      }

      return { event: null, gallery: null };
    },

    data() {
      return {
        event:       null,
        events:      [],
        gallery:     null,
        suggestions: [],

        inputProps: {
          id: 'input-event',
          onInputChange: debounce(this.fetchEvents, 250),
          placeholder: 'Search...'
        }
      };
    },

    computed: {
      eventDate() { return new Date(this.event ? this.event.begins_at : this.gallery.event_date); },
      eventInfo() {
        if (this.event) {
          return format(this.event.begins_at, 'MMMM D, YYYY')
            + ' @ ' + this.event.venue_name + ', ' + this.event.city_name;
        }
        else {
          return format(this.gallery.event_date, 'MMMM D, YYYY');
        }
      },
      eventName() { return this.event ? this.event.name : this.gallery.name; },
    },

    methods: {
      async fetchEvents(text) {
        if (!text || text.length < 3) {
          this.suggestions = [];

          return;
        }

        const { data: events } = await this.$axios.$get('events', { params: { search: text } });

        const data    = [];
        const search  = new RegExp(text, 'ig');
        const replace = match => `<em>${match}</em>`;

        events.forEach(event => data.push({
          ...event,
          date:      format(event.begins_at, 'DD.MM.YYYY'),
          highlight: event.name.replace(search, replace),
        }));

        this.suggestions = [{ data }];
      },

      onSelected(item) {
        const url = this.localePath('galleries-upload') + '?event=' + item.item.id;

        this.$router.push({ path: url });
      }
    },

    watchQuery: ['event', 'gallery'],
  }
</script>


<style scoped>
  .flyer { flex-basis: 120px }

  .card.disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
</style>

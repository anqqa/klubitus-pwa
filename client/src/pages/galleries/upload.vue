<template>
  <main class="row">
    <div class="col-3" />

    <div class="col-6 main-content">
      <header>
        <h1>Upload Photos</h1>
      </header>

      <br />

      <section class="card">
        <header>
          <h2 class="has-text-secondary">Step 1: Select event</h2>
          <nav v-if="event" class="actions">
            <nuxt-link v-if="event" :to="localePath('galleries-upload')" class="button">
              <span class="icon"><i class="bx bx-undo"/></span>
              Change
            </nuxt-link>
          </nav>
        </header>

        <div v-if="!event" class="card-content">
          <vue-autosuggest
            :input-props="inputProps"
            :suggestions="suggestions"
            @selected="onSelected"
          >
            <template slot-scope="{ suggestion }">
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
              <img :src="event.flyer_front_url" />
            </figure>
          </div>

          <div class="col">
            <h3>{{ eventName }}</h3>
            <p>{{ eventInfo }}</p>
          </div>
        </div>
      </section>

      <br />

      <section :class="{ disabled: !event }" class="card">
        <header>
          <h2 class="has-text-secondary">Step 2: Add photos</h2>
        </header>

        <div v-if="event" class="card-content">
          <p v-if="photosRemaining.length">
            <button class="button is-primary" @click="startUpload">
              <span class="icon"><i class="bx bx-cloud-upload"/></span>
              Upload {{ photosRemaining.length }} Photo(s)
            </button>
            {{ sizeRemaining }}
          </p>

          <p v-if="photosUploaded.length" class="notification is-success">
            🎉 Photos ({{ photosUploaded.length }}) uploaded!
          </p>
          <p v-if="photosFailed.length" class="notification is-fail">
            😭 Some photos ({{ photosFailed.length }}) failed to upload... retry?
          </p>

          <upload
            ref="upload"
            endpoint="/galleries/upload"
            multiple
            name="photos"
            :metadata="metadata"
            @filesUpdated="files = $event"
          />
        </div>
      </section>
    </div>

    <div class="col-1" />

    <aside class="sidebar col-2">
      <header>
        <h2>What now</h2>
      </header>
    </aside>
  </main>
</template>

<script>
import format from 'date-fns/format';
import debounce from 'lodash/debounce';

import Upload from '../../components/Upload';
import Event from '../../models/Event';
import Gallery from '../../models/Gallery';
import { nFormatter } from '../../utils/text';

export default {
  head: {
    title: 'Upload photos',
  },

  async asyncData({ query }) {
    const eventId = parseInt(query.event);
    const galleryId = parseInt(query.gallery);

    if (eventId) {
      const event = await Event.find(eventId);

      if (event) {
        return { event, gallery: null };
      }
    } else if (galleryId) {
      const gallery = await Gallery.find(galleryId);

      return { event: gallery.event, gallery };
    }

    return { event: null, gallery: null };
  },

  components: { Upload },

  data() {
    return {
      event: null,
      events: [],
      files: [],
      gallery: null,
      suggestions: [],

      inputProps: {
        id: 'input-event',
        onInputChange: debounce(this.fetchEvents, 250),
        placeholder: 'Search...',
      },
    };
  },

  computed: {
    eventDate() {
      return new Date(this.event ? this.event.begins_at : this.gallery.event_date);
    },

    eventInfo() {
      if (this.event) {
        return (
          format(this.event.begins_at, 'MMMM D, YYYY') +
          ' @ ' +
          this.event.venue_name +
          ', ' +
          this.event.city_name
        );
      } else {
        return format(this.gallery.event_date, 'MMMM D, YYYY');
      }
    },

    eventName() {
      return this.event ? this.event.name : this.gallery.name;
    },

    metadata() {
      if (this.gallery) {
        return { gallery_id: this.gallery.id };
      } else if (this.event) {
        return { event_id: this.event.id };
      }

      return null;
    },

    photosFailed() {
      return this.files.filter(file => file.failed);
    },

    photosRemaining() {
      return this.files.filter(file => !file.uploaded);
    },

    photosUploaded() {
      return this.files.filter(file => file.uploaded);
    },

    sizeRemaining() {
      const totalSize = this.photosRemaining.reduce((total, file) => total + file.filesize, 0);

      return nFormatter(totalSize, 2, true);
    },
  },

  methods: {
    async fetchEvents(search) {
      if (!search || search.length < 3) {
        this.suggestions = [];

        return;
      }

      const events = await Event.params({ search, sort: '-begins_at' }).get();

      const data = [];
      const highlight = new RegExp(search, 'ig');
      const replace = match => `<em>${match}</em>`;

      events.forEach(event =>
        data.push({
          ...event,
          date: format(event.begins_at, 'DD.MM.YYYY'),
          highlight: event.name.replace(highlight, replace),
        })
      );

      this.suggestions = [{ data }];
    },

    onSelected(item) {
      const url = this.localePath('galleries-upload') + '?event=' + item.item.id;

      this.$router.push({ path: url });
    },

    startUpload() {
      this.$refs.upload.upload();
    },
  },

  watchQuery: ['event', 'gallery'],
};
</script>

<style scoped>
.flyer {
  flex-basis: 120px;
}

.card.disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>

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
            :input-props="{ id: 'input-event', placeholder: 'Search...' }"
            :suggestions="suggestions"
            @input="onInputChange"
            @selected="onSelected"
          >
            <template slot-scope="{ suggestion }">
              <span class="has-text-tertiary">{{ suggestion.item.date }} </span>
              <span v-html="suggestion.item.highlight" />
              @ {{ suggestion.item.venue_name }}, {{ suggestion.item.city_name }}
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
            :endpoint="uploadEndpoint"
            multiple
            name="file"
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

<script lang="ts">
import format from 'date-fns/format';
import debounce from 'lodash/debounce';
import { Component, Vue } from 'nuxt-property-decorator';

import Upload from '@/components/Upload.vue';
import Event from '@/models/Event';
import Gallery from '@/models/Gallery';
import { nFormatter } from '@/utils/text';

const eventFields = ['begins_at', 'city_name', 'flyer_front_url', 'id', 'name', 'venue_name'];

@Component({
  components: { Upload },
  head: { title: 'Upload photos' },
  watchQuery: ['event', 'gallery'],
})
export default class GalleriesUpload extends Vue {
  event: Event | null = null;
  events: Event[] = [];
  files: any[] = [];
  gallery: Gallery | null = null;
  suggestions: any[] = [];

  onInputChange = debounce(this.fetchEvents, 250);

  get eventDate() {
    if (this.event) {
      return new Date(this.event.begins_at!);
    } else if (this.gallery) {
      return new Date(this.gallery.event_date!);
    }
  }

  get eventInfo() {
    if (this.event) {
      return (
        format(this.event.begins_at!, 'MMMM D, YYYY') +
        ' @ ' +
        this.event.venue_name +
        ', ' +
        this.event.city_name
      );
    } else if (this.gallery) {
      return format(this.gallery.event_date!, 'MMMM D, YYYY');
    }
  }

  get eventName() {
    return this.event ? this.event!.name : this.gallery!.name;
  }

  get metadata() {
    if (this.gallery) {
      return { gallery_id: this.gallery.id };
    } else if (this.event) {
      return { event_id: this.event.id };
    }

    return null;
  }

  get photosFailed() {
    return this.files.filter(file => file.failed);
  }

  get photosRemaining() {
    return this.files.filter(file => !file.uploaded);
  }

  get photosUploaded() {
    return this.files.filter(file => file.uploaded);
  }

  get sizeRemaining() {
    const totalSize = this.photosRemaining.reduce((total, file) => total + file.filesize, 0);

    return nFormatter(totalSize, 2, true);
  }

  get uploadEndpoint() {
    if (this.gallery) {
      return '/' + this.gallery.images().endpoint();
    } else if (this.event) {
      return '/' + this.event.images().endpoint();
    }
  }

  async asyncData({ query }) {
    const eventId = parseInt(query.event);
    const galleryId = parseInt(query.gallery);

    if (eventId) {
      const event = await new Event().select(eventFields).find(eventId);

      if (event) {
        return { event, gallery: null };
      }
    } else if (galleryId) {
      const gallery = await new Gallery()
        .select(['event_date', 'id', 'name'])
        .relation('event', eventFields)
        .find(galleryId);

      return { event: gallery.event, gallery };
    }

    return { event: null, gallery: null };
  }

  async fetchEvents(search) {
    if (!search || search.length < 3) {
      this.suggestions = [];

      return;
    }

    const events = await new Event()
      .select(eventFields)
      .filter('name', 'cont', search)
      .sort('begins_at', 'DESC')
      .get();

    const data: any[] = [];
    const highlight = new RegExp(search, 'ig');
    const replace = match => `<em>${match}</em>`;

    events.forEach(event =>
      data.push({
        ...event,
        date: format(event.begins_at!, 'DD.MM.YYYY'),
        highlight: event.name!.replace(highlight, replace),
      })
    );

    this.suggestions = [{ data }];
  }

  onSelected(item) {
    const url = this.localePath('galleries-upload') + '?event=' + item.item.id;

    this.$router.push({ path: url });
  }

  startUpload() {
    // @ts-ignore
    this.$refs.upload.upload();
  }
}
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

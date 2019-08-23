<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6">
        <h1 class="headline">Upload Photos</h1>

        <v-card class="my-4">
          <v-card-title class="title">
            <v-avatar color="secondary" class="mr-2" size="40">1</v-avatar> Select event
          </v-card-title>

          <v-card-text v-if="!event">
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

            <span class="separator my-4">or</span>

            Choose from your latest favorites:
          </v-card-text>

          <template v-else>
            <v-img v-if="event.flyer_front_url" :src="event.flyer_front_url" aspect-ratio="16/9" />

            <v-card-title>{{ eventName }}</v-card-title>
            <v-card-text>{{ eventInfo }}</v-card-text>

            <v-card-actions>
              <v-btn :to="localePath('galleries-upload')" text nuxt>
                <v-icon left>mdi-undo</v-icon> Change event
              </v-btn>
            </v-card-actions>
          </template>
        </v-card>

        <v-card :disabled="!event">
          <v-card-title class="title">
            <v-avatar color="secondary" class="mr-2" sie="40">2</v-avatar> Add photos
          </v-card-title>

          <v-card-text v-if="event">
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
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
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

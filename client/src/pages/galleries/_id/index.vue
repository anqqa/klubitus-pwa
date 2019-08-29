<template>
  <v-container fluid>
    <v-breadcrumbs :items="breadcrumbs" />

    <v-row justify="space-between">
      <v-col cols="12" md="9">
        <h1 class="display-1" v-text="eventName" />
        <h2 class="headline">
          {{ format(gallery.image_count) }} images, {{ format(commentCount) }} comments
        </h2>
      </v-col>
      <v-col v-if="isAuthenticated" cols="auto">
        <v-btn :to="`${localePath('galleries-upload')}?gallery=${gallery.id}`" color="primary" nuxt>
          <v-icon left>mdi-image-plus</v-icon> Add Photos
        </v-btn>
      </v-col>
    </v-row>

    <ImageList :images="images" :url="url" />
  </v-container>
</template>

<script lang="ts">
import format from 'date-fns/format';
import { Component, Vue } from 'nuxt-property-decorator';

import ImageList from '@/components/galleries/ImageList.vue';
import Gallery from '@/models/Gallery';
import Image from '@/models/Image';
import { authStore } from '@/store/auth';

const formatter = new Intl.NumberFormat();

@Component({
  components: { ImageList },
})
export default class SingleGallery extends Vue {
  @authStore.Getter
  isAuthenticated!: boolean;

  gallery?: Gallery;
  images?: Image[];

  format = formatter.format;

  async asyncData({ params }) {
    const galleryId = parseInt(params.id);

    const gallery = await new Gallery().find(galleryId);
    const images = await gallery
      .images()
      .sort('id', 'DESC')
      .get();

    return { gallery, images };
  }

  get url() {
    return `${this.$route.path}/:imageId`;
  }

  get breadcrumbs() {
    const pathName = 'galleries-events-year-month-day';

    return [
      { to: this.localePath('galleries'), text: 'Galleries' },
      { to: this.localePath(pathName), text: 'Events' },
      {
        to: this.localePath({
          name: pathName,
          params: { year: this.eventDate.getFullYear().toString() },
        }),
        text: format(this.eventDate, 'yyyy'),
      },
      {
        to: this.localePath({
          name: pathName,
          params: {
            year: this.eventDate.getFullYear().toString(),
            month: (this.eventDate.getMonth() + 1).toString(),
          },
        }),
        text: format(this.eventDate, 'MMMM'),
      },
      { to: this.$route.fullPath, text: this.eventName, disabled: true },
    ];
  }

  get commentCount(): number {
    let count = 0;

    this.images!.forEach(image => (count += image.comment_count!));

    return count;
  }

  get eventDate(): Date {
    return new Date(
      this.gallery!.event ? this.gallery!.event.begins_at! : this.gallery!.event_date!
    );
  }

  get eventName(): string | undefined {
    return this.gallery!.event ? this.gallery!.event.name : this.gallery!.name;
  }

  head() {
    return {
      title: this.gallery ? this.gallery.name : 'Gallery',
    };
  }

  validate({ params }) {
    return /^\d+/.test(params.id);
  }
}
</script>

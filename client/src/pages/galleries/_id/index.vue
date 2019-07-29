<template>
  <main>
    <div class="col main-content">
      <breadcrumbs :breadcrumbs="breadcrumbs" />

      <header>
        <h1>
          {{ eventName }}
          <br />
          <small
            >{{ format(gallery.image_count) }} images, {{ format(commentCount) }} comments</small
          >
        </h1>

        <nav v-if="isAuthenticated" class="actions">
          <nuxt-link
            :to="`${localePath('galleries-upload')}?gallery=${gallery.id}`"
            class="button is-primary"
          >
            <span class="icon"><i class="bx bx-cloud-upload"/></span>
            Upload Photos
          </nuxt-link>
        </nav>
      </header>

      <image-list :images="images" :url="url" />
    </div>
  </main>
</template>

<script lang="ts">
import format from 'date-fns/format';
import { Component, Vue } from 'nuxt-property-decorator';

import Gallery from '@/models/Gallery';
import Image from '@/models/Image';
import Breadcrumbs from '../../../components/Breadcrumbs.vue';
import ImageList from '../../../components/galleries/ImageList.vue';

const formatter = new Intl.NumberFormat();

@Component({
  components: { Breadcrumbs, ImageList },
})
export default class SingleGallery extends Vue {
  gallery?: Gallery;
  images?: Image[];

  async asyncData({ params }) {
    const galleryId = parseInt(params.id);

    const gallery = await new Gallery().find(galleryId);
    const images = await gallery.images().get();

    return { gallery, images };
  }

  get url() {
    return `${this.$route.path}/:imageId`;
  }

  get breadcrumbs() {
    const pathName = 'galleries-events-year-month-day';

    return [
      { url: this.localePath('galleries'), title: 'Galleries' },
      { url: this.localePath(pathName), title: 'Events' },
      {
        url: this.localePath({
          name: pathName,
          params: { year: this.eventDate.getFullYear().toString() },
        }),
        title: format(this.eventDate, 'YYYY'),
      },
      {
        url: this.localePath({
          name: pathName,
          params: {
            year: this.eventDate.getFullYear().toString(),
            month: (this.eventDate.getMonth() + 1).toString(),
          },
        }),
        title: format(this.eventDate, 'MMMM'),
      },
      { url: this.$route.fullPath, title: this.eventName, current: true },
    ];
  }

  get commentCount() {
    let count = 0;

    this.images!.forEach(image => (count += image.comment_count!));

    return count;
  }

  get eventDate() {
    return new Date(
      this.gallery!.event ? this.gallery!.event.begins_at! : this.gallery!.event_date!
    );
  }

  get eventName() {
    return this.gallery!.event ? this.gallery!.event.name : this.gallery!.name;
  }

  format(value: number) {
    return formatter.format(value);
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

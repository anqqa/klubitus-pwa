<template>

  <main>

    <div class="col main-content">
      <Breadcrumbs :breadcrumbs="breadcrumbs" />

      <header>
        <h1>
          {{ eventName }}
          <br>
          <small>{{ format(gallery.image_count) }} images, {{ format(commentCount) }} comments</small>
        </h1>

        <nav v-if="isAuthenticated" class="actions">
          <nuxt-link :to="`${localePath('galleries-upload')}?gallery=${gallery.id}`" class="button is-primary">
            <span class="icon"><i class="bx bx-cloud-upload" /></span>
            Upload Photos
          </nuxt-link>
        </nav>
      </header>

      <ImageList :images="images" :url="url" />
    </div>
  </main>

</template>


<script>
  import format from 'date-fns/format';
  import { mapGetters } from 'vuex';

  import Breadcrumbs from '../../../components/Breadcrumbs';
  import ImageList from '../../../components/galleries/ImageList';


  const formatter = new Intl.NumberFormat();

  export default {

    async asyncData({ app, params }) {
      const galleryId = parseInt(params.id);

      const { data: gallery } = await app.$axios.$get(`galleries/${galleryId}`);
      const { data: images }  = await app.$axios.$get(`galleries/${galleryId}/images`);

      return { gallery, images };
    },

    components: { Breadcrumbs, ImageList },

    data() {
      return { url: `${this.$route.path}/:imageId` };
    },

    computed: {
      breadcrumbs() {
        const pathName = 'galleries-events-year-month-day';

        return [
          { url: this.localePath('galleries'), title: 'Galleries' },
          { url: this.localePath(pathName), title: 'Events' },
          { url: this.localePath({
              name: pathName,
              params: { year: this.eventDate.getFullYear() },
            }),
            title: format(this.eventDate, 'YYYY'),
          },
          { url: this.localePath({
              name: pathName,
              params: { year: this.eventDate.getFullYear(), month: this.eventDate.getMonth() + 1 },
            }),
            title: format(this.eventDate, 'MMMM'),
          },
          { url: this.$route.fullPath, title: this.eventName, current: true },
        ];
      },

      commentCount() {
        let count = 0;

        this.images.forEach(image => count += image.comment_count);

        return count;
      },

      eventDate() { return new Date(this.gallery.event ? this.gallery.event.begins_at : this.gallery.event_date); },
      eventName() { return this.gallery.event ? this.gallery.event.name : this.gallery.name; },

      ...mapGetters({
        isAuthenticated: 'auth/isAuthenticated',
      })
    },

    methods: {
      format: formatter.format,
    },

    head() {
      return {
        title: this.gallery ? this.gallery.name : 'Gallery',
      };
    },

    validate({ params }) {
      return /^\d+/.test(params.id);
    },

  };
</script>


<style scoped>

</style>

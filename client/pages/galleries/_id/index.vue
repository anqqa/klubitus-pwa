<template>

  <main>
    <Breadcrumbs :breadcrumbs="breadcrumbs" />
    <h1>
      {{ eventName }}
      <small> - {{ format(gallery.image_count) }} images</small>
    </h1>

    <ImageList :images="images" :url="url" />
  </main>

</template>


<script>
  import format from 'date-fns/format';

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
        return [
          { url: this.localePath({ name: 'galleries' }), title: 'Galleries' },
          { url: this.localePath({ name: 'galleries-events-year-month-day' }), title: 'Events' },
          { url: this.localePath({
              name: 'galleries-events-year-month-day',
              params: { year: this.eventDate.getFullYear() },
            }),
            title: format(this.eventDate, 'YYYY'),
          },
          { url: this.localePath({
              name: 'galleries-events-year-month-day',
              params: { year: this.eventDate.getFullYear(), month: this.eventDate.getMonth() + 1 },
            }),
            title: format(this.eventDate, 'MMMM'),
          },
          { url: this.$route.fullPath, title: this.eventName, current: true },
        ];
      },

      eventDate() { return new Date(this.gallery.event ? this.gallery.event.begins_at : this.gallery.event_date); },
      eventName() { return this.gallery.event ? this.gallery.event.name : this.gallery.name; },
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

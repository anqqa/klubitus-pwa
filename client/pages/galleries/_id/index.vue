<template>

  <main>
    <h1>
      {{ gallery.name }}
      <small> - {{ format(gallery.image_count) }} images</small>
    </h1>

    <ImageList :images="images" :url="url" />
  </main>

</template>


<script>
  import ImageList from '../../../components/galleries/ImageList';


  const formatter = new Intl.NumberFormat();

  export default {

    async asyncData({ app, params }) {
      const galleryId = parseInt(params.id);

      const { data: gallery } = await app.$axios.$get(`gallery/${galleryId}`);
      const { data: images }  = await app.$axios.$get(`gallery/${galleryId}/images`);

      return { gallery, images };
    },

    components: { ImageList },

    data() {
      return { url: `${this.$route.path}/:imageId` };
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

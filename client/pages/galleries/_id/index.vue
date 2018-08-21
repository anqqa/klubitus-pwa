<template>
  <ImageList :images="images" :url="url" />
</template>


<script>
  import ImageList from '../../../components/galleries/ImageList';

  export default {

    async asyncData({ app, params, query }) {
      const galleryId = parseInt(params.id);
      const page      = parseInt(query.page) || 1;
      const limit     = 20;
      const offset    = (page - 1) * limit;

      const { data: images } = await app.$axios.$get(`gallery/${galleryId}/images`, { params: { limit, offset } });

      return { images };
    },

    components: { ImageList },

    data() {
      return { url: `${this.$route.path}:imageId` };
    },

    watchQuery: ['page'],

  };
</script>


<style scoped>

</style>

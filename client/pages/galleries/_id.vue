<template>

  <main>
    <h1>
      {{ gallery.name }}
      <small> - {{ format(gallery.image_count) }} images</small>
    </h1>

    <Pagination v-if="pages > 1" :pages="pages" :route="route" />

  </main>

</template>


<script>
  import Pagination from '../../components/Pagination';


  const formatter = new Intl.NumberFormat();

  export default {

    async asyncData({ app, params }) {
      const { data: gallery } = await app.$axios.$get(`gallery/${parseInt(params.id)}`);

      return { gallery, pages: Math.ceil(gallery.image_count / 20) };
    },

    components: { Pagination },

    data() {
      return { route: { name: 'gallery', params: this.$route.params } };
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
    }

  };
</script>


<style scoped>

</style>

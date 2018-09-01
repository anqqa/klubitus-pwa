<template>
  <div>
    <GalleryList :galleries="galleries" />
  </div>
</template>


<script>
  import GalleryList from '../../../../../components/galleries/GalleryList';
  import { Actions } from '../../../../../store/galleries';


  const dateFromParams = params => ({
    day:   parseInt(params.day),
    month: parseInt(params.month),
    year:  parseInt(params.year),
  });


  export default {
    async fetch({ params, query, store }) {
      const page  = parseInt(query.page) || 1;

      await store.dispatch(Actions.GET_GALLERIES_BY_DATE, { ...dateFromParams(params), page });
    },

    components: { GalleryList },

    computed: {
      galleries() {
        const getter = this.$store.getters['galleries/galleriesByDate'];

        return getter(dateFromParams(this.$route.params), this.page);
      },

      page() { return parseInt(this.$route.query.page) || 1; },
    },

    validate({ params }) {
      const year  = !params.year || /^\d{4}$/.test(params.year);
      const month = !params.month || /^[01]?\d$/.test(params.month);
      const day   = !params.day || /^[0-3]?\d$/.test(params.day);

      return year && month && day;
    },

    watchQuery: ['page'],

  };
</script>

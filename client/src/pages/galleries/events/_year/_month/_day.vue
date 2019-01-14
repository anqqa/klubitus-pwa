<template>
  <div>
    <GalleryList :galleries="galleries" />
  </div>
</template>


<script>
  import GalleryList from '../../../../../components/galleries/GalleryList';
  import { Actions, Getters } from '../../../../../store/galleries';


  const dateFromParams = params => ({
    day:   parseInt(params.day),
    month: parseInt(params.month),
    year:  parseInt(params.year),
  });


  export default {
    async fetch({ params, query, store }) {
      const page         = parseInt(query.page) || 1;
      const dateParams   = dateFromParams(params);
      const getGalleries = store.getters[`galleries/${Getters.GALLERIES_BY_DATE}`];

      if (!getGalleries(dateParams, page).length) {
        await store.dispatch(`galleries/${Actions.GET_GALLERIES_BY_DATE}`, { ...dateParams, page });
      }
    },

    components: { GalleryList },

    computed: {
      galleries() {
        const galleriesWithRelations = [];

        const getGalleries = this.$store.getters[`galleries/${Getters.GALLERIES_BY_DATE}`];
        const galleries    = getGalleries(dateFromParams(this.$route.params), this.page);

        galleries.forEach(gallery => galleriesWithRelations.push({
          ...gallery,
          default_image: gallery.default_image_id && this.$store.state.images.images[gallery.default_image_id],
        }));

        return galleriesWithRelations;
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

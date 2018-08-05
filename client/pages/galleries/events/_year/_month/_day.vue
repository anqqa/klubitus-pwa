<template>
  <GalleryList :galleries="galleries" />
</template>


<script>
  import format from 'date-fns/format';

  import GalleryList from '../../../../../components/galleries/GalleryList';
  import { dateRange } from '../../../../../utils/time';


  export default {
    async asyncData({ app, params, query }) {
      const year  = parseInt(params.year);
      const month = parseInt(params.month);
      const day   = parseInt(params.day);
      const page  = parseInt(query.page) || 1;

      const reqParams = { limit: 20 };

      if (year) {
        const { from, to } = dateRange(year, month, undefined, day);

        reqParams.from   = format(from, 'YYYY-MM-DD');
        reqParams.to     = format(to, 'YYYY-MM-DD');
        reqParams.offset = (page - 1) * reqParams.limit;
      }

      const { data } = await app.$axios.get('galleries', { params: reqParams });

      return { galleries: data.data };
    },

    components: { GalleryList },

    validate({ params }) {
      const year  = !params.year || /^\d{4}$/.test(params.year);
      const month = !params.month || /^[01]?\d$/.test(params.month);
      const day   = !params.day || /^[0-3]?\d$/.test(params.day);

      return year && month && day;
    },

    watchQuery: ['page'],

  };
</script>

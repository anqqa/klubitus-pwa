<template>

  <main>

    <nav class="tabs is-small is-mobile">
      <nuxt-link v-for="browseYear in Object.keys(stats).sort().reverse()"
                 :key="browseYear"
                 :to="localePath({ name: 'galleries-events-year-month-day', params: { year: browseYear } })">
        {{ browseYear }}
      </nuxt-link>
    </nav>

    <nav v-if="year" class="tabs is-small is-mobile">
      <nuxt-link v-for="browseMonth in stats[year]"
                 :key="browseMonth.month"
                 :to="localePath({ name: 'galleries-events-year-month-day', params: { year, month: browseMonth.month } })">
        {{ browseMonth.nameShort }}
      </nuxt-link>
    </nav>

    <h1>
      {{ title }}
      <small v-if="galleries">
        - {{ format(galleries) }} galleries with {{ format(images) }} images
      </small>
    </h1>

    <Pagination v-if="pages > 1" :pages="pages" :route="route" />

    galtsut

    <Pagination v-if="pages > 1" :pages="pages" :route="route" />
  </main>

</template>


<script>
  import format from 'date-fns/format';
  import Pagination from '~/components/Pagination';


  const formatter = new Intl.NumberFormat();

  export default {

    async asyncData({ app, params }) {
      const day   = parseInt(params.day);
      const month = parseInt(params.month);
      const year  = parseInt(params.year);

      let title     = year || 'Event Galleries';
      let galleries = 0;
      let images    = 0;
      const stats   = {};

      const { data } = await app.$axios.get('galleries/stats');

      data.data.forEach(stat => {
        const monthDate  = new Date(stat.year, stat.month - 1);
        const monthStats = {
          galleries: stat.gallery_count,
          images:    stat.image_count,
          month:     stat.month,
          nameLong:  format(monthDate, 'MMMM'),
          nameShort: format(monthDate, 'MMM'),
        };

        if (year === stat.year && month === stat.month) {
          title     = format(monthDate, 'MMMM YYYY');
          galleries = stat.gallery_count;
          images    = stat.image_count;
        }
        else if (year === stat.year && !month) {
          galleries += stat.gallery_count;
          images    += stat.image_count;
        }

        if (!stats[stat.year]) {
          stats[stat.year] = [];
        }

        stats[stat.year].push(monthStats);
      });

      const pages = Math.ceil(galleries / 20);

      return { day, galleries, images, month, pages, stats, title, year };
    },

    components: { Pagination },

    data() {
      return {
        route:  { name: 'galleries-events-year-month-day', params: this.$route.params },
      };
    },

    computed: {
      page() { return parseInt(this.$route.query.page) || 1; },
    },

    head: {
      title: this.title
    },

    methods: {
      format: formatter.format,
    },

  }
</script>

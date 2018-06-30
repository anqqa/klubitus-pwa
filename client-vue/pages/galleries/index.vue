<template>

  <main>

    <nav class="tabs is-small is-mobile">
      <nuxt-link v-for="browseYear in Object.keys(stats).sort().reverse()"
                 :key="browseYear"
                 :class="year == browseYear && 'is-active'"
                 :to="localePath({ name: 'galleries-date', params: { year: browseYear } })">
        {{ browseYear }}
      </nuxt-link>
    </nav>

    <nav v-if="year" class="tabs is-small is-mobile">
      <nuxt-link v-for="browseMonth in stats[year]"
                 :key="browseMonth.month"
                 :class="browseMonth.month == month && 'is-active'"
                 :to="localePath({ name: 'galleries-date', params: { year, month: browseMonth.month } })">
        {{ browseMonth.nameShort }}
      </nuxt-link>
    </nav>

    <h1>
      {{ title }}
      <small v-if="galleries">
        - {{ format(galleries) }} galleries with {{ format(images) }} images
      </small>
    </h1>

    <b-pagination v-if="pages > 1"
                  id="top-navigation"
                  :current.sync="page"
                  :total="galleries"
                  per-page="20"
                  @change="onPageChange" />

    <nuxt-child />

    <b-pagination v-if="pages > 1"
                  :current.sync="page"
                  :total="galleries"
                  per-page="20"
                  @change="onPageChange" />
  </main>

</template>


<script>
  import format from 'date-fns/format';


  const formatter = new Intl.NumberFormat();

  export default {

    async asyncData({ app, params }) {
      const day   = parseInt(params.day);
      const month = parseInt(params.month);
      const page  = parseInt(params.page) || 1;
      const year  = parseInt(params.year);

      let title     = year || 'Galleries';
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

      return { day, galleries, images, month, page, pages, stats, title, year };
    },

    head: {
      title: 'Galleries'
    },

    methods: {
      format: formatter.format,

      onPageChange(page) {
        const { params } = this.$route;

        if (page > 1) {
          params.page = page;
        }
        else if (params.page) {
          delete params.page;
        }

        this.$router.push(this.localePath({ name: 'galleries-date', params }));

        document.querySelector('#top-navigation').scrollIntoView({ behavior: 'smooth' });
      }
    },

  }
</script>

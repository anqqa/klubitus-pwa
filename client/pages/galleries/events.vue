import format from "date-fns/format";
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
      <nuxt-link v-for="browseMonth in Object.keys(stats[year]).sort().reverse()"
                 :key="browseMonth"
                 :to="localePath({ name: 'galleries-events-year-month-day', params: { year, month: browseMonth } })">
        {{ stats[year][browseMonth].name }}
      </nuxt-link>
    </nav>

    <h1>
      {{ title }}
      <small v-if="galleries">
        - {{ format(galleries) }} galleries with {{ format(images) }} images
      </small>
    </h1>

    <Pagination v-if="pages > 1" :pages="pages" :route="route" />

    <nuxt-child />

    <Pagination v-if="pages > 1" :pages="pages" :route="route" />
  </main>

</template>


<script>
  import format from 'date-fns/format';
  import get from 'lodash/get';
  import sumBy from 'lodash/sumBy';
  import transform from 'lodash/transform';

  import Pagination from '~/components/Pagination';


  const formatter = new Intl.NumberFormat();

  export default {

    async asyncData({ app }) {
      const { data } = await app.$axios.get('galleries/stats');

      const stats = transform(data.data, (result, value) => {
        (result[value.year] || (result[value.year] = {}))[value.month] = {
          galleries: value.gallery_count,
          images:    value.image_count,
          name:      format(new Date(value.year, value.month - 1), 'MMM'),
        };
      }, {});

      return { stats };
    },

    components: { Pagination },

    computed: {
      day() { return parseInt(this.$route.params.day); },
      month() { return parseInt(this.$route.params.month); },
      page() { return parseInt(this.$route.query.page) || 1; },
      route() { return { name: 'galleries-events-year-month-day', params: this.$route.params }; },
      year() { return parseInt(this.$route.params.year); },

      galleries() { return this.getStat('galleries'); },
      images() { return this.getStat('images'); },
      pages() { return Math.ceil(this.galleries / 20); },
      title() { return this.month ? format(new Date(this.year, this.month - 1), 'MMMM YYYY') : this.year || 'Event Galleries'; },
    },

    head: {
      title: this.title
    },

    methods: {
      format: formatter.format,

      getStat(stat) {
        if (this.month) {
          return get(this.stats, [this.year, this.month, stat].join('.'), 0);
        }

        if (this.year) {
          return sumBy(Object.values(get(this.stats, this.year)), stat);
        }

        return 0;
      }
    },

  }
</script>

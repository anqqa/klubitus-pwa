<template>

  <main class="row">

    <nav class="sidebar col-2">
      <nuxt-link :to="localePath('galleries')">&laquo; Galleries Home</nuxt-link>
      <br>

      <section :class="{ collapsed }">
        <header class="show-phone" @click="toggleList">
          <h2>
            <span>Select date</span>
            <span class="icon has-text-secondary">
              <i :class="`${collapsed ? 'bx-chevrons-down' : 'bx-chevrons-up'}`" class="bx" />
            </span>
          </h2>
        </header>

        <div v-for="browseYear in Object.keys(stats).sort().reverse()"
             :key="browseYear"
             class="collapsible">

          <nuxt-link :to="localePath({
            name: 'galleries-events-year-month-day',
            params: { year: browseYear },
          })">
            <h4>
              {{ browseYear }}
              <small class="has-text-tertiary">
                ({{ getStat('galleries', browseYear) }})
              </small>
            </h4>
          </nuxt-link>

          <ul v-if="~~year === ~~browseYear">
            <li v-for="browseMonth in Object.keys(stats[year]).sort().reverse()"
                :key="browseMonth">
              <nuxt-link :to="localePath({
                name: 'galleries-events-year-month-day',
                params: { year, month: browseMonth },
              })">
                <h4>
                  {{ stats[year][browseMonth].name }}
                  <small class="has-text-tertiary">
                    ({{ stats[year][browseMonth].galleries }})
                  </small>
                </h4>
              </nuxt-link>
            </li>
          </ul>

        </div>
      </section>
    </nav>

    <div class="col main-content">
      <h1>
        {{ title }}
        <small v-if="galleries">
          - {{ format(galleries) }} galleries with {{ format(images) }} images
        </small>
      </h1>

      <Pagination v-if="pages > 1" :pages="pages" :route="route" />

      <nuxt-child :key="$route.fullPath" />

      <Pagination v-if="pages > 1" :pages="pages" :route="route" />
    </div>
  </main>

</template>


<script>
  import format from 'date-fns/format';
  import get from 'lodash/get';
  import sumBy from 'lodash/sumBy';
  import transform from 'lodash/transform';

  import Pagination from '../../components/Pagination';


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

    data() {
      return { collapsed: true };
    },

    computed: {
      day() { return parseInt(this.$route.params.day); },
      month() { return parseInt(this.$route.params.month); },
      page() { return parseInt(this.$route.query.page) || 1; },
      route() { return { name: 'galleries-events-year-month-day', params: this.$route.params }; },
      year() { return parseInt(this.$route.params.year); },

      galleries() { return this.getStat('galleries', this.year, this.month); },
      images() { return this.getStat('images', this.year, this.month); },
      pages() { return Math.ceil(this.galleries / 20); },
      title() { return this.month ? format(new Date(this.year, this.month - 1), 'MMMM YYYY') : this.year || 'Event Galleries'; },
    },

    head: {
      title: this.title
    },

    methods: {
      format: formatter.format,

      getStat(stat, year, month) {
        if (month) {
          return get(this.stats, [year, month, stat].join('.'), 0);
        }

        if (year) {
          return sumBy(Object.values(get(this.stats, year)), stat);
        }

        return 0;
      },

      toggleList() {
        this.collapsed = !this.collapsed;
      }
    },

  }
</script>


<style scoped>
  ul {
    border-bottom: 1px solid var(--color-separator);
  }

  @media screen and (min-width: 480px) {
    .collapsible {
      text-align: right;
    }
  }
</style>

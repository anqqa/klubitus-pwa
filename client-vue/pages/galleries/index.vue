<template>

  <v-container grid-list-lg>
    <v-layout row wrap>

      <v-flex xs12>

        <v-tabs :slider-color="year ? 'primary' : 'transparent'"
                color="transparent"
                next-icon="fas fa-angle-right"
                prev-icon="fas fa-angle-left"
                show-arrows>
          <v-tab v-for="browseYear in Object.keys(stats).sort().reverse()"
                 :key="browseYear"
                 :to="localePath({ name: 'galleries-date', params: { year: browseYear } })"
                 nuxt>{{ browseYear }}</v-tab>
        </v-tabs>

        <v-tabs v-if="year"
                :slider-color="month ? 'primary' : 'transparent'"
                color="transparent"
                next-icon="fas fa-angle-right"
                prev-icon="fas fa-angle-left"
                show-arrows>
          <v-tab v-for="browseMonth in stats[year]"
                 :key="browseMonth.month"
                 :to="localePath({ name: 'galleries-date', params: { year, month: browseMonth.month } })"
                 nuxt>{{ browseMonth.nameShort }}</v-tab>
        </v-tabs>

      </v-flex>

      <v-flex tag="h1" class="headline" xs12>
        {{ title }}
        <span v-if="galleries" class="subheading text--tertiary">
          - {{ format(galleries) }} galleries with {{ format(images) }} images
        </span>
      </v-flex>

      <v-flex xs12 class="text-xs-center">
        <v-pagination v-if="pages > 1"
                      id="top-navigation"
                      :length="pages"
                      v-model="page"
                      prev-icon="fas fa-angle-left"
                      next-icon="fas fa-angle-right"
                      @input="onPageChange"/>
      </v-flex>

      <nuxt-child />

      <v-flex xs12 class="text-xs-center">
        <v-pagination v-if="pages > 1"
                      :length="pages"
                      v-model="page"
                      prev-icon="fas fa-angle-left"
                      next-icon="fas fa-angle-right"
                      @input="onPageChange" />
      </v-flex>

    </v-layout>
  </v-container>

</template>


<script>
  import VPagination from 'vuetify/es5/components/VPagination';
  import { VTab, VTabs } from 'vuetify/es5/components/VTabs';

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

    components: { VPagination, VTab, VTabs },

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

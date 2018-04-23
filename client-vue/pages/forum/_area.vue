<template>

  <v-container grid-list-lg>
    <v-layout row wrap>

      <v-flex tag="h1" class="headline" xs12 v-text="area.name" />
      <v-flex tag="h2" class="subheading" xs12 v-html="area.description" />

      <v-flex xs12 md9 order-md2>
        <div class="text-xs-center">
          <v-pagination v-if="pages > 1"
                        id="top-navigation"
                        :length="pages"
                        v-model="page"
                        prev-icon="fas fa-angle-left"
                        next-icon="fas fa-angle-right"
                        @input="onPageChange" />
        </div>

        <nuxt-child :key="areaId" />

        <div class="text-xs-center">
          <v-pagination v-if="pages > 1"
                        :length="pages"
                        v-model="page"
                        prev-icon="fas fa-angle-left"
                        next-icon="fas fa-angle-right"
                        @input="onPageChange" />
        </div>
      </v-flex>

      <v-flex xs12 md3>
        <ForumAreaList :areas="areas" mini />
      </v-flex>

    </v-layout>
  </v-container>

</template>


<script>
  import VPagination from 'vuetify/es5/components/VPagination';

  import ForumAreaList from '~/components/forum/ForumAreaList';

  export default {
    async asyncData({ app, params }) {
      const areaId = parseInt(params.area);
      const page   = parseInt(params.page) || 1;

      const { data: areas } = await app.$axios.$get('forum/areas');

      let area;

      areas.forEach(_area => { if (_area.id === areaId) area = _area; });

      const pages = Math.ceil(area.topic_count / 20);

      return { area, areaId, areas, page, pages };
    },

    components: { ForumAreaList, VPagination },

    head: {
      title: 'Forum'
    },

    methods: {
      onPageChange(page) {
        const { params } = this.$route;

        if (page > 1) {
          params.page = page;
        }
        else if (params.page) {
          delete params.page;
        }

        this.$router.push(this.localePath({ name: 'forum-area-page', params }));

        document.querySelector('#top-navigation').scrollIntoView({ behavior: 'smooth' });
      }
    },

    validate({ params }) {
      return !(params && params.page && +params.page < 1);
    },

  };
</script>


<style scoped>

</style>

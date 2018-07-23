<template>

  <main>
    <h1 class="title" v-text="area.name" />
    <h2 class="subtitle" v-html="area.description" />

    <div class="row is-reverse-order">
      <div class="col">
        <Pagination :pages="pages" :route="route" />

        <nuxt-child :key="$route.fullPath" />
      </div>

      <div class="col-3">
        <ForumAreaList :areas="areas" mini />
      </div>
    </div>

  </main>

</template>


<script>
  import ForumAreaList from '~/components/forum/ForumAreaList';
  import Pagination from '~/components/Pagination';


  export default {

    async asyncData({ app, params }) {
      const areaId          = parseInt(params.area);
      const { data: areas } = await app.$axios.$get('forum/areas');

      let area;

      areas.forEach(_area => { if (_area.id === areaId) area = _area; });

      const pages = Math.ceil(area.topic_count / 20);

      return { area, areaId, areas, pages };
    },

    components: { ForumAreaList, Pagination },

    data() {
      return {
        route:  { name: 'forum-area', params: this.$route.params },
      };
    },

    computed: {
      page() { return parseInt(this.$route.query.page) || 1; },
    },

    head() {
      const link  = [];

      if (this.pages > 1) {
        const { params } = this.$route;

        if (this.page > 1) {
          const prevQuery = { ...this.$route.query };

          if (this.page > 2) {
            prevQuery.page = this.page - 1;
          }
          else if ('page' in prevQuery) {
            delete prevQuery.page;
          }

          link.push({ rel: 'prev', href: this.localePath({ name: this.route.name, params, query: prevQuery }) });
        }

        if (this.page < this.pages) {
          const nextQuery = { ...this.$route.query };

          nextQuery.page = this.page + 1;

          link.push({ rel: 'next', href: this.localePath({ name: this.route.name, params, query: nextQuery }) });
        }
      }

      return {
        link,
        title: this.area ? this.area.name : 'Forum',
      };
    },

  };
</script>

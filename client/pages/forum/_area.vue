<template>

  <main>
    <h1 class="title" v-text="area.name" />
    <h2 class="subtitle" v-html="area.description" />

    <div class="row is-reverse-order">
      <div class="col">

        <Pagination :page="page"
                    :pages="pages"
                    :url="paginationUrl"
        />

        <nuxt-child />
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
      const areaId = parseInt(params.area);
      const page   = parseInt(params.page) || 1;

      console.log('asyncData', page);

      const { data: areas } = await app.$axios.$get('forum/areas');

      let area;

      areas.forEach(_area => { if (_area.id === areaId) area = _area; });

      const pages = Math.ceil(area.topic_count / 20);

      return { area, areaId, areas, page, pages };
    },

    components: { ForumAreaList, Pagination },

    data() {
      const { params } = this.$route;

      console.log('data');

      params.page = '_page';

      return {
        paginationUrl: this.localePath({ name: 'forum-area-page', params }),
      };
    },

    head() {
      const link  = [];
      const page  = parseInt(this.page) || 1;
      const pages = parseInt(this.pages);

      if (pages > 1) {
        const { params } = this.$route;

        if (page > 1) {
          if (page > 2) {
            params.page = page - 1;
          }
          else {
            delete params.page;
          }

          link.push({ rel: 'prev', href: this.localePath({ name: 'forum-area-page', params }) });
        }

        if (page < this.pages) {
          params.page = page + 1;

          link.push({ rel: 'next', href: this.localePath({ name: 'forum-area-page' , params }) });
        }
      }

      return {
        link,
        title: this.area ? this.area.name : 'Forum',
      };
    },

    validate({ params }) {
      return !(params && params.page && +params.page < 1);
    },

  };
</script>


<style scoped>

</style>

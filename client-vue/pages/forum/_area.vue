<template>

  <main>
    <h1 class="title" v-text="area.name" />
    <h2 class="subtitle" v-html="area.description" />

    <div class="row is-reverse-order">
      <div class="col">

        <b-pagination v-if="pages > 1"
                      id="top-navigation"
                      :current.sync="page"
                      :total="area.topic_count"
                      order="is-centered"
                      per-page="20"
                      @change="onPageChange" />

        <nuxt-child />

        <b-pagination v-if="pages > 1"
                      :current.sync="page"
                      :total="area.topic_count"
                      order="is-centered"
                      per-page="20"
                      @change="onPageChange" />
      </div>

      <div class="col-3">
        <ForumAreaList :areas="areas" mini />
      </div>
    </div>

  </main>

</template>


<script>
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

    components: { ForumAreaList },

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

<template>

  <main class="row">

    <nav class="sidebar col-2">
      <ForumAreaList :areas="areas" />
    </nav>

    <div class="col main-content">
      <h1 class="title" v-text="area.name" />
      <h2 class="subtitle" v-html="area.description" />

      <Pagination :pages="pages" :route="route" />

      <nuxt-child :key="$route.fullPath" />
    </div>

  </main>

</template>


<script>
  import ForumAreaList from '../../components/forum/ForumAreaList';
  import Pagination from '../../components/Pagination';


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
      return {
        title: this.area ? this.area.name : 'Forum',
      };
    },

  };
</script>

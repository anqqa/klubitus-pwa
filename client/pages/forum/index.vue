<template>

  <main class="row">

    <nav class="sidebar col-3">
      <ForumAreaList :areas="areas" />
    </nav>

    <div class="col main-content">
      <h1>Forum</h1>

      <h2 class="h3">Latest</h2>

      <ForumTopicList :topics="topics" />
    </div>
  </main>

</template>


<script>
  import ForumAreaList from '../../components/forum/ForumAreaList';
  import ForumTopicList from '../../components/forum/ForumTopicList';


  export default {
    async asyncData({ app }) {
      const [{ data: areas }, { data: topics }] = await Promise.all([
        app.$axios.$get('forum/areas'),
        app.$axios.$get('forum/topics', { params: { limit: 20 } }),
      ]);

      return { areas, topics }
    },

    components: { ForumTopicList, ForumAreaList },

    head: {
      title: 'Forum'
    },

  };
</script>


<style scoped>

</style>

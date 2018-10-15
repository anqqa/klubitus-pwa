<template>

  <main>
    <h1>Forum</h1>

    <div class="row">
      <div class="col">
        <h2 class="h3">Latest</h2>

        <ForumTopicList :topics="topics" />
      </div>

      <ForumAreaList :areas="areas" class="col-5"/>
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

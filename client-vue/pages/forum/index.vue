<template>

  <main class="column section">
    <h1 class="title">Forum</h1>

    <div class="columns is-reverse-order">
      <div class="column is-half">
        <h2 class="subtitle">Latest</h2>

        <ForumTopicList :topics="topics" />
      </div>

      <div class="column is-half">
        <h2 class="subtitle">Areas</h2>

        <ForumAreaList :areas="areas" />
      </div>
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

<template>
  <ForumTopicList :topics="topics" area />
</template>


<script>
  import ForumTopicList from '../../../components/forum/ForumTopicList';


  export default {

    async asyncData({ app, params, query }) {
      const area  = parseInt(params.area);
      const page  = parseInt(query.page) || 1;
      const limit = 20;

      const { data: topics } = await app.$axios.$get('forum/topics', { params: { area, limit, page } });

      return { topics };
    },

    components: { ForumTopicList },

    watchQuery: ['page'],

  };
</script>

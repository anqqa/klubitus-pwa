<template>
  <ForumTopicList :topics="topics" area />
</template>


<script>
  import ForumTopicList from '~/components/forum/ForumTopicList';

  export default {
    async asyncData({ app, params }) {
      const area  = parseInt(params.area);
      const page  = parseInt(params.page) || 1;
      const limit = 20;

      const { data: topics } = await app.$axios.$get('forum/topics', { params: { area, limit, page } });

      return { topics };
    },

    components: { ForumTopicList },
  };
</script>

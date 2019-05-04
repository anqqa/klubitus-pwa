<template>
  <forum-topic-list :topics="topics" area />
</template>

<script>
import ForumTopicList from '../../../components/forum/ForumTopicList';
import ForumTopic from '../../../models/ForumTopic';

export default {
  async asyncData({ params, query }) {
    const area = parseInt(params.area);
    const page = parseInt(query.page) || 1;
    const limit = 20;

    const topics = await ForumTopic.params({ area_id: area })
      .limit(limit)
      .page(page)
      .get();

    return { topics };
  },

  components: { ForumTopicList },

  watchQuery: ['page'],
};
</script>

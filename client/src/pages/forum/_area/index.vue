<template>
  <forum-topic-list :topics="topics" area />
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';

import ForumTopicList from '@/components/forum/ForumTopicList.vue';
import ForumTopic from '@/models/ForumTopic';

@Component({
  components: { ForumTopicList },
  watchQuery: ['page'],
})
export default class SingleArea extends Vue {
  async asyncData({ params, query }) {
    const areaId = parseInt(params.area);
    const page = parseInt(query.page) || 1;
    const limit = 20;

    const topics = await new ForumTopic()
      .filter('forum_area_id', 'eq', areaId)
      .relation('area')
      .relation('author')
      .limit(limit)
      .page(page)
      .get();

    return { topics };
  }
}
</script>

<template>
  <forum-post-list :posts="posts" />
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';

import ForumPostList from '@/components/forum/ForumPostList.vue';
import ForumTopic from '@/models/ForumTopic';

@Component({
  components: { ForumPostList },
  watchQuery: ['page'],
})
export default class TopicPosts extends Vue {
  async asyncData({ params, query }) {
    const topic_id = parseInt(params.id);
    const page = parseInt(query.page) || 1;
    const limit = 20;

    const posts = await new ForumTopic({ id: topic_id })
      .posts()
      .relation('author')
      .limit(limit)
      .page(page)
      .get();

    return { posts };
  }
}
</script>

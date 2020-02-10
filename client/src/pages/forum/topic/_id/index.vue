<template>
  <forum-post-list :posts="posts" />
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';

import ForumPostList from '@/components/forum/ForumPostList.vue';
import ForumPost from '@/models/ForumPost';
import { Actions, forumNamespace, Getters, NAMESPACE } from '@/store/forum';

@Component({
  components: { ForumPostList },
  watchQuery: ['page'],
})
export default class TopicPosts extends Vue {
  @forumNamespace.Getter(Getters.POSTS_FOR_PAGE)
  postsForPage!: (payload: { page: number; topicId: number }) => ForumPost[];

  async fetch({ params, query, store }) {
    const topicId = parseInt(params.id);
    const page = parseInt(query.page) || 1;

    await store.dispatch(`${NAMESPACE}${Actions.LOAD_POSTS}`, { page, topicId });
  }

  get page(): number {
    return parseInt(this.$route.query.page as string) || 1;
  }

  get posts(): ForumPost[] {
    return this.postsForPage({ page: this.page, topicId: this.topicId });
  }

  get topicId(): number {
    return parseInt(this.$route.params.id);
  }
}
</script>

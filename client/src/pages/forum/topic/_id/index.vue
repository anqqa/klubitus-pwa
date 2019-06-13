<template>
  <forum-post-list :posts="posts" />
</template>

<script>
import ForumPostList from '../../../../components/forum/ForumPostList';
import ForumPost from '../../../../models/ForumPost';

export default {
  async asyncData({ params, query }) {
    const topic_id = parseInt(params.id);
    const page = parseInt(query.page) || 1;
    const limit = 20;

    const posts = await ForumPost.params({ topic_id })
      .limit(limit)
      .page(page)
      .get();

    return { posts };
  },

  components: { ForumPostList },

  watchQuery: ['page'],
};
</script>

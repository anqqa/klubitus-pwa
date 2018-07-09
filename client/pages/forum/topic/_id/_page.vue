<template>
  <ForumPostList :posts="posts" />
</template>


<script>
  import ForumPostList from '~/components/forum/ForumPostList';

  export default {
    async asyncData({ app, params }) {
      const topicId = parseInt(params.id);
      const page    = parseInt(params.page) || 1;
      const limit   = 20;

      const { data: posts } = await app.$axios.$get(`forum/posts/${topicId}`, { params: { limit, page } });

      return { posts };
    },

    components: { ForumPostList },
  };
</script>

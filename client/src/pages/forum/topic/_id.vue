<template>

  <main class="column section">
    <h1 class="title">{{ topic.name }}</h1>

    <Pagination :pages="pages" :route="route" />

    <nuxt-child :key="topicId" />

    <Pagination :pages="pages" :route="route" />
  </main>

</template>


<script>
  import Pagination from '../../../components/Pagination';


  export default {

    async asyncData({ app, params }) {
      const topicId = parseInt(params.id);

      const { data: topic } = await app.$axios.$get(`forum/topic/${topicId}`);

      const pages = Math.ceil(topic.post_count / 20);

      return { pages, topic, topicId };
    },

    components: { Pagination },

    data() {
      return {
        route: { name: 'forum-topic-id', params: this.$route.params },
      };
    },

    computed: {
      page() { return parseInt(this.$route.query.page) || 1; },
    },

    head() {
      return {
        title: this.topic ? this.topic.name : 'Forum',
      };
    },

  };
</script>
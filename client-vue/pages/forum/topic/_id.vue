<template>

  <main class="column section">
    <h1 class="title">{{ topic.name }}</h1>

    <b-pagination v-if="pages > 1"
                  id="top-navigation"
                  :current.sync="page"
                  :total="topic.post_count"
                  per-page="20"
                  @change="onPageChange" />

    <nuxt-child :key="topicId" />

    <b-pagination v-if="pages > 1"
                  :current.sync="page"
                  :total="topic.post_count"
                  per-page="20"
                  @change="onPageChange" />
  </main>

</template>


<script>
  export default {
    async asyncData({ app, params }) {
      const topicId = parseInt(params.id);
      const page    = parseInt(params.page) || 1;

      const { data: topic } = await app.$axios.$get(`forum/topic/${topicId}`);

      const pages = Math.ceil(topic.post_count / 20);

      return { page, pages, topic, topicId };
    },

    head() {
      const link  = [];
      const page  = parseInt(this.page) || 1;
      const pages = parseInt(this.pages);

      if (pages > 1) {
        const { params } = this.$route;

        if (page > 1) {
          if (page > 2) {
            params.page = page - 1;
          }
          else {
            delete params.page;
          }

          link.push({ rel: 'prev', href: this.localePath({ name: 'forum-topic-id-page', params }) });
        }

        if (page < this.pages) {
          params.page = page + 1;

          link.push({ rel: 'next', href: this.localePath({ name: 'forum-topic-id-page' , params }) });
        }
      }

      return {
        link,
        title: this.topic ? this.topic.name : 'Forum',
      };
    },

    methods: {
      onPageChange(page) {
        const { params } = this.$route;

        if (page > 1) {
          params.page = page;
        }
        else if (params.page) {
          delete params.page;
        }

        this.$router.push(this.localePath({ name: 'forum-topic-id-page', params }));

        document.querySelector('#top-navigation').scrollIntoView({ behavior: 'smooth' });
      }
    },

    validate({ params }) {
      return !(params && params.page && +params.page < 1);
    },

  };
</script>


<style scoped>

</style>

<template>

  <v-container grid-list-lg>
    <v-layout row wrap>

      <v-flex tag="h1" class="headline" xs12 v-text="topic.name" />

      <v-flex xs12 md9 order-md2>
        <div class="text-xs-center">
          <v-pagination v-if="pages > 1"
                        id="top-navigation"
                        :length="pages"
                        v-model="page"
                        prev-icon="fas fa-angle-left"
                        next-icon="fas fa-angle-right"
                        @input="onPageChange" />
        </div>

        <nuxt-child :key="topicId" />

        <div class="text-xs-center">
          <v-pagination v-if="pages > 1"
                        :length="pages"
                        v-model="page"
                        prev-icon="fas fa-angle-left"
                        next-icon="fas fa-angle-right"
                        @input="onPageChange" />
        </div>
      </v-flex>

    </v-layout>
  </v-container>

</template>


<script>
  import VPagination from 'vuetify/es5/components/VPagination';

  export default {
    async asyncData({ app, params }) {
      const topicId = parseInt(params.id);
      const page    = parseInt(params.page) || 1;

      const { data: topic } = await app.$axios.$get(`forum/topic/${topicId}`);

      const pages = Math.ceil(topic.post_count / 20);

      return { page, pages, topic, topicId };
    },

    components: { VPagination },

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

<template>
  <main class="column section">
    <h1 class="title">{{ name }}</h1>

    <pagination :pages="pages" :route="route" />

    <nuxt-child :key="topicId" />

    <pagination :pages="pages" :route="route" />
  </main>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';

import Pagination from '@/components/Pagination.vue';
import ForumTopic from '@/models/ForumTopic';

@Component({
  components: { Pagination },
})
export default class SingleTopic extends Vue {
  name = '';

  async asyncData({ params }) {
    const topicId = parseInt(params.id);
    const topic = await new ForumTopic().find(topicId);
    const pages = Math.ceil(topic.post_count! / 20);

    return { name: topic.name, pages, topicId };
  }

  get page() {
    return parseInt(this.$route.query.page as string) || 1;
  }

  get route() {
    return { name: 'forum-topic-id', params: this.$route.params };
  }

  head() {
    return { title: this.name || 'Forum' };
  }
}
</script>

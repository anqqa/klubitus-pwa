<template>
  <main class="row">
    <nav class="sidebar col-2">
      <forum-area-list :areas="areas" />
    </nav>

    <div class="col-7 main-content">
      <header>
        <h1>Forum</h1>

        <nav class="actions">
          <nuxt-link :to="localePath({ name: 'forum-areas' })" class="button">
            Show all areas
          </nuxt-link>
          <nuxt-link to="" class="button is-primary">
            <span class="icon"><i class="bx bx-message"/></span>
            Start a new topic
          </nuxt-link>
        </nav>
      </header>

      <forum-topic-list :topics="topics" />
    </div>
  </main>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';

import ForumAreaList from '@/components/forum/ForumAreaList.vue';
import ForumTopicList from '@/components/forum/ForumTopicList.vue';
import ForumArea from '@/models/ForumArea';
import ForumTopic from '@/models/ForumTopic';

@Component({
  components: { ForumTopicList, ForumAreaList },
  head: { title: 'Forum' },
})
export default class ForumIndex extends Vue {
  async asyncData() {
    const [areas, topics] = await Promise.all([
      new ForumArea().getAll(),
      new ForumTopic()
        .relation('area')
        .relation('author')
        .sort('last_post_at', 'DESC')
        .limit(20)
        .get(),
    ]);

    return { areas, topics };
  }
}
</script>

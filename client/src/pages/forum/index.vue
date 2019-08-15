<template>
  <v-container fluid grid-list-md>
    <v-layout wrap>
      <v-toolbar flat color="transparent">
        <v-toolbar-title>
          <h1 class="display-1">Latest posts</h1>
        </v-toolbar-title>

        <v-spacer />

        <v-btn :to="localePath({ name: 'forum-areas' })" nuxt>
          Show areas
        </v-btn>
        <v-btn to="" color="primary" nuxt class="ml-2">
          <v-icon>mdi-message-plus</v-icon>
          Start a new topic
        </v-btn>
      </v-toolbar>

      <v-flex md8>
        <forum-topic-list :topics="topics" />
      </v-flex>

      <v-flex md4>
        <forum-area-list :areas="areas" />
      </v-flex>
    </v-layout>
  </v-container>
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
  title = 'Forum';

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

<template>
  <v-container fluid>
    <v-row justify="space-between">
      <v-col md="6">
        <h1 class="display-1">Latest posts</h1>
      </v-col>

      <v-col cols="auto">
        <v-btn :to="localePath({ name: 'forum-areas' })" nuxt>
          Show areas
        </v-btn>
        <v-btn to="" color="primary" nuxt class="ml-2">
          <v-icon left>mdi-message-plus</v-icon> New topic
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col md="8">
        <forum-topic-list :topics="topics" />
      </v-col>

      <v-col md="4">
        <forum-area-list />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';

import ForumAreaList from '@/components/forum/ForumAreaList.vue';
import ForumTopicList from '@/components/forum/ForumTopicList.vue';
import ForumTopic from '@/models/ForumTopic';
import { Actions, forumNamespace, Getters, NAMESPACE } from '@/store/forum';

@Component({
  components: { ForumAreaList, ForumTopicList },
  head: { title: 'Forum' },
})
export default class ForumIndex extends Vue {
  @forumNamespace.Getter(Getters.LATEST_TOPICS)
  topics!: ForumTopic[];

  title = 'Forum';

  async fetch({ store }) {
    await store.dispatch(`${NAMESPACE}${Actions.LOAD_LATEST_TOPICS}`, 20);
  }
}
</script>

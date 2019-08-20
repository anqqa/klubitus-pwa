<template>
  <v-container fluid grid-list-md>
    <v-layout wrap>
      <v-toolbar flat color="transparent" width="100%">
        <v-toolbar-title>
          <h1 class="display-1" v-text="name" />
        </v-toolbar-title>
      </v-toolbar>

      <v-flex md8>
        <v-pagination v-if="pages > 1" :length="pages" v-model="page" total-visible="7" />

        <nuxt-child :key="topicId" />

        <v-pagination v-if="pages > 1" :length="pages" v-model="page" total-visible="7" />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator';

import PaginatedMixin from '@/mixins/paginated';
import ForumTopic from '@/models/ForumTopic';

@Component({})
export default class SingleTopic extends mixins(PaginatedMixin) {
  name = '';
  topicId: number = 0;

  async asyncData({ params }) {
    const topicId = parseInt(params.id);
    const topic = await new ForumTopic().select(['name', 'post_count']).find(topicId);
    const pages = Math.ceil(topic.post_count! / 20);

    return { name: topic.name, pages, topicId };
  }

  head() {
    return { title: this.name || 'Forum' };
  }
}
</script>

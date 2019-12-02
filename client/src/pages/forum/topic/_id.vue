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

        <post-edit v-if="isAuthenticated" :user="user" class="mt-4" title="Reply to topic" />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator';

import PostEdit from '@/components/forum/PostEdit.vue';
import PaginatedMixin from '@/mixins/paginated';
import ForumTopic from '@/models/ForumTopic';
import User from '@/models/User';
import { authStore, UserState } from '@/store/auth';

@Component({
  components: { PostEdit },
})
export default class SingleTopic extends mixins(PaginatedMixin) {
  name = '';
  pages: number = 0;
  topicId: number = 0;

  @authStore.Getter isAuthenticated!: boolean;
  @authStore.State('user') userState!: UserState | null;

  async asyncData({ params }) {
    const topicId = parseInt(params.id);
    const topic = await new ForumTopic().select(['name', 'post_count']).find(topicId);
    const pages = Math.ceil(topic.post_count! / 20);

    return { name: topic.name, pages, topicId };
  }

  head() {
    return { title: this.name || 'Forum' };
  }

  get user(): User | null {
    return this.userState && new User(this.userState);
  }
}
</script>

<template>
  <v-container fluid grid-list-md>
    <v-layout wrap>
      <v-toolbar flat color="transparent" width="100%">
        <v-toolbar-title>
          <h1 class="display-1" v-text="topic.name" />
        </v-toolbar-title>
      </v-toolbar>

      <v-flex md8>
        <v-pagination v-if="pages > 1" :length="pages" v-model="page" total-visible="7" />

        <nuxt-child :key="topic.id" />

        <v-pagination v-if="pages > 1" :length="pages" v-model="page" total-visible="7" />

        <no-ssr>
          <post-edit v-if="user" :user="user" class="mt-4" title="Reply to topic" @save="reply" />
        </no-ssr>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator';

import PostEdit from '@/components/forum/PostEdit.vue';
import PaginatedMixin from '@/mixins/paginated';
import ForumPost from '@/models/ForumPost';
import ForumTopic from '@/models/ForumTopic';
import User from '@/models/User';
import { authStore, Getters } from '@/store/auth';

@Component({
  components: { PostEdit },
})
export default class SingleTopic extends mixins(PaginatedMixin) {
  name = '';
  pages: number = 0;
  topic?: ForumTopic;
  topicId: number = 0;

  @authStore.Getter(Getters.USER)
  user?: User;

  async asyncData({ params }) {
    const topicId = parseInt(params.id);
    const topic = await new ForumTopic().select(['name', 'post_count']).find(topicId);
    const pages = Math.ceil(topic.post_count! / 20);

    return { pages, topic };
  }

  head() {
    return { title: this.topic?.name || 'Forum' };
  }

  async reply(text: string) {
    const post = new ForumTopic({ id: this.topic?.id }).posts();
    post.post = text;

    try {
      const result = await post.save();
    } catch {}

    console.log({ post });
  }
}
</script>

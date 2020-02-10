<template>
  <v-container fluid grid-list-md>
    <v-layout wrap>
      <v-toolbar extended flat color="transparent" width="100%">
        <v-toolbar-title>
          <h1 class="display-1" v-text="topic.name" />
        </v-toolbar-title>
        <template slot="extension">
          {{ replies }}
        </template>
      </v-toolbar>

      <v-flex md8>
        <v-pagination v-if="pages > 1" :length="pages" v-model="page" total-visible="7" />

        <nuxt-child :key="topicId" />

        <v-pagination v-if="pages > 1" :length="pages" v-model="page" total-visible="7" />

        <no-ssr>
          <post-edit
            v-if="user"
            :errors="errors"
            :user="user"
            class="mt-4"
            title="Reply to topic"
            @save="reply"
          />
        </no-ssr>
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
import { authStore, Getters as AuthGetters } from '@/store/auth';
import { Actions, forumNamespace, Getters, NAMESPACE } from '@/store/forum';
import { Getters as UIGetters, Mutations as UIMutations, uiStore } from '@/store/ui';
import { nFormatter } from '@/utils/text';

@Component({
  components: { PostEdit },
})
export default class SingleTopic extends mixins(PaginatedMixin) {
  name = '';

  @uiStore.Mutation(UIMutations.CLEAR_ERRORS)
  clearErrors!: () => void;

  @uiStore.Getter(UIGetters.ERRORS_FOR_FIELD)
  getErrors!: (field: string) => string[] | undefined;

  @forumNamespace.Getter(Getters.TOPIC_BY_ID)
  getTopic!: (topicId: number) => ForumTopic;

  @authStore.Getter(AuthGetters.USER)
  user?: User;

  beforeDestroy() {
    this.clearErrors();
  }

  get errors() {
    return this.getErrors('post');
  }

  async fetch({ params, store }) {
    const topicId = parseInt(params.id);

    await store.dispatch(`${NAMESPACE}${Actions.LOAD_TOPIC}`, { topicId });
  }

  head() {
    return { title: this.topic?.name || 'Forum' };
  }

  get pages() {
    return Math.ceil((this.topic?.post_count || 0) / 20);
  }

  get replies() {
    const replies = this.topic?.post_count! > 1 ? nFormatter(this.topic!.post_count! - 1, 1) : 0;

    switch (replies) {
      case 0:
        return 'No replies';
      case 1:
        return '1 reply';
      default:
        return `${replies} replies`;
    }
  }

  async reply(text: string) {
    this.clearErrors();

    const post = new ForumTopic({ id: this.topicId }).posts();
    post.post = text;

    try {
      const newPost = await post.save();
      const lastPage = Math.ceil((this.topic!.post_count! + 1) / 20);
      const hash = `#post-${newPost.id}`;
      const query = { ...this.$route.query };

      if (lastPage > 1) {
        query.page = lastPage.toString();
      } else if ('page' in query) {
        delete query.page;
      }

      this.$router.push({ ...this.$route, query, hash });
    } catch {}
  }

  get topic(): ForumTopic {
    return this.getTopic(this.topicId);
  }

  get topicId(): number {
    return parseInt(this.$route.params.id);
  }
}
</script>

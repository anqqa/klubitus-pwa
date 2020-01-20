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
import { Getters as UIGetters, Mutations as UIMutations, uiStore } from '@/store/ui';

@Component({
  components: { PostEdit },
})
export default class SingleTopic extends mixins(PaginatedMixin) {
  name = '';
  topic?: ForumTopic;

  @uiStore.Mutation(UIMutations.CLEAR_ERRORS)
  clearErrors!: () => void;

  @uiStore.Getter(UIGetters.ERRORS_FOR_FIELD)
  getErrors!: (field: string) => string[] | undefined;

  @authStore.Getter(AuthGetters.USER)
  user?: User;

  async asyncData({ params }) {
    const topicId = parseInt(params.id);
    const topic = await new ForumTopic().select(['name', 'post_count']).find(topicId);

    return { topic };
  }

  beforeDestroy() {
    this.clearErrors();
  }

  get errors() {
    return this.getErrors('post');
  }

  head() {
    return { title: this.topic?.name || 'Forum' };
  }

  get pages() {
    return Math.ceil((this.topic?.post_count || 0) / 20);
  }

  async reply(text: string) {
    this.clearErrors();

    const post = new ForumTopic({ id: this.topic?.id }).posts();
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
}
</script>

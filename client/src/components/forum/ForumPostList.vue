<template>
  <section>
    <v-card v-for="post in postList" :key="post.id" class="mb-4">
      <v-list-item three-line>
        <v-list-item-avatar>
          <avatar :src="post.avatar" :title="post.username" size="40" />
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title class="mb-4 text--secondary">
            <nuxt-link to="/">{{ post.username }}</nuxt-link>
            <span v-if="post.author && post.author.title"> &sdot; {{ post.author.title }} </span>
            <span :title="post.created_at"> &sdot; {{ post.ago }} </span>
          </v-list-item-title>

          <div class="markdown" v-html="post.post" />

          <footer class="markdown text--secondary caption font-mono" v-html="post.signature" />
        </v-list-item-content>
      </v-list-item>
    </v-card>
  </section>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';

import Avatar from '@/components/Avatar.vue';
import ForumPost from '@/models/ForumPost';
import { colorFromText } from '@/utils/text';
import { fuzzyTimeDistance } from '@/utils/time';
import { avatarUrl } from '@/utils/url';

@Component({
  components: { Avatar },
})
export default class ForumPostList extends Vue {
  @Prop() posts!: ForumPost[];

  get postList() {
    const posts: any[] = [];

    this.posts.slice(0).forEach(post => {
      const avatar =
        post.author && post.author.avatar_url ? avatarUrl(post.author.avatar_url) : null;
      const username = post.author ? post.author.username : post.author_name;

      posts.push({
        ...post,
        ago: fuzzyTimeDistance(new Date(post.created_at!)),
        avatar,
        avatarColor: colorFromText(username),
        post: this.$md.render(post.post!),
        signature:
          post.author && post.author.signature
            ? this.$md.render('--\n' + post.author.signature)
            : null,
        username,
      });
    });

    return posts;
  }
}
</script>

<style scoped>
.signature {
  font-family: monospace;
}
</style>

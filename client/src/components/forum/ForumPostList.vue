<template>
  <section>
    <v-card v-for="post in postList" :key="post.id" :id="`post-${post.id}`" class="mb-4">
      <v-list-item three-line>
        <v-list-item-avatar>
          <avatar
            :src="post.avatar"
            :title="post.username"
            :user="post.author"
            :link="true"
            size="40"
          />
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title class="mb-4 text--secondary">
            <nuxt-link v-if="post.author" :to="localePath(post.author.path)">
              {{ post.author.username }}
            </nuxt-link>
            <span v-else>{{ post.username }}</span>

            <span v-if="post.author && post.author.title"> &sdot; {{ post.author.title }} </span>

            <span class="float-right">
              <nuxt-link :to="`#post-${post.id}`">#{{ post.nth }}</nuxt-link>
              &sdot; <time :title="post.created_at">{{ post.ago }} </time>
            </span>
          </v-list-item-title>

          <div class="markdown" v-html="post.post" />

          <footer class="markdown text--secondary caption" v-html="post.signature" />
        </v-list-item-content>
      </v-list-item>
    </v-card>
  </section>
</template>

<script lang="ts">
import { Component, mixins, Prop } from 'nuxt-property-decorator';

import Avatar from '@/components/Avatar.vue';
import PaginatedMixin from '@/mixins/paginated';
import ForumPost from '@/models/ForumPost';
import User from '@/models/User';
import { colorFromText, slug } from '@/utils/text';
import { fuzzyTime } from '@/utils/time';
import { avatarUrl } from '@/utils/url';

@Component({
  components: { Avatar },
})
export default class ForumPostList extends mixins(PaginatedMixin) {
  @Prop() posts!: ForumPost[];

  get postList() {
    const posts: any[] = [];
    let nth = (this.page - 1) * 20;

    this.posts.slice(0).forEach(post => {
      const author = post.author && new User(post.author);
      const avatar =
        post.author && post.author.avatar_url ? avatarUrl(post.author.avatar_url) : null;
      const username = post.author ? post.author.username : post.author_name;

      posts.push({
        ...post,
        ago: fuzzyTime(new Date(post.created_at!)),
        author,
        avatar,
        avatarColor: colorFromText(username),
        nth: ++nth,
        post: this.$md.render(post.post || ''),
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
.v-list-item__title {
  overflow: visible;
}

footer.caption {
  font-family: monospace !important;
}
</style>

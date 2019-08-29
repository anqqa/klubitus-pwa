<template>
  <v-list dense>
    <v-list-item v-for="comment in commentList" :key="comment.id" three-line>
      <v-list-item-avatar>
        <avatar :src="comment.avatar" :title="comment.author.username" size="40" />
      </v-list-item-avatar>

      <v-list-item-content>
        <v-list-item-title>
          <nuxt-link to="/" class="user">{{ comment.author.username }}</nuxt-link>
        </v-list-item-title>

        <div class="markdown" v-html="comment.html" />
      </v-list-item-content>

      <v-list-item-action>
        <v-list-item-action-text :title="comment.created_at" v-text="comment.ago" />
      </v-list-item-action>
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';

import { fuzzyTimeDistance } from '@/utils/time';
import { avatarUrl } from '@/utils/url';
import Avatar from './Avatar.vue';

@Component({
  components: { Avatar },
})
export default class CommentList extends Vue {
  @Prop({ default: [] }) comments!: any[];

  get commentList() {
    const comments: any[] = [];

    this.comments.slice(0).forEach(comment => {
      comments.push({
        ...comment,
        ago: fuzzyTimeDistance(new Date(comment.created_at)),
        avatar: avatarUrl(comment.author.avatar_url),
        html: this.$md.render(comment.comment!),
      });
    });

    return comments;
  }
}
</script>

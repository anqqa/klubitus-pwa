<template>
  <ul>
    <li v-for="comment in commentList" :key="comment.id" class="media">
      <div class="media-left">
        <avatar :src="comment.avatar" :title="comment.author.username" />
      </div>

      <div class="media-content">
        <nuxt-link to="/">{{ comment.author.username }}</nuxt-link>
        <small :title="comment.created_at" class="pull-right">{{ comment.ago }}</small>
        <br />
        {{ comment.comment }}
      </div>
    </li>
  </ul>
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
      });
    });

    return comments;
  }
}
</script>

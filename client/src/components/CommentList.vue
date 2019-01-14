<template>

  <ul>
    <li v-for="comment in commentList" :key="comment.id" class="media">

      <div class="media-left">
        <Avatar :image-url="comment.avatar" :name="comment.author.username" />
      </div>

      <div class="media-content">
        <nuxt-link to="/">{{ comment.author.username }}</nuxt-link>
        <small :title="comment.created_at" class="pull-right">{{ comment.ago }}</small>
        <br>
        {{ comment.comment }}
      </div>
    </li>
  </ul>

</template>


<script>
  import Avatar from './Avatar';
  import { fuzzyTimeDistance } from '../utils/time';
  import { avatarUrl } from '../utils/url';


  export default {
    components: { Avatar },

    props: {
      comments: { default: () => [], type: Array },
    },

    computed: {
      commentList() {
        const comments = [];

        this.comments.slice(0).forEach(comment => {
          comments.push({
            ...comment,
            ago:    fuzzyTimeDistance(new Date(comment.created_at)),
            avatar: avatarUrl(comment.author.avatar_url),
          });
        });

        return comments;
      }
    }
  };
</script>

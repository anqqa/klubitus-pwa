<template>

  <v-container grid-list-lg>
    <v-layout v-for="post in postList" :key="post.id" row wrap tag="section">

      <v-flex md1>
        <v-avatar :class="post.avatarColor" class="darken-3">
          <img v-if="post.avatar" :src="post.avatar" alt="Avatar">
          <span v-else class="white--text headline">{{ post.username.substr(0, 2) }}</span>
        </v-avatar>
      </v-flex>

      <v-flex md11>
        <nuxt-link to="/">{{ post.username }}</nuxt-link>
        <span v-if="post.author && post.author.title" class="text--tertiary"> &sdot; {{ post.author.title }}</span>
        <span :title="post.created_at" class="text--tertiary right">{{ post.ago }}</span>

        <v-flex class="markdown pa-0 mt-1" xs12 v-html="post.post" />
        <v-flex class="text--secondary caption markdown signature pb-0" xs12 v-html="post.signature" />
      </v-flex>

      <v-flex xs12>
        <v-divider />
      </v-flex>

    </v-layout>
  </v-container>

</template>


<script>
  import VAvatar from 'vuetify/es5/components/VAvatar';

  import { colorFromText, fuzzyTimeDistance } from '../../utils/text';
  import { avatarUrl } from '../../utils/url';


  export default {

    components: { VAvatar },

    props: {
      posts: { default: () => [], type: Array },
    },

    computed: {
      postList() {
        const posts = [];

        this.posts.slice(0).forEach(post => {
          const avatar   = post.author && post.author.avatar_url ? avatarUrl(post.author.avatar_url) : null;
          const username = post.author ? post.author.username : post.author_name;

          posts.push({
            ...post,
            ago:         fuzzyTimeDistance(new Date(post.created_at)),
            avatar,
            avatarColor: avatar ? 'transparent' : colorFromText(username),
            post:        this.$md.render(post.post),
            signature:   post.author && post.author.signature ? this.$md.render("--\n" + post.author.signature) : null,
            username,
          })
        });

        return posts;
      }
    }

  };
</script>


<style scoped>
  .signature {
    font-family: monospace;
  }
</style>

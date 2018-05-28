<template>

  <div>
    <article v-for="post in postList" :key="post.id" class="media">
      <div class="media-left">
        <figure class="image is-48x48">
          <img v-if="post.avatar" :src="post.avatar" alt="Avatar">
          <span v-else class="white--text headline">{{ post.username.substr(0, 2) }}</span>
        </figure>
      </div>

      <div class="media-content">
        <header class="level">
          <span class="level-left">
            <nuxt-link to="/">{{ post.username }}</nuxt-link>
            <span v-if="post.author && post.author.title" class="text--tertiary"> &sdot; {{ post.author.title }}</span>
          </span>
          <span :title="post.created_at" class="level-right">{{ post.ago }}</span>
        </header>

        <div class="content markdown" v-html="post.post" />

        <footer class="content markdown signature" v-html="post.signature" />
      </div>
    </article>
  </div>

</template>


<script>
  import { colorFromText, fuzzyTimeDistance } from '../../utils/text';
  import { avatarUrl } from '../../utils/url';


  export default {

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

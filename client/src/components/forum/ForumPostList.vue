<template>

  <section>
    <article v-for="post in postList" :key="post.id" class="media">
      <div class="media-left">
        <figure class="image avatar is-48x48">
          <img v-if="post.avatar" :src="post.avatar" alt="Avatar">
          <span v-else
                :class="`theme-${post.avatarColor}`"
                class="icon is-full">{{ post.username.substr(0, 2) }}</span>
        </figure>
      </div>

      <div class="media-content">
        <header>
          <span>
            <nuxt-link to="/">{{ post.username }}</nuxt-link>
            <span v-if="post.author && post.author.title" class="has-text-tertiary"> &sdot; {{ post.author.title }}</span>
          </span>
          <span :title="post.created_at" class="pull-right">{{ post.ago }}</span>
        </header>

        <div class="content markdown" v-html="post.post" />

        <footer class="content markdown signature" v-html="post.signature" />
      </div>
    </article>
  </section>

</template>


<script>
  import { colorFromText} from '../../utils/text';
  import { avatarUrl } from '../../utils/url';
  import { fuzzyTimeDistance } from '../../utils/time';


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
            avatarColor: colorFromText(username),
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

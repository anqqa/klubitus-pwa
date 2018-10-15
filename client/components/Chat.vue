<template>
  <section class="card">

    <header>
      <h2>Chat</h2>
    </header>

    <ul class="card-content">
      <li v-for="shout in shouts" :key="shout.id" class="media">

        <div class="media-left">
          <Avatar :image-url="shout.avatar" :name="shout.author.username" class="is-24x24" />
        </div>

        <div class="media-content">
          <nuxt-link class="user" to="/">{{ shout.author.username }}</nuxt-link>
          <time :datetime="shout.created_at" :title="shout.created_at">{{ shout.stamp }}</time>
          <br>
          <div class="markdown" v-html="shout.html" />
        </div>
      </li>
    </ul>

  </section>
</template>


<script>
  import format from 'date-fns/format';

  import Avatar from './Avatar';
  import { avatarUrl } from '../utils/url';

  export default {
    name: 'Chat',

    components: { Avatar },

    props: {
      limit: { default: 10, type: Number },
    },

    asyncComputed: {
      async shouts() {
        const { data } = await this.$axios.$get(`shouts`, {
          params: { limit: Math.min(this.limit || 10, 50) }
        });

        data.forEach(shout => {
            shout.avatar = avatarUrl(shout.author.avatar_url);
            shout.html   = this.$md.render(shout.shout);
            shout.stamp  = format(shout.created_at, 'HH:mm');
        });

        return data && data.reverse();
      }
    },

  };
</script>


<style scoped>
  time {
    color: var(--color-tertiary);
    font-size: 75%;
    margin-left: 10px;
  }
</style>

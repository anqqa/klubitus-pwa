<template>
  <section class="card">
    <header>
      <h2>Chat</h2>
    </header>

    <ul class="card-content">
      <li v-for="shout in shoutList" :key="shout.id" class="media">
        <div class="media-left">
          <avatar :image-url="shout.avatar" :name="shout.author.username" class="is-24x24" />
        </div>

        <div class="media-content">
          <nuxt-link class="user" to="/">{{ shout.author.username }}</nuxt-link>
          <time :datetime="shout.created_at" :title="shout.created_at">{{ shout.stamp }}</time>
          <br />
          <div class="markdown" v-html="shout.html" />
        </div>
      </li>
    </ul>
  </section>
</template>

<script lang="ts">
import format from 'date-fns/format';
import { Component, Prop, Vue } from 'nuxt-property-decorator';

import Avatar from '@/components/Avatar.vue';
import Shout from '@/models/Shout';
import { avatarUrl } from '@/utils/url';

@Component({
  components: { Avatar },
})
export default class Chat extends Vue {
  @Prop({ default: 10 }) limit!: number;

  shouts: Shout[] | null = null;

  async mounted() {
    this.shouts = await new Shout()
      .relation('author')
      .sort('id', 'DESC')
      .limit(Math.min(this.limit || 10, 50))
      .get();
  }

  get shoutList(): Array<Shout | { avatar: string; html: string; stamp: string }> {
    if (!this.shouts) {
      return [];
    }

    const shouts: any[] = [];

    this.shouts.slice(0).map(shout => {
      shouts.push({
        ...shout,
        avatar: avatarUrl(shout.author!.avatar_url),
        html: this.$md.render(shout.shout!),
        stamp: format(shout.created_at!, 'HH:mm'),
      });
    });

    return shouts.reverse();
  }
}
</script>

<style scoped>
time {
  color: var(--color-tertiary);
  font-size: 75%;
  margin-left: 10px;
}
</style>

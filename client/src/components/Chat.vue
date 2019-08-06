<template>
  <v-card>
    <v-card-title>Chat</v-card-title>

    <v-list three-line>
      <template v-for="(shout, index) in shoutList">
        <v-divider v-if="index > 0" :key="`${index}-divider`" inset />
        <v-list-item :key="index">
          <v-list-item-avatar>
            <avatar :image-url="shout.avatar" :name="shout.author.username" />
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>
              <nuxt-link class="user" to="/">{{ shout.author.username }}</nuxt-link>
            </v-list-item-title>

            <div class="markdown" v-html="shout.html" />
          </v-list-item-content>

          <v-list-item-action>
            <v-list-item-action-text :title="shout.created_at" v-text="shout.stamp" />
          </v-list-item-action>
        </v-list-item>
      </template>
    </v-list>
  </v-card>
</template>

<script lang="ts">
import format from 'date-fns/format';
import { Component, Prop, Vue } from 'nuxt-property-decorator';

import Avatar from '@/components/Avatar.vue';
import Shout from '@/models/Shout';
import { avatarUrl } from '@/utils/url';

@Component({ components: { Avatar } })
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

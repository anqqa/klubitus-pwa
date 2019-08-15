<template>
  <v-list color="transparent">
    <v-list-item v-for="topic in topicList" :key="topic.id" two-line>
      <v-list-item-avatar>
        <avatar :src="topic.avatar" :title="topic.username" size="40" />
      </v-list-item-avatar>

      <v-list-item-content>
        <v-list-item-title>
          <nuxt-link :to="topic.url" v-text="topic.name" />
        </v-list-item-title>

        <v-list-item-subtitle>
          <v-icon v-if="topic.first_post_id !== topic.last_post_id" small color="secondary">
            mdi-reply
          </v-icon>
          <nuxt-link class="user" to="/">{{ topic.poster }}</nuxt-link>
          {{ topic.verb }} {{ topic.ago }}

          <span v-if="topic.replies" title="Replies">
            &nbsp; <v-icon small>mdi-message-text</v-icon>
            <span :class="`hotness-${topic.hotness}`">{{ topic.replies }}</span>
          </span>

          <span v-if="topic.views" title="Views">
            &nbsp; <v-icon small>mdi-eye</v-icon> {{ topic.views }}
          </span>

          <small v-if="topic.forum_area" class="has-no-breaks">
            &nbsp; <nuxt-link :to="topic.areaUrl">{{ topic.forum_area.name }}</nuxt-link>
          </small>
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';

import Avatar from '@/components/Avatar.vue';
import ForumTopic from '@/models/ForumTopic';
import { nFormatter, slug } from '@/utils/text';
import { fuzzyTimeDistance } from '@/utils/time';
import { avatarUrl } from '@/utils/url';

@Component({
  components: { Avatar },
})
export default class ForumTopicList extends Vue {
  @Prop() area!: boolean;
  @Prop() topics!: ForumTopic[];

  get topicList() {
    const topics: any[] = [];

    (this.topics || []).slice(0).forEach(topic => {
      const avatar =
        topic.author && topic.author.avatar_url ? avatarUrl(topic.author.avatar_url) : null;
      const username = topic.author ? topic.author.username : topic.author_name;
      let poster = username;

      if (topic.last_post) {
        poster = topic.last_post.author
          ? topic.last_post.author.username
          : topic.last_post.author_name;
      }

      topics.push({
        ...topic,
        ago: fuzzyTimeDistance(new Date(topic.last_post_at as string)),
        areaUrl: topic.area
          ? this.localePath({
              name: 'forum-area',
              params: { area: `${topic.area.id}-${slug(topic.area.name)}` },
            })
          : null,
        avatar,
        hotness: this.hotness(topic.post_count! - 1),
        poster,
        replies: topic.post_count! > 1 ? nFormatter(topic.post_count! - 1, 1) : null,
        url: this.localePath({
          name: 'forum-topic-id',
          params: { id: `${topic.id}-${slug(topic.name)}` },
        }),
        username,
        verb: topic.first_post_id === topic.last_post_id ? 'started' : 'replied',
        views: nFormatter(topic.read_count!, 1),
      });
    });

    return topics;
  }

  hotness(heat) {
    const heats = [25, 100, 500];
    let hotness;

    for (hotness = 0; hotness < heats.length; hotness++) {
      if (heat < heats[hotness]) {
        break;
      }
    }

    return hotness;
  }
}
</script>

<style scoped>
h4 {
  margin: 0;
}

small a {
  border: 1px solid var(--color-tertiary);
  border-radius: 10px;
  padding: 0 1rem;
}
</style>

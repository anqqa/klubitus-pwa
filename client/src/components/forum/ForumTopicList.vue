<template>
  <ol>
    <li v-for="topic in topicList" :key="topic.id" class="media">
      <div class="media-left">
        <avatar :src="topic.avatar" :title="topic.username" />
      </div>

      <div class="media-content">
        <h4><nuxt-link :to="topic.url" v-text="topic.name" /></h4>

        <span v-if="topic.first_post_id !== topic.last_post_id" class="icon"
          ><i class="bx bx-reply"
        /></span>
        <nuxt-link class="user" to="/">{{ topic.poster }}</nuxt-link>
        {{ topic.verb }} {{ topic.ago }}

        <span v-if="topic.replies" class="has-text-tertiary" title="Replies">
          &nbsp; <span class="icon"><i class="bx bx-conversation"/></span>&nbsp;<span
            :class="`hotness-${topic.hotness}`"
            >{{ topic.replies }}</span
          >
        </span>

        <span v-if="topic.views" class="has-text-tertiary" title="Views">
          &nbsp; <span class="icon"><i class="bx bx-show"/></span> {{ topic.views }}
        </span>

        <small v-if="topic.forum_area" class="has-no-breaks">
          &nbsp; <nuxt-link :to="topic.areaUrl">{{ topic.forum_area.name }}</nuxt-link>
        </small>
      </div>
    </li>
  </ol>
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

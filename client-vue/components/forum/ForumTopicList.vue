<template>

  <v-list subheader class="transparent">

    <template v-for="topic in topicList">
      <v-list-tile :key="topic.id" avatar>

        <v-list-tile-avatar class="hidden-xs-only">
          <img v-if="topic.avatar" :src="topic.avatar">
          <v-icon v-else color="grey" size="40px">fas fa-user-circle</v-icon>
        </v-list-tile-avatar>

        <v-list-tile-content>
          <v-list-tile-title>
            <nuxt-link :to="topic.url" class="text--primary" v-html="topic.name"/>
          </v-list-tile-title>
          <v-list-tile-sub-title>
            <nuxt-link to="/">{{ topic.author ? topic.author.username : topic.author_name }}</nuxt-link>
            <span v-if="topic.forum_area">
              &sdot; <span class="text--tertiary">{{ topic.forum_area.name }}</span>
            </span>
          </v-list-tile-sub-title>
        </v-list-tile-content>

        <v-list-tile-action>
          <v-list-tile-action-text class="text-xs-right">
            {{ topic.postCount }}<br>
            <span class="text--tertiary">{{ topic.ago }}</span>
          </v-list-tile-action-text>
        </v-list-tile-action>

      </v-list-tile>

      <v-divider :key="`${topic.id}.divider`" inset />
    </template>

  </v-list>

</template>


<script>
  import { fuzzyTimeDistance, slug } from '../../utils/text';
  import { avatarUrl } from '../../utils/url';


  const formatter = new Intl.NumberFormat();

  export default {

    props: {
      area:   { default: false, type: Boolean },
      topics: { default: () => [], type: Array },
    },

    computed: {
      topicList() {
        const topics = [];

        this.topics.slice(0).forEach(topic => {
          topics.push({
            ...topic,
            ago:       fuzzyTimeDistance(new Date(topic.last_post_at)),
            avatar:    topic.author && topic.author.avatar_url ? avatarUrl(topic.author.avatar_url) : null,
            postCount: formatter.format(topic.post_count),
            url:       this.localePath({ name: 'forum-topic-id', params: { id: `${topic.id}-${slug(topic.name)}` } }),
          })
        });

        return topics;
      }
    }

  };
</script>


<style scoped>
</style>

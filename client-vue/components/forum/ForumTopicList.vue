<template>

  <v-list subheader class="transparent">

    <template v-for="topic in topicList">
      <v-list-tile :key="topic.id" :to="topic.url" avatar>

        <v-list-tile-avatar class="hidden-xs-only">
          <img v-if="topic.author.avatar_url" :src="topic.author.avatar_url" alt="Avatar">
          <v-icon v-else color="grey">fas fa-user-circle</v-icon>
        </v-list-tile-avatar>

        <v-list-tile-content>
          <v-list-tile-title v-html="topic.name" />
          <v-list-tile-sub-title>
            <nuxt-link to="/">{{ topic.author.username }}</nuxt-link>
            &sdot; <span class="text--tertiary">{{ topic.forum_area.name }}</span>
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


  const formatter = new Intl.NumberFormat();

  export default {

    props: {
      topics: { default: () => [], type: Array },
    },

    computed: {
      topicList() {
        const topics = [];

        this.topics.forEach(topic => {
          topics.push({
            ...topic,
            ago:       fuzzyTimeDistance(new Date(topic.last_post_at)),
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

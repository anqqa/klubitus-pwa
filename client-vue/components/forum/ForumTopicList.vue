<template>

  <v-list subheader class="transparent">
    <v-subheader>Latest</v-subheader>

    <template v-for="topic in topicList">
      <v-list-tile :key="topic.id" :to="topic.url">
        <v-list-tile-avatar>
          <img v-if="topic.author.avatar_url" :src="topic.author.avatar_url" alt="Avatar">
          <v-icon v-else color="grey">fas fa-user-circle</v-icon>
        </v-list-tile-avatar>
        <v-list-tile-content>
          <v-list-tile-title v-html="topic.name" />
          <v-list-tile-sub-title class="text--secondary">
            <nuxt-link to="/">{{ topic.author.username }}</nuxt-link> replied {{ topic.ago }}
          </v-list-tile-sub-title>
        </v-list-tile-content>
        <v-list-tile-action>
          <v-list-tile-action-text v-text="topic.postCount" />
        </v-list-tile-action>
      </v-list-tile>

      <v-divider :key="`${topic.id}.divider`" />
    </template>

  </v-list>

</template>


<script>
  import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';

  import { slug } from '../../utils/text';


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
            ago:       distanceInWordsToNow(topic.last_post_at, { addSuffix: true }),
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

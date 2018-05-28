<template>

  <ol>
    <li v-for="topic in topicList" :key="topic.id" class="media">
      <div class="media-left">
        <figure class="image is-48x48">
          <img v-if="topic.avatar" :src="topic.avatar">
          <span v-else class="icon is-large"><i class="fas fa-user-circle fa-2x" /></span>
        </figure>
      </div>

      <div class="media-content">
        <nuxt-link :to="topic.url" class="text--primary" v-html="topic.name" /><br>
        <nuxt-link to="/">{{ topic.author ? topic.author.username : topic.author_name }}</nuxt-link>
        <span v-if="topic.forum_area">
          &sdot; <span>{{ topic.forum_area.name }}</span>
        </span>
      </div>

      <div class="media-right has-text-right">
        {{ topic.postCount }}<br>
        <span class="text--tertiary">{{ topic.ago }}</span>
      </div>
    </li>
  </ol>

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
            url:       this.localePath({ name: 'forum-topic-id-page', params: { id: `${topic.id}-${slug(topic.name)}` } }),
          })
        });

        return topics;
      }
    }

  };
</script>

<template>

  <ol>
    <li v-for="topic in topicList" :key="topic.id" class="media">
      <div class="media-left">
        <figure class="image avatar is-48x48">
          <img v-if="topic.avatar" :src="topic.avatar">
          <span v-else
                :class="`theme-${topic.avatarColor}`"
                class="icon is-full">{{ topic.username.substr(0, 2) }}</span>
        </figure>
      </div>

      <div class="media-content">
        <nuxt-link :to="topic.url" class="has-text-default" v-html="topic.name" /><br>
        <nuxt-link to="/">{{ topic.username }}</nuxt-link>
        <small v-if="topic.forum_area" class="has-text-tertiary">
          &sdot; {{ topic.forum_area.name }}
        </small>
      </div>

      <div class="media-right has-text-right">
        {{ topic.postCount }}<br>
        <span class="has-text-tertiary">{{ topic.ago }}</span>
      </div>
    </li>
  </ol>

</template>


<script>
  import { colorFromText, fuzzyTimeDistance, slug } from '../../utils/text';
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
          const avatar   = topic.author && topic.author.avatar_url ? avatarUrl(topic.author.avatar_url) : null;
          const username = topic.author ? topic.author.username : topic.author_name;

            topics.push({
            ...topic,
            ago:         fuzzyTimeDistance(new Date(topic.last_post_at)),
            avatar,
            avatarColor: colorFromText(username),
            postCount:   formatter.format(topic.post_count),
            url:         this.localePath({ name: 'forum-topic-id-page', params: { id: `${topic.id}-${slug(topic.name)}` } }),
            username,
          })
        });

        return topics;
      }
    }

  };
</script>

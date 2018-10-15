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
        <h4><nuxt-link :to="topic.url" v-text="topic.name" /></h4>
        <nuxt-link class="user" to="/">{{ topic.username }}</nuxt-link>
        <span class="has-text-tertiary">
          &nbsp; {{ topic.ago }}
        </span>
        <span v-if="topic.replies">
          &nbsp; {{ topic.replies }}
        </span>
        <small v-if="topic.forum_area" class="has-text-tertiary">
          &nbsp; <nuxt-link :to="topic.areaUrl">{{ topic.forum_area.name }}</nuxt-link>
        </small>
      </div>
    </li>
  </ol>

</template>


<script>
  import { colorFromText, slug } from '../../utils/text';
  import { avatarUrl } from '../../utils/url';
  import { fuzzyTimeDistance } from '../../utils/time';


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
            areaUrl:     topic.forum_area ? this.localePath({ name: 'forum-area', params: { area:`${topic.forum_area.id}-${slug(topic.forum_area.name)}` } }) : null,
            avatar,
            avatarColor: colorFromText(username),
            replies:     topic.post_count > 1 ? `${formatter.format(topic.post_count - 1)} ${topic.post_count === 2 ? 'reply' : 'replies'}` : null,
            url:         this.localePath({ name: 'forum-topic-id', params: { id: `${topic.id}-${slug(topic.name)}` } }),
            username,
          })
        });

        return topics;
      }
    }

  };
</script>


<style scoped>
  h4 { margin-top: 0; }
</style>

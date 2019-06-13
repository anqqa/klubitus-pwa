<template>
  <main class="row">
    <nav class="sidebar col-2">
      <forum-area-list :areas="areas" />
    </nav>

    <div class="col-7 main-content">
      <header>
        <h1>Forum</h1>

        <nav class="actions">
          <nuxt-link :to="localePath({ name: 'forum-areas' })" class="button">
            Show all areas
          </nuxt-link>
          <nuxt-link to="" class="button is-primary">
            <span class="icon"><i class="bx bx-message"/></span>
            Start a new topic
          </nuxt-link>
        </nav>
      </header>

      <forum-topic-list :topics="topics" />
    </div>
  </main>
</template>

<script>
import ForumAreaList from '../../components/forum/ForumAreaList';
import ForumTopicList from '../../components/forum/ForumTopicList';
import ForumArea from '../../models/ForumArea';
import ForumTopic from '../../models/ForumTopic';

export default {
  async asyncData() {
    const [areas, topics] = await Promise.all([ForumArea.get(), ForumTopic.limit(20).get()]);

    return { areas, topics };
  },

  components: { ForumTopicList, ForumAreaList },

  head: {
    title: 'Forum',
  },
};
</script>

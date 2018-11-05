<template>

  <main class="row">

    <nav class="sidebar col-2">
      <ForumAreaList :areas="areas" />
    </nav>

    <div class="col-7 main-content">
      <header>
        <h1>Forum</h1>

        <nav class="actions">
          <nuxt-link :to="localePath({ name: 'forum-areas' })" class="button">Show all areas</nuxt-link>
          <nuxt-link to="" class="button is-primary">
            <span class="icon"><i class="bx bx-message" /></span>
            Start a new topic
          </nuxt-link>
        </nav>
      </header>

      <ForumTopicList :topics="topics" />
    </div>
  </main>

</template>


<script>
  import ForumAreaList from '../../components/forum/ForumAreaList';
  import ForumTopicList from '../../components/forum/ForumTopicList';


  export default {
    async asyncData({ app }) {
      const [{ data: areas }, { data: topics }] = await Promise.all([
        app.$axios.$get('forum/areas'),
        app.$axios.$get('forum/topics', { params: { limit: 20 } }),
      ]);

      return { areas, topics }
    },

    components: { ForumTopicList, ForumAreaList },

    head: {
      title: 'Forum'
    },

  };
</script>


<style scoped>
</style>

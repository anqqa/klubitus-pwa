<template>

  <v-container grid-list-md>
    <v-layout row wrap>

      <v-flex tag="h1" class="headline" xs12>Forum</v-flex>

      <v-flex xs6 order-lg2>
        <ForumTopicList :topics="topics" />
      </v-flex>

      <v-flex xs6>
        <ForumAreaList :areas="areas" />
      </v-flex>

    </v-layout>
  </v-container>

</template>


<script>
  import ForumAreaList from '../../components/forum/ForumAreaList';
  import ForumTopicList from '../../components/forum/ForumTopicList';


  export default {
    async asyncData({ app }) {
      const [{ data: areas }, { data: topics }] = await Promise.all([
        app.$axios.$get('forum/areas'),
        app.$axios.$get('forum/topics?limit=20'),
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

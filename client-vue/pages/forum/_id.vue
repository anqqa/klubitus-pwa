<template>

  <v-container grid-list-lg>
    <v-layout row wrap>

      <v-flex tag="h1" class="headline" xs12 v-text="area.name" />
      <v-flex tag="h2" class="subheading" xs12 v-html="area.description" />

      <v-flex xs12 md9 order-md2>
        <ForumTopicList :topics="topics" area />
      </v-flex>

      <v-flex xs12 md3>
        <ForumAreaList :areas="areas" mini />
      </v-flex>

    </v-layout>
  </v-container>

</template>


<script>
  import ForumAreaList from '../../components/forum/ForumAreaList';
  import ForumTopicList from '../../components/forum/ForumTopicList';


  export default {
    async asyncData({ app, params }) {
      const areaId = parseInt(params.id);

      const [{ data: areas }, { data: topics }] = await Promise.all([
        app.$axios.$get('forum/areas'),
        app.$axios.$get('forum/topics', { params: { area: areaId, limit: 20 } }),
      ]);

      let area;

      areas.forEach(_area => { if (_area.id === areaId) area = _area; });

      return { area, areas, topics }
    },

    components: { ForumTopicList, ForumAreaList },

    head: {
      title: 'Forum'
    },

  };
</script>


<style scoped>

</style>

<template>
  <v-layout row wrap>
    <h1 class="headline">Events</h1>
    <v-flex v-for="(event, index) in events" :key="index" xs12>
      <v-card>
        <v-container>
          <v-layout row>
            <v-flex xs2>
              <v-card-media cover height="60px" :src="event.flyer_front_url"></v-card-media>
            </v-flex>
            <v-flex xs10>
              <v-card-title>
                <h4 v-html="event.name" />
              </v-card-title>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-flex>
  </v-layout>
</template>


<script>
  export default {
    async asyncData({ app }) {
      const { data } = await app.$axios.get('events');

      return { events: data.data };
    },

    components: {},

    data() {
      return {}
    },

    head: {
      title: 'Events'
    },

    methods: {}
  }
</script>

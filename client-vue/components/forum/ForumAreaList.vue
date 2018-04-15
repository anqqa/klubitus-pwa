<template>

  <v-list subheader class="transparent">

    <template v-for="area in areaList">
      <v-subheader v-if="!area.nest_depth" :key="area.id" class="secondary spread">
        <span>{{ area.name }}</span> <v-icon class="subheader" small>far fa-comments</v-icon>
      </v-subheader>

      <v-list-tile v-else :key="area.id" :to="area.url">
        <v-list-tile-content>
          <v-list-tile-title v-html="area.name" />
          <v-list-tile-sub-title>
            <span class="text--tertiary" v-html="area.description" />
          </v-list-tile-sub-title>
        </v-list-tile-content>
        <v-list-tile-action>
          <v-list-tile-action-text v-text="area.topicCount" />
        </v-list-tile-action>
      </v-list-tile>

      <v-divider v-if="area.nest_depth" :key="`${area.id}.divider`" />
    </template>

  </v-list>

</template>


<script>
  import VSubheader from 'vuetify/es5/components/VSubheader';

  import { slug } from '../../utils/text';


  const formatter = new Intl.NumberFormat();

  export default {

    components: { VSubheader },

    props: {
      areas: { default: () => [], type: Array },
    },

    computed: {
      areaList() {
        const areas = [];

        this.areas.forEach(area => {
          areas.push({
            ...area,
            topicCount: formatter.format(area.topic_count),
            url:        this.localePath({ name: 'forum-id', params: { id: `${area.id}-${slug(area.name)}` }}),
          })
        });

        return areas;
      }
    }

  };
</script>


<style scoped>
</style>

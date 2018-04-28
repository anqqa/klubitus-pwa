<template>

  <v-list :dense="mini" :class="!mini && 'transparent'" subheader>

    <template v-for="area in areaList">
      <v-subheader v-if="!area.nest_depth" :key="area.id" :class="!mini && 'subheader--background spread'">
        <span>{{ area.name }}</span> <v-icon v-if="!mini" small class="text--tertiary">far fa-comments</v-icon>
      </v-subheader>

      <v-list-tile v-else :key="area.id" :to="area.url">
        <v-list-tile-content>
          <v-list-tile-title v-html="area.name" />
          <v-list-tile-sub-title v-if="!mini">
            <span class="text--tertiary" v-html="area.description" />
          </v-list-tile-sub-title>
        </v-list-tile-content>
        <v-list-tile-action v-if="!mini">
          <v-list-tile-action-text class="text-xs-right">
            {{ area.topicCount }}<br>
            <span class="text--tertiary">{{ area.ago }}</span>
          </v-list-tile-action-text>
        </v-list-tile-action>
      </v-list-tile>

      <v-divider v-if="!!area.nest_depth === !mini" :key="`${area.id}.divider`" />
    </template>

  </v-list>

</template>


<script>
  import VSubheader from 'vuetify/es5/components/VSubheader';

  import { fuzzyTimeDistance, slug } from '../../utils/text';


  const formatter = new Intl.NumberFormat();

  export default {

    components: { VSubheader },

    props: {
      areas: { default: () => [], type: Array },
      mini:  { default: false, type: Boolean },
    },

    computed: {
      areaList() {
        const areas = [];

        this.areas.slice(0).forEach(area => {
          areas.push({
            ...area,
            ago:        area.last_topic ? fuzzyTimeDistance(new Date(area.last_topic.last_post_at)) : null,
            topicCount: formatter.format(area.topic_count),
            url:        this.localePath({ name: 'forum-area', params: { area: `${area.id}-${slug(area.name)}` }}),
          })
        });

        return areas;
      }
    }

  };
</script>


<style scoped>
  .subheader span {
    text-transform: uppercase;
  }
</style>

<template>
  <v-container fluid grid-list-md>
    <v-row>
      <v-col>
        <h1 class="display-1" v-text="name" />
        <h2 class="headline" v-html="description" />
      </v-col>
    </v-row>

    <v-row>
      <v-col md="8">
        <v-pagination v-if="pages > 1" :length="pages" v-model="page" total-visible="7" />

        <nuxt-child :key="$route.fullPath" />

        <v-pagination v-if="pages > 1" :length="pages" v-model="page" total-visible="7" />
      </v-col>

      <v-col md="4">
        <forum-area-list :areas="areas" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator';

import ForumAreaList from '@/components/forum/ForumAreaList.vue';
import PaginatedMixin from '@/mixins/paginated';
import ForumArea from '@/models/ForumArea';

@Component({
  components: { ForumAreaList },
})
export default class SingleForumArea extends mixins(PaginatedMixin) {
  areas: ForumArea[] = [];
  description = '';
  name = '';

  async asyncData({ params }) {
    const areaId = parseInt(params.area);
    const areas = await new ForumArea().getAll();
    const area: ForumArea = areas.find(area => area.id === areaId) as ForumArea;

    return {
      areas,
      description: area.description,
      name: area.name,
      pages: Math.ceil(area.topic_count! / 20),
    };
  }

  head() {
    return { title: this.name || 'Forum' };
  }
}
</script>

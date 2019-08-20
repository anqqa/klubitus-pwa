<template>
  <v-container fluid grid-list-md>
    <v-layout wrap>
      <v-toolbar flat color="transparent" width="100%">
        <v-toolbar-title>
          <h1 class="display-1" v-text="name" />
          <h2 class="headline" v-html="description" />
        </v-toolbar-title>
      </v-toolbar>

      <v-flex md8>
        <v-pagination v-if="pages > 1" :length="pages" v-model="page" total-visible="7" />

        <nuxt-child :key="$route.fullPath" />

        <v-pagination v-if="pages > 1" :length="pages" v-model="page" total-visible="7" />
      </v-flex>

      <v-flex md4>
        <forum-area-list :areas="areas" />
      </v-flex>
    </v-layout>
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

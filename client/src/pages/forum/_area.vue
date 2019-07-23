<template>
  <main class="row">
    <nav class="sidebar col-2">
      <forum-area-list :areas="areas" />
    </nav>

    <div class="col-7 main-content">
      <h1 v-text="name" />
      <h2 v-html="description" />

      <pagination :pages="pages" :route="route" />

      <nuxt-child :key="$route.fullPath" />
    </div>
  </main>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';

import ForumAreaList from '@/components/forum/ForumAreaList.vue';
import ForumArea from '@/models/ForumArea';
import Pagination from '../../components/Pagination.vue';

@Component({
  components: { ForumAreaList, Pagination },
})
export default class SingleForumArea extends Vue {
  areas: ForumArea[] = [];
  description = '';
  name = '';
  pages: number = 0;

  async asyncData({ params }) {
    const areaId = parseInt(params.area);
    const areas = await new ForumArea().getAll();
    const area = areas.find(area => area.id === areaId);

    return {
      areas,
      description: area.description,
      name: area.name,
      pages: Math.ceil(area.topic_count / 20),
    };
  }

  head() {
    return {
      title: this.name || 'Forum',
    };
  }

  get page() {
    return parseInt(this.$route.query.page as string) || 1;
  }

  get route() {
    return { name: 'forum-area', params: this.$route.params };
  }
}
</script>

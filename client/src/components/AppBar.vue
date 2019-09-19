<template>
  <v-app-bar app>
    <v-app-bar-nav-icon @click.stop="toggleSidebar" />

    <v-toolbar-title class="mr-4 page-title" v-text="title" />

    <v-text-field flat hide-details label="Search" prepend-inner-icon="mdi-magnify" solo-inverted />
  </v-app-bar>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';

import { uiStore } from '@/store/ui';

@Component({})
export default class AppBar extends Vue {
  @uiStore.Mutation toggleSidebar!: () => void;

  @Prop() title?: string;
}
</script>

<style scoped>
.page-title {
  min-width: calc(25% - 50px);
}

@media screen and (max-width: 599px) {
  .page-title {
    min-width: auto;
  }
}
</style>

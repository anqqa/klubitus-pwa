<template>
  <v-app-bar app>
    <v-app-bar-nav-icon @click.stop="toggleSidebar" />

    <v-toolbar-title class="mr-4 page-title" v-text="title" />

    <v-text-field
      class="mr-4"
      flat
      hide-details
      label="Search"
      prepend-inner-icon="mdi-magnify"
      solo-inverted
    />

    <v-btn v-if="isAuthenticated" @click.stop="logout" small>Log Out</v-btn>
    <v-btn v-if="!isAuthenticated" :to="localePath('login')" nuxt small class="mr-2">
      Log In
    </v-btn>
    <v-btn v-if="!isAuthenticated" :to="localePath('signup')" nuxt small text>Sign Up</v-btn>
  </v-app-bar>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';

import { authStore } from '@/store/auth';
import { uiStore } from '@/store/ui';

@Component({})
export default class AppBar extends Vue {
  @authStore.Action logout!: () => void;
  @authStore.Getter isAuthenticated!: boolean;
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

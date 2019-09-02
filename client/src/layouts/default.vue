<template>
  <v-app id="klubitus" :dark="isDark">
    <Sidebar />

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

    <v-content>
      <nuxt />

      <v-footer>
        <div class="hidden-xs-only">
          &copy; 2000 &ndash; 2019 Klubitus
        </div>
      </v-footer>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';

import Sidebar from '@/components/Sidebar.vue';
import { authStore } from '@/store/auth';
import { Theme, uiStore } from '@/store/ui';

@Component({ components: { Sidebar } })
export default class Layout extends Vue {
  @authStore.Action logout!: () => void;
  @authStore.Getter isAuthenticated!: boolean;
  @uiStore.Mutation toggleSidebar!: () => void;
  @uiStore.State theme!: Theme;

  title = '';

  head() {
    return { changed: ({ titleChunk }) => (this.title = titleChunk) };
  }

  get isDark(): boolean {
    return this.theme === 'dark';
  }
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

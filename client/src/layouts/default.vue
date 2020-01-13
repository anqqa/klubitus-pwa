<template>
  <v-app id="klubitus" :dark="isDarkTheme">
    <snack-bar />

    <side-bar />
    <app-bar :title="title" />

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

import AppBar from '@/components/AppBar.vue';
import SideBar from '@/components/SideBar.vue';
import SnackBar from '@/components/SnackBar.vue';
import { Getters, uiStore } from '@/store/ui';

@Component({ components: { SnackBar, AppBar, SideBar } })
export default class Layout extends Vue {
  @uiStore.Getter(Getters.IS_DARK_THEME)
  isDarkTheme!: boolean;

  title = '';

  head() {
    return {
      changed: ({ titleChunk }) => (this.title = titleChunk),
      ...this.$nuxtI18nSeo(),
    };
  }
}
</script>

<template>
  <v-navigation-drawer app v-model="isSidebarOpen">
    <v-toolbar flat>
      <v-toolbar-items>
        <v-btn class="primary mr-4 ml-n4" text>
          <v-avatar size="28">
            <v-img src="/logo.svg" />
          </v-avatar>
        </v-btn>
      </v-toolbar-items>
      <v-toolbar-title class="title">
        KLUBITUS
      </v-toolbar-title>
    </v-toolbar>

    <v-divider />

    <v-list dense shaped>
      <v-list-item
        v-for="(item, index) in menu"
        :exact="item.exact"
        :key="index"
        :to="localePath(item.to)"
        nuxt
      >
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <template v-slot:append>
      <v-btn-toggle class="mx-2">
        <v-btn
          v-for="loc in $i18n.locales"
          :key="loc.code"
          :to="switchLocalePath(loc.code)"
          :value="loc.code"
          nuxt
          x-small
        >
          {{ loc.name }}
        </v-btn>
      </v-btn-toggle>

      <v-tooltip top>
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" @click.stop="isDark = !isDark" class="ml-4" icon x-small>
            <v-icon>mdi-theme-light-dark</v-icon>
          </v-btn>
        </template>
        <span>Dark mode on/off</span>
      </v-tooltip>
    </template>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';

import { Theme, uiStore } from '@/store/ui';

@Component({})
export default class Sidebar extends Vue {
  @uiStore.Mutation toggleSidebar!: (isOpen: boolean | null) => void;
  @uiStore.Mutation toggleTheme!: () => void;
  @uiStore.State sidebar!: boolean | null;
  @uiStore.State theme!: Theme;

  menu = [
    { to: 'index', title: 'Home', icon: 'mdi-home', exact: true },
    { to: 'events', title: 'Events', icon: 'mdi-calendar' },
    { to: 'forum', title: 'Forum', icon: 'mdi-message-text' },
    { to: 'galleries', title: 'Galleries', icon: 'mdi-camera' },
    { to: 'music', title: 'Music', icon: 'mdi-music' },
  ];

  get isDark(): boolean {
    return this.theme === 'dark';
  }

  set isDark(state) {
    if (state !== this.isDark) {
      this.toggleTheme();
      this.$vuetify.theme.dark = this.isDark;
    }
  }

  get isSidebarOpen(): boolean | null {
    return this.sidebar;
  }

  set isSidebarOpen(isOpen: boolean | null) {
    if (isOpen !== this.isSidebarOpen) {
      this.toggleSidebar(isOpen);
    }
  }
}
</script>

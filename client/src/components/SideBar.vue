<template>
  <v-navigation-drawer app v-model="isSidebarOpen">
    <v-toolbar flat>
      <v-toolbar-items>
        <v-btn class="primary mr-4 ml-n4" nuxt text to="/">
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

    <v-list-item v-if="isAuthenticated">
      <v-list-item-icon>
        <avatar :link="true" :user="user" />
      </v-list-item-icon>
      <v-list-item-title>
        <nuxt-link class="user" :to="localePath(user.path)" v-text="user.username" />

        <v-menu offset-y>
          <template v-slot:activator="{ on }">
            <v-btn icon text v-on="on">
              <v-icon small>mdi-menu-down</v-icon>
            </v-btn>
          </template>
          <v-list dense>
            <v-list-item nuxt :to="localePath(user.path)">
              <v-list-item-icon><v-icon>mdi-account</v-icon></v-list-item-icon>
              <v-list-item-title>Profile</v-list-item-title>
            </v-list-item>

            <v-list-item nuxt to="" disabled>
              <v-list-item-icon><v-icon>mdi-settings</v-icon></v-list-item-icon>
              <v-list-item-title>Settings</v-list-item-title>
            </v-list-item>

            <v-divider />

            <v-list-item @click.stop="logout">
              <v-list-item-icon><v-icon>mdi-logout</v-icon></v-list-item-icon>
              <v-list-item-title>Log Out</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-list-item-title>
    </v-list-item>
    <div v-else class="text-center py-4">
      <v-btn :to="localePath('login')" nuxt class="mr-2">Log In</v-btn>
      <v-btn :to="localePath('signup')" nuxt class="primary">Sign Up</v-btn>
    </div>

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

import Avatar from '@/components/Avatar.vue';
import User from '@/models/User';
import { authStore, UserState } from '@/store/auth';
import { Theme, uiStore } from '@/store/ui';

@Component({ components: { Avatar } })
export default class SideBar extends Vue {
  @authStore.Action logout!: () => void;
  @authStore.Getter isAuthenticated!: boolean;
  @authStore.State('user') userState!: UserState | null;
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

  get user(): User | null {
    return this.userState && new User(this.userState);
  }
}
</script>

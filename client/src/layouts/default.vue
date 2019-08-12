<template>
  <v-app id="klubitus" :dark="isDark">
    <v-navigation-drawer app v-model="sidebar">
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

    <v-app-bar app>
      <v-app-bar-nav-icon @click.stop="sidebar = !sidebar" />

      <v-text-field class="mr-4" hide-details label="Search" prepend-inner-icon="mdi-magnify" />

      <v-btn v-if="isAuthenticated" @click.stop="logout" small>Log Out</v-btn>
      <v-btn v-if="!isAuthenticated" :to="localePath('login')" nuxt small class="mr-2"
        >Log In</v-btn
      >
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

import { authStore } from '@/store/auth';
import { Theme, uiStore } from '@/store/ui';

@Component({})
export default class Layout extends Vue {
  @authStore.Action logout!: () => void;
  @authStore.Getter isAuthenticated!: boolean;
  @uiStore.Mutation toggleTheme!: () => void;
  @uiStore.State theme!: Theme;

  menu = [
    { to: 'index', title: 'Home', icon: 'mdi-home', exact: true },
    { to: 'events', title: 'Events', icon: 'mdi-calendar' },
    { to: 'forum', title: 'Forum', icon: 'mdi-message-text' },
    { to: 'galleries', title: 'Galleries', icon: 'mdi-camera' },
    { to: 'music', title: 'Music', icon: 'mdi-music' },
  ];

  sidebar: boolean | null = null;

  get isDark() {
    return this.theme === 'dark';
  }

  set isDark(state) {
    if (state !== this.isDark) {
      this.toggleTheme();
      this.$vuetify.theme.dark = this.isDark;
    }
  }

  get locale() {
    return this.$i18n.locale;
  }
}
</script>

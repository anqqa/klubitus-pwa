<template>
  <v-app id="klubitus" :dark="isDark">
    <v-navigation-drawer app v-model="sidebar">
      <v-list-item two-line>
        <v-list-item-content>
          <v-list-item-title class="title">klubitus</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider />

      <v-list nav dense>
        <v-list-item
          v-for="(item, index) in menu"
          :exact="item.exact"
          :key="index"
          :to="item.to"
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

      <v-divider />

      <v-list nav dense>
        <v-list-item v-if="isAuthenticated" @click="logout" link>
          <v-list-item-content>
            <v-list-item-title>Log Out</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-if="!isAuthenticated" :to="localePath('login')" nuxt>
          <v-list-item-content><v-list-item-title>Log In</v-list-item-title></v-list-item-content>
        </v-list-item>
        <v-list-item v-if="!isAuthenticated" :to="localePath('signup')" nuxt>
          <v-list-item-content><v-list-item-title>Sign Up</v-list-item-title></v-list-item-content>
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

        <v-btn @click.stop="isDark = !isDark" class="ml-4" icon x-small>
          <v-icon>mdi-theme-light-dark</v-icon>
        </v-btn>
      </template>
    </v-navigation-drawer>

    <v-app-bar app>
      <v-app-bar-nav-icon @click.stop="sidebar = !sidebar" />

      <v-text-field class="mr-4" hide-details label="Search" prepend-inner-icon="mdi-magnify" />
    </v-app-bar>

    <v-content>
      <nuxt />
    </v-content>

    <v-footer app>
      <div class="hidden-xs-only">
        &copy; 2000 &ndash; 2019 Klubitus
      </div>
    </v-footer>
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
    { to: this.localePath('index'), title: 'Home', icon: 'mdi-home', exact: true },
    { to: this.localePath('events'), title: 'Events', icon: 'mdi-calendar' },
    { to: this.localePath('forum'), title: 'Forum', icon: 'mdi-message-text' },
    { to: this.localePath('galleries'), title: 'Galleries', icon: 'mdi-camera' },
    { to: this.localePath('music'), title: 'Music', icon: 'mdi-music' },
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

<template>
  <v-app id="klubitus" :dark="isThemeDark">
    <v-app-bar app>
      <v-toolbar-title class="mr-4 hidden-xs-only">Klubitus</v-toolbar-title>

      <v-divider inset vertical class="hidden-xs-only" />

      <v-toolbar-items class="mr-4 hidden-xs-only">
        <v-btn
          v-for="(item, index) in menu"
          :key="index"
          :exact="item.exact"
          :to="item.to"
          nuxt
          text
        >
          <v-icon left>{{ item.icon }}</v-icon> {{ item.title }}
        </v-btn>
      </v-toolbar-items>

      <v-text-field class="mr-4" hide-details label="Search" prepend-inner-icon="mdi-magnify" />

      <v-divider inset vertical class="mr-4" />

      <v-btn v-if="isAuthenticated" @click="logout">Log Out</v-btn>
      <v-btn v-if="!isAuthenticated" :to="localePath('login')" nuxt>Log In</v-btn>
      <v-btn v-if="!isAuthenticated" :to="localePath('signup')" nuxt>Sign Up</v-btn>
    </v-app-bar>

    <v-bottom-navigation app shift class="hidden-sm-and-up">
      <v-btn v-for="(item, index) in menu" :key="index" :exact="item.exact" :to="item.to" nuxt text>
        <span>{{ item.title }}</span>
        <v-icon>{{ item.icon }}</v-icon>
      </v-btn>
    </v-bottom-navigation>

    <v-content>
      <nuxt />
    </v-content>

    <v-footer app>
      <div class="hidden-xs-only">
        &copy; 2000 &ndash; 2019 Klubitus
      </div>

      <v-spacer class="hidden-xs-only" />

      <v-icon class="mr-2">mdi-earth</v-icon>

      <v-btn-toggle>
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

      <v-spacer class="hidden-sm-and-up" />

      <v-btn @click="toggleTheme" class="ml-4" icon x-small>
        <v-icon>mdi-theme-light-dark</v-icon>
      </v-btn>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';

import { authStore } from '@/store/auth';
import { uiStore } from '@/store/ui';

@Component({})
export default class Layout extends Vue {
  @authStore.Action logout!: () => void;
  @authStore.Getter isAuthenticated!: boolean;
  @uiStore.Getter isThemeDark!: boolean;
  @uiStore.Mutation toggleTheme!: () => void;

  menu = [
    { to: this.localePath('index'), title: 'Home', icon: 'mdi-home', exact: true },
    { to: this.localePath('events'), title: 'Events', icon: 'mdi-calendar' },
    { to: this.localePath('forum'), title: 'Forum', icon: 'mdi-message-text' },
    { to: this.localePath('galleries'), title: 'Galleries', icon: 'mdi-camera' },
    { to: this.localePath('music'), title: 'Music', icon: 'mdi-music' },
  ];

  get locale() {
    return this.$i18n.locale;
  }
}
</script>

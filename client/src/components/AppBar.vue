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

    <v-menu v-if="isAuthenticated" offset-y>
      <template v-slot:activator="{ on }">
        <v-btn text v-on="on">
          <avatar :user="user" size="32" />
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
    <template v-else>
      <v-btn :to="localePath('login')" nuxt small text class="mr-2">Log In</v-btn>
      <v-btn :to="localePath('signup')" nuxt small>Sign Up</v-btn>
    </template>
  </v-app-bar>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';

import Avatar from '@/components/Avatar.vue';
import User from '@/models/User';
import { authStore, UserState } from '@/store/auth';
import { uiStore } from '@/store/ui';

@Component({ components: { Avatar } })
export default class AppBar extends Vue {
  @authStore.Action logout!: () => void;
  @authStore.Getter isAuthenticated!: boolean;
  @authStore.State('user') userState!: UserState | null;
  @uiStore.Mutation toggleSidebar!: () => void;

  @Prop() title?: string;

  get user(): User | null {
    return this.userState && new User(this.userState);
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

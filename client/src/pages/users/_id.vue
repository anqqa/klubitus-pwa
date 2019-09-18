<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" md="4" order-md="last">
        <v-navigation-drawer floating permanent right width="100%">
          <v-list-item two-line>
            <v-list-item-avatar>
              <avatar :user="user" />
            </v-list-item-avatar>
            <v-list-item-title>
              <h1 class="headline" v-text="user.username" />
            </v-list-item-title>
          </v-list-item>

          <v-divider />

          <v-list dense nav>
            <v-list-item>
              <v-list-item-title>Settings</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>Favorites</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>Friends</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>Galleries</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>Music</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-navigation-drawer>
      </v-col>

      <v-col md="8">
        <Newsfeed :limit="10" title="Timeline" :user="user.id" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';

import Avatar from '@/components/Avatar.vue';
import Newsfeed from '@/components/Newsfeed.vue';
import User from '@/models/User';

@Component({
  components: { Avatar, Newsfeed },
  head: { title: 'User' },
})
export default class UserPage extends Vue {
  user?: User;

  async asyncData({ app, params }) {
    const user = await new User().find(parseInt(params.id));

    return { user };
  }
}
</script>

<style scoped></style>

<template>
  <v-container fluid>
    <v-toolbar flat>
      <template #extension>
        <v-tabs>
          <v-tab :to="localePath(user.path)" exact nuxt>
            Profile
          </v-tab>
          <v-tab :to="localePath(user.url('users-id-favorites'))">
            Favorites
          </v-tab>
          <v-tab :to="localePath(user.url('users-id-friends'))">
            Friends
          </v-tab>
          <v-tab>
            Galleries
          </v-tab>
          <v-tab>
            Music
          </v-tab>
          <v-spacer />
          <v-tab :to="localePath(user.url('users-id-settings'))">
            <v-icon class="mr-2">mdi-settings</v-icon>
            Settings
          </v-tab>
        </v-tabs>
      </template>

      <v-toolbar-title>
        <avatar :user="user" />
        {{ user.username }}
      </v-toolbar-title>
    </v-toolbar>

    <nuxt-child />
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';

import Avatar from '@/components/Avatar.vue';
import User from '@/models/User';

@Component({
  components: { Avatar },
  head: { title: 'Profile' },
})
export default class UserPage extends Vue {
  user?: User;

  async asyncData({ params }) {
    const user = await new User().find(parseInt(params.id));

    return { user };
  }
}
</script>

<template>
  <v-navigation-drawer floating permanent right width="100%">
    <v-list nav expand>
      <v-list-group v-for="group in groups" :key="group.id" no-action value="true">
        <template v-slot:activator>
          <v-list-item-title :key="group.id" class="text-uppercase">{{
            group.name
          }}</v-list-item-title>
        </template>

        <template v-for="area in group.areas">
          <v-list-item
            v-if="getAreaUrl(area)"
            :key="area.id"
            nuxt
            link
            :to="getAreaUrl(area)"
            class="pl-2"
          >
            <v-list-item-title>{{ area.name }}</v-list-item-title>
          </v-list-item>
          <v-list-item v-else :key="area.id" class="pl-2">
            <v-list-item-title> <v-icon>mdi-lock</v-icon> {{ area.name }} </v-list-item-title>
          </v-list-item>
        </template>
      </v-list-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';

import ForumArea from '@/models/ForumArea';
import { authStore, Getters as AuthGetters } from '@/store/auth';
import { Actions, forumNamespace, Getters } from '@/store/forum';

@Component({})
export default class ForumAreaList extends Vue {
  collapsed = false;

  @forumNamespace.Getter(Getters.GROUPED_AREAS)
  groups!: Array<{ id: number; name: string; areas: ForumArea[] }>;

  @authStore.Getter(AuthGetters.IS_AUTHENTICATED)
  isAuthenticated!: boolean;

  @forumNamespace.Action(Actions.LOAD_AREAS)
  loadAreas!: () => Promise<void>;

  async beforeMount() {
    await this.loadAreas();
  }

  getAreaUrl(area: ForumArea) {
    const path = ForumArea.url(area, this.isAuthenticated);

    return path && this.localePath(path);
  }
}
</script>

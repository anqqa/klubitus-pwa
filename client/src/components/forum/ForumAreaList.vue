<template>
  <v-card>
    <v-card-title>Areas</v-card-title>

    <v-card-text>
      <v-list nav expand>
        <v-list-group v-for="group in groups" :key="group.id" no-action value="true">
          <template v-slot:activator>
            <v-list-item-title :key="group.id" class="text-uppercase">{{
              group.name
            }}</v-list-item-title>
          </template>

          <template v-for="area in group.areas">
            <v-list-item v-if="area.url" :key="area.id" nuxt link :to="area.url" class="pl-2">
              <v-list-item-title>{{ area.name }}</v-list-item-title>
            </v-list-item>
            <v-list-item v-else :key="area.id" class="pl-2">
              <v-list-item-title> <v-icon>mdi-lock</v-icon> {{ area.name }} </v-list-item-title>
            </v-list-item>
          </template>
        </v-list-group>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';

import ForumArea from '@/models/ForumArea';
import { authStore } from '@/store/auth';
import { slug } from '@/utils/text';

@Component({})
export default class ForumAreaList extends Vue {
  collapsed = false;

  @Prop() areas!: ForumArea[];

  @authStore.Getter isAuthenticated!: boolean;

  get groups() {
    const groups: any[] = [];
    let areas: any[] = [];

    this.areas.slice(0).forEach(area => {
      if (!area.nest_depth) {
        // Group
        areas = [];
        groups.push({ id: area.id, name: area.name, areas });
      } else {
        // Area
        areas.push({
          ...area,
          url:
            this.isAuthenticated || !area.is_private
              ? this.localePath({
                  name: 'forum-area',
                  params: { area: `${area.id}-${slug(area.name!)}` },
                })
              : null,
        });
      }
    });

    return groups;
  }
}
</script>

<template>
  <v-container fluid>
    <v-row justify="space-between">
      <v-col md="6">
        <h1 class="display-1">Forum Areas</h1>
      </v-col>

      <v-col cols="auto">
        <v-btn :to="localePath({ name: 'forum' })" nuxt>
          Latest posts
        </v-btn>
        <v-btn to="" color="primary" nuxt class="ml-2">
          <v-icon left>mdi-message-plus</v-icon> New topic
        </v-btn>
      </v-col>
    </v-row>

    <v-simple-table v-for="group in groupList" class="table-fixed my-4" :key="group.id">
      <thead>
        <tr>
          <th width="100%">
            <h3 class="title">{{ group.name }}</h3>
          </th>
          <th width="75px" class="text-center">Topics</th>
          <th width="100%" class="d-none d-sm-table-cell">Latest</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="area in group.areas" :key="area.id">
          <td v-if="area.url">
            <nuxt-link :to="area.url">
              <h4 class="subtitle-1">{{ area.name }}</h4>
            </nuxt-link>
            <p v-html="area.description" />
          </td>
          <td v-else>
            <a>
              <h4 class="subtitle-1">
                <v-icon class="text--secondary">mdi-lock</v-icon> {{ area.name }}
              </h4>
            </a>
          </td>

          <td class="text-center">{{ area.topics }}</td>

          <td class="d-none d-sm-table-cell">
            <v-list-item v-if="area.lastTopic">
              <v-list-item-avatar>
                <avatar :src="area.lastTopic.avatar" :title="area.lastTopic.username" size="40" />
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title>
                  <nuxt-link :to="area.lastTopic.url" v-text="area.lastTopic.name" />
                </v-list-item-title>

                <v-list-item-subtitle>
                  <v-icon
                    v-if="area.lastTopic.first_post_id !== area.lastTopic.last_post_id"
                    small
                    class="text--secondary"
                  >
                    mdi-message-reply-text
                  </v-icon>
                  <nuxt-link class="user" to="/">{{ area.lastTopic.username }}</nuxt-link>
                  {{ area.lastTopic.verb }} {{ area.lastTopic.ago }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </td>
        </tr>
      </tbody>
    </v-simple-table>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';

import Avatar from '@/components/Avatar.vue';
import ForumArea from '@/models/ForumArea';
import { authStore } from '@/store/auth';
import { nFormatter, slug } from '@/utils/text';
import { fuzzyTimeDistance } from '@/utils/time';
import { avatarUrl } from '@/utils/url';

@Component({
  components: { Avatar },
  head: { title: 'Forum areas' },
})
export default class ForumAreas extends Vue {
  @authStore.Getter isAuthenticated!: boolean;

  areas: ForumArea[] = [];

  async asyncData() {
    const areas = await new ForumArea().getAll(true);

    return { areas };
  }

  get groupList() {
    const groups: Array<{ id: number; name: string; areas: any[] }> = [];
    let areas: any[] = [];

    this.areas.slice(0).forEach((area: any) => {
      if (!area.nest_depth) {
        // Group
        areas = [];
        groups.push({ id: area.id, name: area.name, areas });
      } else {
        // Area
        const hasAccess = this.isAuthenticated || !area.is_private;
        let lastTopic = null;

        if (hasAccess && area.last_topic) {
          const last = area.last_topic.last_post || area.last_topic;
          const avatar =
            last.author && last.author.avatar_url ? avatarUrl(last.author.avatar_url) : null;
          const username = last.author ? last.author.username : last.author_name;

          lastTopic = {
            ...area.last_topic,
            ago: fuzzyTimeDistance(new Date(area.last_topic.last_post_at)),
            avatar,
            url: this.localePath({
              name: 'forum-topic-id',
              params: { id: `${area.last_topic_id}-${slug(area.last_topic.name)}` },
            }),
            username,
            verb:
              area.last_topic.first_post_id === area.last_topic.last_post_id
                ? 'started'
                : 'replied',
          };
        }

        areas.push({
          ...area,
          lastTopic,
          topics: nFormatter(area.topic_count, 1),
          url: hasAccess
            ? this.localePath({
                name: 'forum-area',
                params: { area: `${area.id}-${slug(area.name)}` },
              })
            : null,
        });
      }
    });

    return groups;
  }
}
</script>

<style scoped>
.main-content {
  margin: 0 auto;
  max-width: 980px;
}

h4 {
  margin: 0;
}

tr.group-header {
  background: var(--color-separator);
  border: none;
}
</style>

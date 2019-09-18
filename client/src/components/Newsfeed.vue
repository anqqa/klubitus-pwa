<template>
  <section>
    <h2 class="title" v-text="title" />

    <v-timeline align-top dense>
      <v-timeline-item
        v-for="(group, index) in groups"
        :key="index"
        color="transparent"
        large
        right
      >
        <avatar :user="group.user" slot="icon" />

        <v-card>
          <v-card-text>
            <v-row dense justify="space-between">
              <v-col cols="auto">
                <nuxt-link class="user" to="/">{{ group.username }}</nuxt-link> {{ group.text }}
              </v-col>
              <v-col class="text-right">
                <span :title="group.created_at" v-text="group.stamp" />
              </v-col>
            </v-row>

            <div v-for="item in group.items" :key="item.id">
              <v-icon v-if="item.icon" small class="mr-1">{{ item.icon }}</v-icon>
              <nuxt-link :to="item.url">{{ item.text }}</nuxt-link>
            </div>
          </v-card-text>
        </v-card>
      </v-timeline-item>
    </v-timeline>
  </section>
</template>

<script lang="ts">
import { format, parseISO } from 'date-fns';
import { Component, Prop, Vue } from 'nuxt-property-decorator';

import NewsfeedItem from '@/models/NewsfeedItem';
import User from '@/models/User';
import { slug } from '@/utils/text';
import Avatar from './Avatar.vue';

const newsfeedTexts = {
  blog: {
    comment: ['commented a blog entry', 'commented blog entries'],
    entry: ['wrote a blog entry', 'wrote blog entries'],
  },

  events: {
    event: ['added a new event', 'added new events'],
    event_edit: ['updated an event', 'updated events'],
    favorite: ['added an event to favorites', 'added events to favorites'],
  },

  forum: {
    reply: ['replied to a topic', 'replied to topics'],
    topic: ['started a new topic', 'started new topics'],
  },

  galleries: {
    comment: ['commented an image in gallery', 'commented images in galleries'],
    comment_flyer: ['commented a flyer', 'commented flyers'],
    flyer_edit: ['updated a flyer', 'updated flyers'],
    note: ['tagged a user to an image', 'tagged users in images'],
    upload: ['added new images to a gallery', 'added new images to galleries'],
  },

  music: {
    mixtape: ['added a new mixtape', 'added new mixtapes'],
    track: ['added a new track', 'added new tracks'],
  },

  user: {
    default_image: ['changed their profile image', 'added new profile images'],
    friend: ['added a new friend', 'added new friends'],
  },

  venues: {
    venue: ['added a new venue', 'added new venues'],
    venue_edit: ['updated a venue', 'updated venues'],
  },
};

interface Item {
  id: string;
  icon: string | null;
  text: string;
  url: string;
}

interface ItemGroup {
  created_at: string;
  items: Item[];
  stamp: string;
  text: string;
  user: User;
  username: string;
}

@Component({
  components: { Avatar },
})
export default class Newsfeed extends Vue {
  private static newsfeedText(itemClass: string, itemType: string, multiple: boolean) {
    if (itemClass in newsfeedTexts && itemType in newsfeedTexts[itemClass]) {
      return newsfeedTexts[itemClass][itemType][~~multiple];
    }

    return 'did something weird';
  }

  @Prop() aggregate?: string;
  @Prop({ default: 10 }) limit!: number;
  @Prop({ default: 'Newsfeed' }) title!: string;
  @Prop() user?: number;

  groups: ItemGroup[] = [];

  async mounted() {
    const groups: ItemGroup[] = [];
    const query = new NewsfeedItem().limit(Math.min(this.limit || 10, 50));

    if (this.user) {
      query.filter('user_id', 'eq', this.user);
    }

    // @ts-ignore
    const data = (await query.get(
      this.aggregate ? { aggregate: this.aggregate } : undefined
    )) as NewsfeedItem[][];

    data.forEach(group => {
      const first = group[0];
      const items: Item[] = [];

      group.forEach(item => items.push(this.newsfeedItem(item)));

      groups.push({
        created_at: first.created_at!,
        stamp: format(parseISO(first.created_at!), 'HH:mm'),
        text: Newsfeed.newsfeedText(first.class!, first.type!, group.length > 1),
        user: new User(first.user),
        username: first.user!.username,
        items,
      });
    });

    this.groups = groups;
  }

  private newsfeedItem(item: NewsfeedItem): Item {
    let icon: string | null = null;
    let model: Record<string, any>;
    let text: string = item.class + ' ' + item.type;
    let url: string = '/';

    switch (item.class) {
      case 'blog':
        model = item.target_blog_entry || {};
        icon = 'mdi-book-open';
        text = model.name || '(Untitled)';
        break;

      case 'events':
        model = item.target_event || {};
        icon = item.type === 'favorite' ? 'mdi-star' : 'mdi-calendar';
        text = model.name || '(Untitled)';
        url = this.localePath({
          name: 'events-id',
          params: { id: `${model.id}-${slug(model.name)}` },
        });
        break;

      case 'forum':
        model = item.target_forum_topic || {};
        icon = item.type === 'reply' ? 'mdi-message-reply-text' : 'mdi-message-text';
        text = model.name || '(Untitled)';
        url = this.localePath({
          name: 'forum-topic-id',
          params: { id: `${model.id}-${slug(model.name)}` },
        });
        break;

      case 'galleries':
        break;

      case 'music':
        model = item.target_track || {};
        icon = item.type === 'track' ? 'mdi-album' : 'mdi-cassette';
        text = model.name || '(Untitled)';
        break;

      case 'user':
        model = item.target_user || {};
        icon = 'mdi-account';
        text = model.username || '(Unknown)';
        break;

      case 'venues':
        model = item.target_venue || {};
        icon = 'mdi-map-marker';
        text = model.name || '(Untitled)';
        break;
    }

    return { id: item.id, icon, text, url } as Item;
  }
}
</script>

<style scoped>
time {
  color: var(--color-tertiary);
  font-size: 75%;
  margin-left: 10px;
}
ul ul {
  list-style: none;
}
</style>

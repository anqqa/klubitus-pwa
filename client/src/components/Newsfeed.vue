<template>
  <section class="card dense">
    <header>
      <h2>Newsfeed</h2>
    </header>

    <ul class="card-content">
      <li v-for="(group, index) in groups" :key="index" class="media">
        <div class="media-left">
          <avatar :image-url="group.avatar" :name="group.username" class="is-24x24" />
        </div>

        <div class="media-content">
          <nuxt-link class="user" to="/">{{ group.username }}</nuxt-link> {{ group.text }}
          <time :datetime="group.created_at" :title="group.created_at">{{ group.stamp }}</time>
          <ul>
            <li v-for="item in group.items" :key="item.id">
              <nuxt-link :to="item.url">
                <span v-if="item.icon" class="icon">
                  <i :class="`bx bx-${item.icon}`" />
                </span>
                {{ item.text }}
              </nuxt-link>
            </li>
          </ul>
        </div>
      </li>
    </ul>
  </section>
</template>

<script>
import format from 'date-fns/format';

import Avatar from './Avatar';
import NewsfeedItem from '../models/NewsfeedItem';
import { avatarUrl } from '../utils/url';
import { slug } from '../utils/text';

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

export default {
  name: 'Newsfeed',

  components: { Avatar },

  props: {
    limit: { default: 10, type: Number },
  },

  methods: {
    newsfeedItem(item) {
      let icon = null;
      let model = null;
      let text = item.class + ' ' + item.type;
      let url = '/';

      switch (item.class) {
        case 'blog':
          model = item.target_blog_entry || {};
          icon = 'pen';
          text = model.name || '(Untitled)';
          break;

        case 'events':
          model = item.target_event || {};
          icon = item.type === 'favorite' ? 'star' : 'calendar-alt';
          text = model.name || '(Untitled)';
          url = this.localePath({
            name: 'events-id',
            params: { id: `${model.id}-${slug(model.name)}` },
          });
          break;

        case 'forum':
          model = item.target_forum_topic || {};
          icon = item.type === 'reply' ? 'conversation' : 'message';
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
          icon = item.type === 'track' ? 'album' : 'music';
          text = model.name || '(Untitled)';
          break;

        case 'user':
          model = item.target_user || {};
          icon = 'user';
          text = model.username || '(Unknown)';
          break;

        case 'venues':
          model = item.target_venue || {};
          icon = 'map';
          text = model.name || '(Untitled)';
          break;
      }

      return { id: item.id, icon, text, url };
    },

    newsfeedText(itemClass, itemType, multiple) {
      if (itemClass in newsfeedTexts && itemType in newsfeedTexts[itemClass]) {
        return newsfeedTexts[itemClass][itemType][~~multiple];
      }

      return 'did something weird';
    },
  },

  asyncComputed: {
    async groups() {
      const groups = [];

      const data = await NewsfeedItem.limit(Math.min(this.limit || 10, 50)).get();

      data.forEach(group => {
        const first = group[0];
        const items = [];

        group.forEach(item => items.push(this.newsfeedItem(item)));

        groups.push({
          avatar: avatarUrl(first.user.avatar_url),
          created_at: first.created_at,
          stamp: format(first.created_at, 'HH:mm'),
          text: this.newsfeedText(first.class, first.type, group.length > 1),
          username: first.user.username,
          items,
        });
      });

      return groups;
    },
  },
};
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

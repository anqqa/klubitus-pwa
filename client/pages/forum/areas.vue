<template>

  <main>
    <div class="main-content">

      <header>
        <h1>Forum Areas</h1>

        <nav class="actions">
          <nuxt-link :to="localePath({ name: 'forum' })" class="button">Show latest posts</nuxt-link>
          <nuxt-link to="" class="button is-primary">
            <span class="icon"><i class="bx bx-message" /></span>
            Start a new topic
          </nuxt-link>
        </nav>
      </header>

      <table>
        <tbody>
          <template v-for="group in groupList">

            <tr :key="`header-${group.id}`" class="group-header">
              <th width="45%"><h3 class="h6">{{ group.name }}</h3></th>
              <th align="center">Topics</th>
              <th width="45%" class="hide-phone">Latest</th>
            </tr>

            <tr v-for="area in group.areas" :key="area.id">
              <td v-if="area.url">
                <nuxt-link :to="area.url">
                  <h4>{{ area.name }}</h4>
                </nuxt-link>
                <p v-html="area.description" />
              </td>
              <td v-else>
                <a>
                  <h4><span class="icon"><i class="bx bx-lock" /></span> {{ area.name }}</h4>
                </a>
              </td>

              <td align="center">{{ area.topics }}</td>

              <td v-if="area.lastTopic" class="hide-phone">
                <div class="media">
                  <div class="media-left">
                    <Avatar :image-url="area.lastTopic.avatar" :name="area.lastTopic.username" />
                  </div>

                  <div class="media-content">
                    <h4><nuxt-link :to="area.lastTopic.url" v-text="area.lastTopic.name" /></h4>

                    <span v-if="area.lastTopic.first_post_id !== area.lastTopic.last_post_id" class="icon"><i class="bx bx-reply" /></span>
                    <nuxt-link class="user" to="/">{{ area.lastTopic.username }}</nuxt-link>
                    {{ area.lastTopic.verb }} {{ area.lastTopic.ago }}
                  </div>
                </div>
              </td>
              <td v-else-if="area.url" class="hide-phone">
              </td>
              <td v-else class="hide-phone">
                <span class="icon is-medium"><i class="bx bx-lock" /></span>
              </td>
            </tr>

          </template>
        </tbody>
      </table>

    </div>
  </main>

</template>


<script>
  import Avatar from '../../components/Avatar';
  import { nFormatter, slug } from '../../utils/text';
  import { fuzzyTimeDistance } from '../../utils/time';
  import { avatarUrl } from '../../utils/url';


  export default {
    async asyncData({ app }) {
      const { data: areas } = await app.$axios.$get('forum/areas', { params: { details: true } });

      return { areas }
    },

    components: { Avatar },

    computed: {
      groupList() {
        const groups = [];
        let   areas  = [];

        this.areas.slice(0).forEach(area => {
          if (!area.nest_depth) {

            // Group
            areas = [];
            groups.push({ id: area.id, name: area.name, areas })

          }
          else {

            // Area
            const hasAccess = this.$auth.loggedIn || !area.is_private;
            let lastTopic   = null;

            if (hasAccess && area.last_topic) {
              const last     = area.last_topic.last_post || area.last_topic;
              const avatar   = last.author && last.author.avatar_url ? avatarUrl(last.author.avatar_url) : null;
              const username = last.author ? last.author.username : last.author_name;

              lastTopic = {
                ...area.last_topic,
                ago:         fuzzyTimeDistance(new Date(area.last_topic.last_post_at)),
                avatar,
                url:         this.localePath({
                  name: 'forum-topic-id',
                  params: { id: `${area.last_topic_id}-${slug(area.last_topic.name)}` },
                }),
                username,
                verb:        area.last_topic.first_post_id === area.last_topic.last_post_id ? 'started' : 'replied',
              }
            }

            areas.push({
              ...area,
              lastTopic,
              topics: nFormatter(area.topic_count, 1),
              url:    hasAccess
                        ? this.localePath({ name: 'forum-area', params: { area: `${area.id}-${slug(area.name)}` }})
                        : null,
            });

          }
        });

        return groups;
      }
    },

    head: {
      title: 'Forum areas'
    },

  };
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

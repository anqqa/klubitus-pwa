<template>

  <section class="card dense">
    <header>
      <h2>Areas</h2>
    </header>

    <div class="card-content">
      <div v-for="group in groupList" :key="group.id">
        <h3 class="h6">{{ group.name }}</h3>
        <ul :class="{'mini': mini}">
          <template v-for="area in group.areas">
            <li v-if="area.url" :key="area.id">
              <nuxt-link :to="area.url">{{ area.name }}</nuxt-link>
              <p v-if="!mini" v-html="area.description" />
              <small v-if="!mini" class="has-text-tertiary">
                &nbsp; {{ area.ago }}
                &nbsp; {{ area.topicCount }}
              </small>
            </li>
            <li v-else :key="area.id">
              <span class="icon"><i class="bx bx-lock" /></span> <span>{{ area.name }}</span><br>
              <p v-if="!mini" v-html="area.description" />
            </li>
          </template>
        </ul>
      </div>
    </div>
  </section>

</template>


<script>
  import { slug } from '../../utils/text';
  import { fuzzyTimeDistance } from '../../utils/time';


  const formatter = new Intl.NumberFormat();

  export default {

    props: {
      areas: { default: () => [], type: Array },
      mini:  { default: false, type: Boolean },
    },

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
            areas.push({
              ...area,
              ago:        area.last_topic ? fuzzyTimeDistance(new Date(area.last_topic.last_post_at)) : null,
              topicCount: `${formatter.format(area.topic_count)} ${area.topic_count === 1 ? 'topic' : 'topics'}`,
              url:        this.$auth.loggedIn || !area.is_private
                            ? this.localePath({ name: 'forum-area', params: { area: `${area.id}-${slug(area.name)}` }})
                            : null,
            });

          }
        });

        return groups;
      }
    }

  };
</script>


<style scoped>
  a { font-weight: var(--font-weight-bold); }
  h3 { border-bottom: 1px solid var(--color-separator); }
  div + div > h3 { margin-top: var(--grid-gutter); }
  p { margin: 0; }
  ul {
    list-style: none;
    margin: 0;
  }
  ul:not(.mini) li {
    padding-bottom: var(--grid-gutter);
  }
  .is-active-exact { color: var(--color-primary); }
</style>

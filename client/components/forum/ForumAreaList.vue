<template>

  <section>
    <div v-for="group in groupList" :key="group.id">
      <h3 class="h6 has-text-tertiary">{{ group.name }}</h3>
      <ul :class="{'mini': mini}">
        <template v-for="area in group.areas">
          <li v-if="area.url" :key="area.id">
            <nuxt-link :to="area.url">
              <header>
                <h4>{{ area.name }}</h4>
                <small v-if="!mini" class="has-text-tertiary">
                  {{ area.topicCount }}
                  <span class="icon">
                    <i class="bx bx-message" />
                  </span>
                </small>
              </header>
              <p v-if="!mini" class="has-text-secondary" v-html="area.description" />
            </nuxt-link>
          </li>
          <li v-else :key="area.id">
            <span class="icon"><i class="bx bx-lock" /></span> <span>{{ area.name }}</span><br>
            <p v-if="!mini" v-html="area.description" />
          </li>
        </template>
      </ul>
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
              topicCount: formatter.format(area.topic_count),
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
  a {
    display: block;
    padding: 0.5rem 1rem;
  }
  a:hover {
    background: var(--color-separator);
    text-decoration: none;
  }
  h3 {
    border-bottom: 1px solid var(--color-separator);
    margin: 0 0 0 1rem;
    padding: 0 1rem 0 0;
  }
  h4 { margin: 0; }
  div + div > h3 { margin-top: var(--grid-gutter); }
  p {
    margin: 0;
    padding-left: 1rem;
  }
  ul {
    list-style: none;
    margin: 0;
  }
  ul:not(.mini) li {
  }
  li {
  }
  li:hover {
  }
  header {
    display: flex;
    justify-content: space-between;
  }
  small {
    padding-left: 0.5rem;
    white-space: nowrap;
  }
  .is-active-exact {
    background: var(--color-background);
    border-left: 3px solid var(--color-primary);
    position: relative;
    z-index: 3;
  }
</style>

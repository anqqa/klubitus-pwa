<template>

  <section>
    <div v-for="group in groupList" :key="group.id">
      <h3 class="h6 has-text-tertiary">{{ group.name }}</h3>
      <ul :class="{'mini': mini}">
        <template v-for="area in group.areas">
          <li v-if="area.url" :key="area.id">
            <nuxt-link :to="area.url">
              <h4>{{ area.name }}</h4>
            </nuxt-link>
          </li>
          <li v-else :key="area.id">
            <a>
              <h4><span class="icon"><i class="bx bx-lock" /></span> {{ area.name }}</h4>
            </a>
          </li>
        </template>
      </ul>
    </div>
  </section>

</template>


<script>
  import { slug } from '../../utils/text';

  export default {

    props: {
      areas: { default: () => [], type: Array },
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
              url: this.$auth.loggedIn || !area.is_private
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
  h3 {
    border-bottom: 1px solid var(--color-separator);
    margin: 0 0 0 1rem;
    padding: 0 1rem 0 0;
  }
  ul {
    list-style: none;
    margin: 0 0 var(--grid-gutter);
  }
  a {
    display: block;
    padding: 0.5rem 1rem;
  }
  a[href]:hover {
    background: var(--color-separator);
    text-decoration: none;
  }
  a.is-active-exact {
    background: var(--color-background);
    border-left: 3px solid var(--color-primary);
    position: relative;
    z-index: 3;
  }
  h4 {
    margin: 0;
  }
</style>

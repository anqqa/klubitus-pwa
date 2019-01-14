<template>

  <section :class="{ collapsed }">
    <header class="show-phone" @click="toggleList">
      <h2>
        <span>Areas</span>
        <span class="icon has-text-secondary">
          <i :class="`${collapsed ? 'bx-chevrons-down' : 'bx-chevrons-up'}`" class="bx" />
        </span>
      </h2>
    </header>

    <div v-for="group in groupList" :key="group.id" class="collapsible">
      <h3 class="h6 has-text-tertiary">{{ group.name }}</h3>
      <ul>

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
  import { mapGetters } from 'vuex';

  import { slug } from '../../utils/text';


  export default {

    props: {
      areas: { default: () => [], type: Array },
    },

    data() {
      return { collapsed: true };
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
              url: this.isAuthenticated || !area.is_private
                     ? this.localePath({ name: 'forum-area', params: { area: `${area.id}-${slug(area.name)}` }})
                     : null,
            });

          }
        });

        return groups;
      },

      ...mapGetters({
        isAuthenticated: 'auth/isAuthenticated',
      })
    },

    methods: {
      toggleList() {
        this.collapsed = !this.collapsed;
      }
    }

  };
</script>


<style scoped>

</style>

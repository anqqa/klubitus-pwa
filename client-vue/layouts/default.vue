<template>
  <v-app dark>

    <v-navigation-drawer
      :value="sidebar"
      app
      class="grey darken-4"
      clipped
      fixed
      width="220"
    >
      <v-list class="grey darken-4" dense>
        <v-list-tile
          v-for="(item, index) in items"
          :key="index"
          :to="item.to"
          router
        >
          <v-list-tile-action>
            <v-icon v-html="item.icon" />
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title" />
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <v-toolbar app clipped-left dense flat>
      <v-toolbar-side-icon @click="toggleSidebar">
        <v-icon>fas fa-bars</v-icon>
      </v-toolbar-side-icon>
      <img class="hidden-xs-only mx-3 logo" src="/logo.svg">
      <v-toolbar-title class="hidden-xs-only" v-text="title" />
      <v-spacer />
      <v-layout align-center row>
        <v-text-field
          append-icon="fas fa-search"
          hide-details
          placeholder="Search..."
          single-line
        />
      </v-layout>
      <v-toolbar-items class="ml-3">
        <v-btn v-if="$auth.state.loggedIn" flat @click="logout">Logout</v-btn>
        <v-btn v-if="!$auth.state.loggedIn" flat router to="/login">Login</v-btn>
        <v-btn v-if="!$auth.state.loggedIn" flat router to="/register">Register</v-btn>
      </v-toolbar-items>
    </v-toolbar>

    <v-content>
      <nuxt />
    </v-content>

    <v-footer app inset>
      <span class="pa-3"> &copy; 2000 &ndash; 2018 Klubitus</span>
    </v-footer>

  </v-app>
</template>


<script>
  import { mapMutations } from 'vuex';

  export default {

    data () {
      return {
        drawer: true,
        items: [
          { icon: 'fas fa-home fa-fw', title: 'Home', to: '/' },
          { icon: 'far fa-calendar-alt fa-fw', title: 'Events', to: '/events' },
          { icon: 'far fa-comments fa-fw', title: 'Forum', to: '/forum' },
          { icon: 'far fa-images fa-fw', title: 'Galleries', to: '/galleries' }
        ],
        title: 'Klubitus'
      }
    },

    computed: {
      sidebar () { return this.$store.state.ui.sidebar }
    },

    methods: {
      async logout() {
        try {
          await this.$auth.logout();
        }
        catch (error) {}
        finally {
          this.$axios.setToken(false);
        }
      },
      ...mapMutations({
        toggleSidebar: 'ui/toggleSidebar'
      })
    }

  }
</script>


<style>
  .logo {
    height: 35px;
    width: 35px;
  }
</style>

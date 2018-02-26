<template>
  <v-app dark>

    <v-navigation-drawer
      v-model="drawer"
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
          exact
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
      <v-toolbar-side-icon @click="drawer = !drawer" />
      <img class="hidden-xs-only mx-3 logo" src="/logo.svg" />
      <v-toolbar-title class="hidden-xs-only" v-text="title" />
      <v-spacer />
      <v-layout align-center row>
        <v-text-field
          append-icon="search"
          hide-details
          placeholder="Search..."
          single-line
        />
      </v-layout>
      <v-toolbar-items class="ml-3">
        <v-btn flat router to="/signin">Sign In</v-btn>
      </v-toolbar-items>
    </v-toolbar>

    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>

    <v-footer app inset>
      <span class="pa-3"> &copy; 2000 &ndash; 2018 Klubitus</span>
    </v-footer>

  </v-app>
</template>


<script>
  export default {
    data () {
      return {
        drawer: true,
        items: [
          { icon: 'home', title: 'Home', to: '/' },
          { icon: 'date_range', title: 'Events', to: '/events' },
          { icon: 'forum', title: 'Forum', to: '/forum' },
          { icon: 'photo_camera', title: 'Galleries', to: '/galleries' }
        ],
        title: 'Klubitus'
      }
    }
  }
</script>


<style>
  .logo {
    height: 35px;
    width: 35px;
  }
</style>

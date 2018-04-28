<template>
  <v-app :dark="theme === 'dark'">

    <v-navigation-drawer
      :class="theme === 'dark' ? 'grey darken-4' : ''"
      :value="sidebar"
      app
      clipped
      fixed
      width="220"
    >
      <v-list class="transparent" dense>
        <v-list-tile
          v-for="(item, index) in items"
          :key="index"
          :to="item.to"
          :exact="item.exact"
          nuxt
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

    <v-footer app inset class="pr-1">
      <span class="ml-3 hidden-xs-only"> &copy; 2000 &ndash; 2018 Klubitus</span>

      <v-spacer />

      <v-icon small class="text--secondary mr-2">fas fa-language</v-icon>
      <v-btn-toggle v-model="locale">
        <v-btn v-for="locale in $i18n.locales"
               :key="locale.code"
               :to="switchLocalePath(locale.code)"
               :value="locale.code"
               flat
               nuxt
               small>{{ locale.name }}</v-btn>
      </v-btn-toggle>

      <v-icon small class="text--secondary ml-3 mr-2">fas fa-adjust</v-icon>
      <v-btn-toggle v-model="theme">
        <v-btn flat small value="dark">Dark</v-btn>
        <v-btn flat small value="light">Light</v-btn>
      </v-btn-toggle>
    </v-footer>

  </v-app>
</template>


<script>
  import { mapMutations } from 'vuex';

  export default {

    data() {
      return {
        drawer: true,
        items: [
          { icon: 'fas fa-home fa-fw', title: 'Home', to: this.localePath('index'), exact: true },
          { icon: 'far fa-calendar-alt fa-fw', title: 'Events', to: this.localePath('events') },
          { icon: 'far fa-comments fa-fw', title: 'Forum', to: this.localePath('forum') },
          { icon: 'far fa-images fa-fw', title: 'Galleries', to: this.localePath('galleries') }
        ],
        title: 'Klubitus'
      }
    },

    computed: {
      locale: {
        get() { return this.$i18n.locale; },
        set() {},
      },
      sidebar() { return this.$store.state.ui.sidebar },
      theme: {
        get() { return this.$store.state.ui.theme; },
        set(theme) { this.toggleTheme(theme); },
      },
    },

    methods: {
      async logout() {
        try {
          await this.$auth.logout();
        }
        // catch (error) {}
        finally {
          this.$axios.setToken(false);
        }
      },
      ...mapMutations({
        toggleSidebar: 'ui/toggleSidebar',
        toggleTheme:   'ui/toggleTheme',
      })
    }

  }
</script>


<style scoped>
  .logo {
    height: 35px;
    width: 35px;
  }
</style>

<template>
  <div>

    <nav class="navbar" role="navigation">
      <div class="navbar-brand">
        <a role="button" class="navbar-item" data-target="mainMenu" @click="toggleSidebar">
          <span class="icon"><i class="fas fa-bars" /></span>
        </a>

        <nuxt-link to="/" class="navbar-item">
          <img class="navbar-item" height="35" src="/logo.svg" width="35">
          {{ title }}
        </nuxt-link>
      </div>

      <div class="navbar-menu is-active">
        <div class="navbar-start">
          <div class="navbar-item is-expanded">
            <div class="field">
              <b-autocomplete icon="search" placeholder="Search..." />
            </div>
          </div>
        </div>

        <div class="navbar-end">
          <div v-if="$auth.loggedIn" class="navbar-item">
            <button class="button" @click="logout">Logout</button>
          </div>
          <div v-if="!$auth.loggedIn" class="navbar-item">
            <nuxt-link :to="localePath('login')" class="button">Login</nuxt-link>
          </div>
          <div v-if="!$auth.loggedIn" class="navbar-item">
            <nuxt-link :to="localePath('register')" class="button">Register</nuxt-link>
          </div>
        </div>
      </div>
    </nav>

    <div class="columns">

      <div class="column is-narrow">
        <nav class="menu" role="navigation" aria-label="main navigation">
          <ul class="menu-list">
            <li v-for="(item, index) in items" :key="index">
              <nuxt-link :exact="item.exact" :to="item.url" active-class="is-active">
                <span class="icon is-small"><i :class="item.icon" /></span>
                {{ item.title }}
              </nuxt-link>

              <ul v-if="item.items" class="menu-list">
                <li v-for="(subItem, subIndex) in item.items" :key="subIndex">
                  <nuxt-link :exact="subItem.exact"
                             :to="subItem.url"
                             active-class="is-active"
                             v-text="subItem.title" />
                </li>
              </ul>
            </li>
          </ul>
        </nav>
      </div>

      <nuxt />

    </div>

    <footer class="columns">
      <div class="level container is-fluid">

        <div class="level-left is-hidden-mobile">
          <span class="level-item">&copy; 2000 &ndash; 2018 Klubitus</span>
        </div>

        <div class="level-right">
          <div class="level-item">
            <span class="icon"><i class="fas fa-language" /></span>
          </div>
          <div class="level-item">
            <div class="buttons has-addons">
              <nuxt-link v-for="locale in $i18n.locales"
                         :key="locale.code"
                         :to="switchLocalePath(locale.code)"
                         :value="locale.code"
                         active-class="is-selected is-primary"
                         class="button is-small">{{ locale.name }}</nuxt-link>
            </div>
          </div>
        </div>

      </div>
    </footer>

  </div>
</template>


<script>
  import { mapMutations } from 'vuex';

  export default {

    data() {
      return {
        drawer: true,
        items: [
          { icon: 'fas fa-home',         title: 'Home',      url: this.localePath('index'), exact: true },
          { icon: 'far fa-calendar-alt', title: 'Events',    url: this.localePath('events') },
          { icon: 'far fa-comments',     title: 'Forum',     url: this.localePath('forum') },
          { icon: 'far fa-images',       title: 'Galleries', url: this.localePath('galleries'), items: [
              { title: 'Events', url: this.localePath('galleries-events') },
              { title: 'Flyers', url: this.localePath('galleries-flyers') },
            ]}
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
  nav.navbar img {
    padding: 0;
  }

  nav.menu {
    width: 220px;
  }
</style>

<template>
  <div :data-theme="theme" class="layout">

    <header>
      <nav class="navbar" role="navigation">
        <div class="is-left">
          <a class="show-phone" role="button" data-target="mainMenu" @click="toggleSidebar">
            <span class="icon"><i class="fas fa-bars" /></span>
          </a>

          <nuxt-link to="/" class="hide-phone">
            <img src="/logo.svg"> {{ title }}
          </nuxt-link>
        </div>

        <div class="is-center">
          <div class="navbar-item is-expanded">
            <div class="field">
              <b-autocomplete icon="search" placeholder="Search..." />
            </div>
          </div>
        </div>

        <div class="is-right">
          <button v-if="$auth.loggedIn" @click="logout">Logout</button>
          <nuxt-link v-if="!$auth.loggedIn" :to="localePath('login')" class="button">Login</nuxt-link>
          <nuxt-link v-if="!$auth.loggedIn" :to="localePath('register')" class="button">Register</nuxt-link>
        </div>
      </nav>
    </header>

    <nav class="menu" role="navigation" aria-label="main navigation">
      <ul>
        <li v-for="(item, index) in items" :key="index">
          <nuxt-link :exact="item.exact" :to="item.url" active-class="is-active">
            <span class="icon is-small"><i :class="item.icon" /></span>
            {{ item.title }}
          </nuxt-link>

          <ul v-if="item.items">
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

    <nuxt />

    <footer>
      <nav class="navbar">

        <div class="is-left hide-phone">
          &copy; 2000 &ndash; 2018 Klubitus
        </div>

        <div class="is-right">
          <span class="icon"><i class="fas fa-language" /></span>
          <div class="button-group">
            <nuxt-link v-for="locale in $i18n.locales"
                       :key="locale.code"
                       :to="switchLocalePath(locale.code)"
                       :value="locale.code"
                       active-class="is-active is-primary"
                       class="button is-small">{{ locale.name }}</nuxt-link>
          </div>
        </div>

      </nav>
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

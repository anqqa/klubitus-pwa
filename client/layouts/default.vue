<template>
  <div :class="`theme-${theme} ${sidebar}`" class="layout">

    <header>
      <nav class="navbar" role="navigation">
        <div class="is-left">
          <button role="button" @click="toggleSidebar">
            <span class="icon"><i class="bx bx-menu" /></span>
          </button>
        </div>

        <div class="is-center">
          <nuxt-link to="/">
            <img src="/logo.svg"> <span class="hide-phone">{{ title }}</span>
          </nuxt-link>
        </div>

        <div class="is-right">
          <div class="navbar-item is-expanded">
            <div class="field">
              <input type="text" placeholder="Search...">
            </div>
          </div>
        </div>
      </nav>
    </header>

    <div class="sidebar">
      <section class="user">
        <button v-if="$auth.loggedIn" @click="logout">Logout</button>
        <nuxt-link v-if="!$auth.loggedIn" :to="localePath('login')" class="button">Login</nuxt-link>
        <nuxt-link v-if="!$auth.loggedIn" :to="localePath('register')" class="button">Register</nuxt-link>
      </section>

      <nav class="menu" role="navigation" aria-label="main navigation">
        <ul>
          <li v-for="(item, index) in items" :key="index">
            <nuxt-link :exact="item.exact" :to="item.url">
              {{ item.title }}
            </nuxt-link>

            <ul v-if="item.items">
              <li v-for="(subItem, subIndex) in item.items" :key="subIndex">
                <nuxt-link :exact="subItem.exact"
                           :to="subItem.url"
                           v-text="subItem.title" />
              </li>
            </ul>
          </li>
        </ul>
      </nav>

      <section class="ui">
        <span class="icon"><i class="bx bx-world" /></span>
        <div class="button-group">
          <nuxt-link v-for="locale in $i18n.locales"
                     :key="locale.code"
                     :to="switchLocalePath(locale.code)"
                     :value="locale.code"
                     active-class="is-primary"
                     class="button is-small">{{ locale.name }}</nuxt-link>
        </div>

        <span class="icon"><i class="bx bx-adjust" /></span>
        <div class="button-group">
          <button v-for="availableTheme in ['light', 'dark']"
                  :key="availableTheme"
                  :class="theme === availableTheme ? 'is-active is-primary' : ''"
                  class="button is-small"
                  @click="toggleTheme(availableTheme)">{{ availableTheme }}</button>
        </div>
      </section>

    </div>

    <nuxt />

    <footer>
      <nav class="navbar">

        <div class="is-left hide-phone">
          &copy; 2000 &ndash; 2018 Klubitus
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
          { title: 'Home',      url: this.localePath('index'), exact: true },
          { title: 'Events',    url: this.localePath('events') },
          { title: 'Forum',     url: this.localePath('forum') },
          { title: 'Galleries', url: this.localePath('galleries'), items: [
              { title: 'Events', url: this.localePath('galleries-events-year-month-day') },
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
      sidebar() { return this.$store.state.ui.sidebar ? 'has-sidebar' : '' },
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

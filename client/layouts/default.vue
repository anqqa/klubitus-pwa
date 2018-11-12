<template>
  <div :class="`theme-${theme} ${sidebar}`" class="layout">

    <header class="navbar">
      <section class="navbar-section">
        <nuxt-link class="brand" to="/">
          <img src="/logo.svg" align="center"> {{ title }}
        </nuxt-link>

        <nav role="navigation" aria-label="main navigation">
          <nuxt-link v-for="(item, index) in items" :key="index" :exact="item.exact" :to="item.url">
            <span class="icon"><i :class="item.icon" /></span>
            <span class="label">{{ item.title }}</span>
          </nuxt-link>
        </nav>
      </section>

      <section class="navbar-section">
        <nav class="search">
          <div class="navbar-item is-expanded">
            <div class="field">
              <input type="text" placeholder="Search...">
            </div>
          </div>

          <section class="user">
            <button v-if="isAuthenticated" @click="logout">Logout</button>
            <nuxt-link v-if="!isAuthenticated" :to="localePath('login')" class="button">Login</nuxt-link>
            <nuxt-link v-if="!isAuthenticated" :to="localePath('register')" class="button">Register</nuxt-link>
          </section>
        </nav>
      </section>
    </header>

    <nuxt />

    <footer>
      <nav class="navbar">

        <div class="navbar-section hide-phone">
          &copy; 2000 &ndash; 2018 Klubitus
        </div>

        <div class="navbar-section is-right">
          <div class="button-group language">
            <nuxt-link v-for="locale in $i18n.locales"
                       :key="locale.code"
                       :to="switchLocalePath(locale.code)"
                       :value="locale.code"
                       active-class="is-primary"
                       class="button is-tiny">{{ locale.name }}</nuxt-link>
          </div>

          <div class="theme">
            <button :class="{'is-hidden': theme === 'light'}"
                    class="button is-tiny"
                    @click="toggleTheme('light')">
              <span class="icon is-small"><i class="bx bx-moon" /></span>
            </button>

            <button :class="{'is-hidden': theme === 'dark'}"
                    class="button is-tiny"
                    @click="toggleTheme('dark')">
              <span class="icon is-small"><i class="bx bx-sun" /></span>
            </button>
          </div>
        </div>

      </nav>
    </footer>

  </div>
</template>


<script>
  import { mapGetters, mapMutations } from 'vuex';

  import { Actions } from '../store/auth';


  export default {

    data() {
      return {
        drawer: true,
        items: [
          { title: 'Home',      icon: 'bx bx-home-alt', url: this.localePath('index'), exact: true },
          { title: 'Events',    icon: 'bx bx-calendar', url: this.localePath('events') },
          { title: 'Forum',     icon: 'bx bx-message',  url: this.localePath('forum') },
          { title: 'Galleries', icon: 'bx bx-images',   url: this.localePath('galleries'), },
          { title: 'Music',     icon: 'bx bx-music',    url: this.localePath('music') },
        ],
        title: 'Klubitus'
      }
    },

    computed: {
      // isAuthenticated() { return !!this.$store.state.auth.user; },
      locale: {
        get() { return this.$i18n.locale; },
        set() {},
      },
      sidebar() { return this.$store.state.ui.sidebar ? 'has-sidebar' : '' },
      theme: {
        get() { return this.$store.state.ui.theme; },
        set(theme) { this.toggleTheme(theme); },
      },
      ...mapGetters({
        isAuthenticated: 'auth/isAuthenticated',
      })
    },

    methods: {
      async logout() {
        await this.$store.dispatch(`auth/${Actions.LOGOUT}`);
      },
      ...mapMutations({
        toggleSidebar: 'ui/toggleSidebar',
        toggleTheme:   'ui/toggleTheme',
      })
    }

  }
</script>

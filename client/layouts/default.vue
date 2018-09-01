<template>
  <div :class="`theme-${theme} ${sidebar}`" class="layout">

    <header class="navbar">
      <nuxt-link class="brand" to="/">
        <img src="/logo.svg" align="center"> {{ title }}
      </nuxt-link>

      <nav role="navigation" aria-label="main navigation">
        <nuxt-link v-for="(item, index) in items" :key="index" :exact="item.exact" :to="item.url">
          <span class="icon"><i :class="item.icon" /></span>
          <span class="label">{{ item.title }}</span>
        </nuxt-link>
      </nav>

      <nav class="search">
        <div class="navbar-item is-expanded">
          <div class="field">
            <input type="text" placeholder="Search...">
          </div>
        </div>

        <section class="user">
          <button v-if="$auth.loggedIn" @click="logout">Logout</button>
          <nuxt-link v-if="!$auth.loggedIn" :to="localePath('login')" class="button">Login</nuxt-link>
          <nuxt-link v-if="!$auth.loggedIn" :to="localePath('register')" class="button">Register</nuxt-link>
        </section>
      </nav>
    </header>

    <nuxt />

    <footer>
      <nav class="navbar">

        <div class="is-left hide-phone">
          &copy; 2000 &ndash; 2018 Klubitus
        </div>

        <div class="is-right">
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
  import { mapMutations } from 'vuex';

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

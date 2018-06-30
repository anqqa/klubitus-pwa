const nodeExternals = require('webpack-node-externals');

module.exports = {

  /**
   * Headers of the page
   */
  head: {
    title: 'Klubitus',
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet',
        href: 'https://use.fontawesome.com/releases/v5.0.10/css/all.css',
        integrity: 'sha384-+d0P83n9kaQMCwj8F4RJB66tzIwOKmrdb46+porD/OvrJ+37WqIM7UoBtwHO6Nlg',
        crossorigin: 'anonymous' },
      { rel: 'stylesheet', href: 'https://unpkg.com/normalize.css' },
      { rel: 'stylesheet', href: '/style/klubitus.css' },
    ],
  },
  meta: {
    description: 'Clubbers guide to... Finland',
  },
  // css: ['~/assets/style/klubitus.css'],
  plugins: ['~/plugins/axios', '~/plugins/vue-plugins'],

  /**
   * Customize the progress bar color
    */
  loading: { color: '#E91E63' },

  /**
   * Custom routes
   */
  router: {
    extendRoutes (routes, resolve) {
      routes.push({
        name:      'events-week',
        path:      '/events/:year/wk:week',
        component: resolve(__dirname, 'pages/events/index.vue'),
      });
      routes.push({
        name:      'events-date',
        path:      '/events/:year/:month/:day?',
        component: resolve(__dirname, 'pages/events/index.vue'),
      });

      routes.push({
        name:      'galleries-date',
        path:      '/galleries/events/:year/:month?/:day?',
        component: resolve(__dirname, 'pages/galleries/index.vue'),
      })
    },
  },

  /**
   * Global modules
   */
  modules: [
    ['@nuxtjs/auth', {
      cookie:       { options: { expires: 30 } },
      redirect:     {
        callback: '/en/login',
        login:    '/en/login',
      },
      resetOnError: true,
      strategies:   {
        local: {
          endpoints: {
            login:  { url: '/auth/login', method: 'post', propertyName: 'token' },
            logout: { url: '/auth/logout', method: 'post' },
            user:   { url: '/auth/me', method: 'get', propertyName: 'data' }
          },
        },
      },
    }],

    ['@nuxtjs/axios', {
      debug: true,
      host:  'localhost',
      port:  3001,
    }],

    ['@nuxtjs/markdownit', {
      breaks:      true,
      injected:    true,
      linkify:     true,
      typographer: true,
      use: [
        ['markdown-it-link-attributes', [{
          pattern: /^(https?:)?\/\/([\w.]*\.)?klubitus\.org/,
          attrs:   {
            class:  'internal-link',
          }}, {
          attrs: {
            class:  'external-link',
            rel:    'noopener',
            target: '_blank',
          },
        }]],
      ]
    }],

    ['@nuxtjs/pwa', { icon: false }],

    ['nuxt-i18n', {
      defaultLocale:         'en',
      locales:               [
        { code: 'en', iso: 'en-US', langFile: 'en-US.js', name: 'English' },
        { code: 'fi', iso: 'fi-FI', langFile: 'fi-FI.js', name: 'suomi' },
      ],
      noPrefixDefaultLocale: false,
      redirectRootToLocale:  'en',
      routes:                {
        'events/index': { fi: '/tapahtumat' },
        'events/_id':   { fi: '/tapahtumat/:id' },
        'events-date':  { fi: '/tapahtumat/:year/:month/:day?' },
        'events-week':  { fi: '/tapahtumat/:year/vk:week' },

        'forum/topic/_id': { fi: '/forum/aihe/:id' },

        'galleries/index':  { fi: '/kuvastot' },
        'galleries-date':   { fi: '/kuvastot/tapahtumat/:year/:month?/:day?' },
        'galleries/flyers': { fi: '/kuvastot/flyerit' },

        'login':    { fi: '/kirjaudu' },
        'password': { fi: '/salasana' },
        'register': { fi: '/liity' },
      },
      vueI18n:               {
        fallbackLocale: 'en',
      },
    }],
  ],

  /**
   * PWA
   */
  manifest: {
    background_color: '#212121',
    name:             'Klubitus',
    short_name:       'Klubitus',
  },

  /**
   * Build configuration
   */
  build: {
    /**
     * Run ESLint on save
     */
    extend (config, ctx) {
      // if (ctx.isDev && ctx.isClient) {
      //   config.module.rules.push({
      //     enforce: 'pre',
      //     test:    /\.(js|vue)$/,
      //     loader:  'eslint-loader',
      //     exclude: /(node_modules)/
      //   });
      // }

      if (ctx.isServer) {
        config.externals = [
          nodeExternals({
            whitelist: [/\.css$/]
          })
        ]
      }
    },

    extractCSS: true,
  },

};

const nodeExternals = require('webpack-node-externals');

module.exports = {
  /**
   * Headers of the page
   */
  head: {
    title: 'Klubitus',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Clubbers guide to... Finland' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700' },
      // { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons' },
    ],
  },
  css: ['~/assets/style/app.styl'],
  /**
   * Customize the progress bar color
    */
  loading: { color: '#3B8070' },

  /**
   * Custom routes
   */
  router: {
    extendRoutes (routes, resolve) {
      routes.push({
        name:      'events-week',
        path:      '/events/:year/week/:week',
        component: resolve(__dirname, 'pages/events/index.vue'),
      });
      routes.push({
        name:      'events-date',
        path:      '/events/:year/:month/:day?',
        component: resolve(__dirname, 'pages/events/index.vue'),
      });
    },
  },

  /**
   * Global modules
   */
  modules: [
    ['@nuxtjs/auth', {
      cookie: {
        options: { expires: 30 },
      },
      endpoints: {
        login:  { url: '/auth/login', method: 'post', propertyName: 'token' },
        logout: { url: '/auth/logout', method: 'post' },
        user:   { url: '/auth/me', method: 'get', propertyName: 'data' }
      },
      resetOnError: true,
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
        'events/_id': { fi: '/tapahtumat/:id' },
        'events-date': { fi: '/tapahtumat/:year/:month/:day?' },
        'events-week': { fi: '/tapahtumat/:year/viikko/:week' },

        'login': { fi: '/kirjaudu' },
        'password': { fi: '/salasana' },
        'register': { fi: '/liity' },
      },
      vueI18n:               {
        fallbackLocale: 'en',
      },
    }],
  ],

  plugins: ['~/plugins/axios', '~/plugins/fontawesome.js', '~/plugins/vuetify.js', '~/plugins/vue-plugins'],

  /**
   * Build configuration
   */
  build: {
    babel: {
      plugins: [
        ['transform-imports', {
          'vuetify': {
            'transform':         'vuetify/es5/components/${member}',
            'preventFullImport': true
          }
        }]
      ]
    },
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
            whitelist: [/^vuetify/]
          })
        ]
      }

      // Font Awesome tree shaking (doesn't seem to be working atm)
      // config.resolve.alias = {
      //   ...config.resolve.alias,
      //   '@fortawesome/fontawesome-free-brands$': '@fortawesome/fontawesome-free-brands/shakable.es.js',
      //   '@fortawesome/fontawesome-free-regular$': '@fortawesome/fontawesome-free-regular/shakable.es.js',
      //   '@fortawesome/fontawesome-free-solid$': '@fortawesome/fontawesome-free-solid/shakable.es.js',
      // };

    },
    extractCSS: true,
    vendor: ['vuetify'],
  },

};

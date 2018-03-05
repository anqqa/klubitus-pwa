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
      { hid: 'description', name: 'description', content: 'PWA client for Klubitus with Nuxt.js and Vuetify.js' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons' },
    ]
  },
  plugins: ['~/plugins/vuetify.js'],
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
        name:      'events-year-week',
        path:      '/events/:year/week/:week',
        component: resolve(__dirname, 'pages/events/index.vue'),
      });
      routes.push({
        name:      'events-year-month-day',
        path:      '/events/:year/:month/:day?',
        component: resolve(__dirname, 'pages/events/index.vue'),
      })
    },
  },

  /**
   * Global modules
   */
  modules: ['@nuxtjs/axios'],
  axios: {
    debug: true,
    host: 'localhost',
    port: 3001,
  },

  /**
   * Build configuration
   */
  build: {
    babel: {
      plugins: [
        ["transform-imports", {
          "vuetify": {
            "transform": "vuetify/es5/components/${member}",
            "preventFullImport": true
          }
        }]
      ]
    },
    vendor: ['vuetify'],
    extractCSS: true,
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
    }
  },

};

const nodeExternals = require('webpack-node-externals');

module.exports = {

  /**
   * Headers of the page
   */
  head: {
    title: 'Klubitus',
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://unpkg.com/normalize.css@8.0.0/normalize.css' },
      { rel: 'stylesheet', href: 'https://unpkg.com/boxicons@1.1.0/css/boxicons.min.css' },
    ],
  },
  meta: {
    description: 'Clubbers guide to... Finland',
  },
  css: ['~/assets/style/klubitus.css'],
  plugins: ['~/plugins/axios', '~/plugins/vue-plugins'],

  /**
   * Customize the progress bar color
    */
  loading: { color: '#E91E63' },

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
      defaultLocale: 'en',
      locales: [
        { code: 'en', iso: 'en-US', langFile: 'en.js', name: 'English' },
        { code: 'fi', iso: 'fi-FI', langFile: 'fi.js', name: 'suomi' },
      ],

      pages: {
        'events/index':                { fi: '/tapahtumat' },
        'events/_id':                  { fi: '/tapahtumat/:id' },
        'events/_year/wk/_week/index': { fi: '/tapahtumat/:year/vk/:week' },
        'events/_year/_month/_day':    { fi: '/tapahtumat/:year/:month/:day?' },

        'forum/topic/_id': { fi: '/forum/aihe/:id' },

        'galleries/index':                     { fi: '/kuvastot' },
        'galleries/events':                    { fi: '/kuvastot/tapahtumat' },
        'galleries/events/_year/_month/index': { fi: '/kuvastot/tapahtumat/:year/:month?' },
        'galleries/events/_year/_month/_day':  { fi: '/kuvastot/tapahtumat/:year/:month?/:day?' },
        'galleries/flyers':                    { fi: '/kuvastot/flyerit' },
        'galleries/_id':                       { fi: '/kuvastot/:id' },

        'login':    { fi: '/kirjaudu' },
        'password': { fi: '/salasana' },
        'register': { fi: '/liity' },
      },
      parsePages: false,
      rootRedirect: 'en',
      strategy: 'prefix',

      vueI18n: {
        fallbackLocale: 'en',
      },
    }],
  ],

  router: {
    linkActiveClass:      'is-active',
    linkExactActiveClass: 'is-active-exact',
  },

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

    postcss: {
      plugins: {
        'postcss-cssnext': {
          features: { customProperties: false },
        },
      },
    },
  },

};

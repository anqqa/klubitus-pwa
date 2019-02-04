// import nodeExternals from 'webpack-node-externals';

export default {
  env: {
    API_URL:  process.env.API_URL_BROWSER || 'http://localhost:3001',
    BASE_URL: process.env.CLIENT_HOST || 'http://localhost:3000',
    CDN_HOST: process.env.AWS_BUCKET,
  },

  server: {
    host: process.env.CLIENT_HOST ? '0.0.0.0' : 'localhost',
    port: process.env.CLIENT_PORT || 3000,
  },

  srcDir:   'src/',
  watchers: { webpack: { poll: true }},


  /**
   * Headers of the page
   */
  head: {
    title: 'Klubitus',
    link: [
      { rel: 'icon', type: 'image/png', href: '/favicon.png' },
      { rel: 'stylesheet', href: 'https://unpkg.com/normalize.css@8.0.0/normalize.css' },
      { rel: 'stylesheet', href: 'https://unpkg.com/boxicons@1.7.1/css/boxicons.min.css' },
    ],
  },
  meta: {
    description: 'Clubbers guide to... Finland',
  },
  css: ['@/assets/style/klubitus.scss'],
  plugins: ['~/plugins/axios', '~/plugins/vue-plugins'],

  /**
   * Customize the progress bar color
   */
  loading: { color: '#E91E63' },


  /**
   * Global modules
   */
  modules: [
    ['@nuxtjs/axios', {
      debug: process.env.NODE_ENV === 'development',
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
        'galleries/upload':                    { fi: '/kuvastot/upload' },
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
    // extend (config, ctx) {
      // if (ctx.isDev && ctx.isClient) {
      //   config.module.rules.push({
      //     enforce: 'pre',
      //     test:    /\.(js|vue)$/,
      //     loader:  'eslint-loader',
      //     exclude: /(node_modules)/
      //   });
      // }

      // if (ctx.isServer) {
      //   config.externals = [
      //     nodeExternals({
      //       whitelist: [/\.css$/]
      //     })
      //   ]
      // }
    // },

    extractCSS: true,

    postcss: {
      preset: {
        features: { customProperties: false },
      },
    },
  },

};
